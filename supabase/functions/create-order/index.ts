import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartItem {
  product_id: string;
  quantity: number;
  price_snapshot: number;
}

interface OrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method: 'mercadopago' | 'bank_transfer';
  customer_notes?: string;
  items: CartItem[];
  cart_session_id: string;
}

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

    const orderRequest: OrderRequest = await req.json();

    // Validate request
    if (!orderRequest.items || orderRequest.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    if (!orderRequest.customer_name || !orderRequest.customer_email || !orderRequest.customer_phone) {
      throw new Error('Información de cliente incompleta');
    }

    // Start transaction-like operations
    const productIds = orderRequest.items.map(item => item.product_id);

    // Fetch products with FOR UPDATE lock (simulate in Supabase)
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('id, name, description, category, image_url, price, stock_quantity, reserved_quantity')
      .in('id', productIds);

    if (productsError) {
      throw new Error(`Error al obtener productos: ${productsError.message}`);
    }

    if (!products || products.length !== orderRequest.items.length) {
      throw new Error('Algunos productos no existen');
    }

    // Validate stock and prices
    const productsMap = new Map(products.map(p => [p.id, p]));
    let subtotal = 0;

    for (const item of orderRequest.items) {
      const product = productsMap.get(item.product_id);

      if (!product) {
        throw new Error(`Producto ${item.product_id} no encontrado`);
      }

      // Validate price (allow 1 cent tolerance for rounding)
      if (Math.abs(product.price - item.price_snapshot) > 0.01) {
        throw new Error(`El precio del producto ${product.name} ha cambiado. Por favor actualiza tu carrito.`);
      }

      // Check available stock (stock_quantity - reserved_quantity)
      const availableStock = product.stock_quantity - product.reserved_quantity;
      if (availableStock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${availableStock}`);
      }

      subtotal += item.price_snapshot * item.quantity;
    }

    const total = subtotal; // Add tax/shipping in future

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        customer_name: orderRequest.customer_name,
        customer_email: orderRequest.customer_email,
        customer_phone: orderRequest.customer_phone,
        subtotal,
        tax: 0,
        total,
        status: 'pending_payment',
        payment_method: orderRequest.payment_method,
        payment_status: 'pending',
        customer_notes: orderRequest.customer_notes || null
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Error al crear orden: ${orderError.message}`);
    }

    // Create order items (with product snapshot)
    const orderItems = orderRequest.items.map(item => {
      const product = productsMap.get(item.product_id)!;
      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name: product.name,
        product_description: product.description,
        product_category: product.category,
        product_image_url: product.image_url,
        quantity: item.quantity,
        unit_price: item.price_snapshot,
        subtotal: item.price_snapshot * item.quantity
      };
    });

    const { error: orderItemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      throw new Error(`Error al crear items de orden: ${orderItemsError.message}`);
    }

    // Create stock reservations (15 minutes)
    const reservations = orderRequest.items.map(item => ({
      product_id: item.product_id,
      order_id: order.id,
      quantity: item.quantity,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
    }));

    const { error: reservationsError } = await supabaseClient
      .from('stock_reservations')
      .insert(reservations);

    if (reservationsError) {
      throw new Error(`Error al crear reservas: ${reservationsError.message}`);
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        order_id: order.id,
        payment_method: orderRequest.payment_method,
        amount: total,
        currency: 'ARS',
        status: 'pending'
      })
      .select()
      .single();

    if (paymentError) {
      throw new Error(`Error al crear pago: ${paymentError.message}`);
    }

    // Clear cart
    if (orderRequest.cart_session_id) {
      await supabaseClient
        .from('cart_items')
        .delete()
        .eq('cart_session_id', orderRequest.cart_session_id);
    }

    // If Mercado Pago, create preference (TODO: Implement in Phase 3)
    let mp_preference_id = null;
    if (orderRequest.payment_method === 'mercadopago') {
      // TODO: Call Mercado Pago API to create preference
      // const preference = await createMercadoPagoPreference(order, orderItems);
      // mp_preference_id = preference.id;
      console.log('Mercado Pago integration pending - Phase 3');
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          total: order.total,
          payment_method: order.payment_method,
          mp_preference_id
        },
        payment: {
          id: payment.id,
          status: payment.status
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error creating order:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al crear orden'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
