import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('order_id') as string;
    const bankReferenceNumber = formData.get('bank_reference_number') as string;

    if (!file || !orderId) {
      return new Response(
        JSON.stringify({ error: 'File and order_id are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 5MB' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Verify order exists
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('id, payment_method')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    if (order.payment_method !== 'bank_transfer') {
      return new Response(
        JSON.stringify({ error: 'Order is not a bank transfer payment' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}_${crypto.randomUUID()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('receipts')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: `Failed to upload file: ${uploadError.message}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    // Store file path (not public URL — bucket is private, use signed URLs)
    const filePath2 = uploadData?.path ?? filePath;
    const urlData = { publicUrl: filePath2 };

    // Update payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .select('id')
      .eq('order_id', orderId)
      .eq('payment_method', 'bank_transfer')
      .single();

    if (paymentError || !payment) {
      // Payment record doesn't exist, create one
      const { error: createError } = await supabaseClient
        .from('payments')
        .insert({
          order_id: orderId,
          payment_method: 'bank_transfer',
          amount: 0, // Will be filled by admin
          currency: 'ARS',
          status: 'pending',
          bank_receipt_url: filePath2,
          bank_reference_number: bankReferenceNumber || null
        });

      if (createError) {
        console.error('Error creating payment:', createError);
      }
    } else {
      // Update existing payment
      const { error: updateError } = await supabaseClient
        .from('payments')
        .update({
          bank_receipt_url: filePath2,
          bank_reference_number: bankReferenceNumber || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (updateError) {
        console.error('Error updating payment:', updateError);
      }
    }

    // Update order status to payment_review
    await supabaseClient
      .from('orders')
      .update({
        status: 'payment_review',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Receipt uploaded successfully',
        url: urlData.publicUrl,
        file_path: filePath
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error uploading receipt:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error uploading receipt'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
