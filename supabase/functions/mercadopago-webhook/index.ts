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

    const body = await req.json();

    console.log('Mercado Pago webhook received:', JSON.stringify(body, null, 2));

    // Mercado Pago sends notifications with different types
    // We're interested in "payment" type
    if (body.type !== 'payment') {
      return new Response(
        JSON.stringify({ message: 'Not a payment notification' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    const paymentId = body.data?.id;

    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: 'No payment ID in notification' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Get payment details from Mercado Pago
    const mpAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');

    if (!mpAccessToken) {
      throw new Error('Mercado Pago access token not configured');
    }

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      throw new Error(`Mercado Pago API error: ${errorText}`);
    }

    const paymentData = await mpResponse.json();

    console.log('Payment data from MP:', JSON.stringify(paymentData, null, 2));

    // Extract important data
    const orderId = paymentData.external_reference;
    const status = paymentData.status; // approved, rejected, pending, etc.
    const statusDetail = paymentData.status_detail;
    const transactionAmount = paymentData.transaction_amount;

    if (!orderId) {
      console.error('No external_reference in payment data');
      return new Response(
        JSON.stringify({ error: 'No order ID in payment' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Find the payment record in our database
    const { data: payments, error: paymentsError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('mp_payment_id', paymentId.toString())
      .limit(1);

    let payment;

    if (paymentsError || !payments || payments.length === 0) {
      // Payment doesn't exist yet, find by order_id
      const { data: orderPayments, error: orderPaymentsError } = await supabaseClient
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .eq('payment_method', 'mercadopago')
        .limit(1);

      if (orderPaymentsError || !orderPayments || orderPayments.length === 0) {
        console.error('Payment not found in database');
        return new Response(
          JSON.stringify({ error: 'Payment not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404
          }
        );
      }

      payment = orderPayments[0];
    } else {
      payment = payments[0];
    }

    // Update payment record
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        mp_payment_id: paymentId.toString(),
        mp_status: status,
        mp_status_detail: statusDetail,
        status: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending',
        amount: transactionAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      throw new Error(`Error updating payment: ${updateError.message}`);
    }

    // Update order status
    let orderStatus = 'payment_processing';
    let paymentStatus = 'pending';

    if (status === 'approved') {
      orderStatus = 'payment_confirmed';
      paymentStatus = 'approved';
    } else if (status === 'rejected') {
      orderStatus = 'cancelled';
      paymentStatus = 'rejected';
    }

    const { error: orderError } = await supabaseClient
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        paid_at: status === 'approved' ? new Date().toISOString() : null,
        cancelled_at: status === 'rejected' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('Error updating order:', orderError);
      throw new Error(`Error updating order: ${orderError.message}`);
    }

    // If approved, the trigger will automatically deduct stock

    console.log(`Order ${orderId} updated to status: ${orderStatus}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        order_id: orderId,
        payment_status: status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error processing webhook'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
