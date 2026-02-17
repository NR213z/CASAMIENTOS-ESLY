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

    console.log('Starting cleanup process...');

    // 1. Call cleanup_expired_reservations function
    const { data: cleanupData, error: cleanupError } = await supabaseClient
      .rpc('cleanup_expired_reservations');

    if (cleanupError) {
      console.error('Error cleaning up reservations:', cleanupError);
    } else {
      console.log('Expired reservations cleaned up successfully');
    }

    // 2. Delete cart sessions older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: expiredSessions, error: sessionsError } = await supabaseClient
      .from('cart_sessions')
      .select('id')
      .lt('expires_at', sevenDaysAgo.toISOString());

    if (sessionsError) {
      console.error('Error fetching expired sessions:', sessionsError);
    } else if (expiredSessions && expiredSessions.length > 0) {
      console.log(`Found ${expiredSessions.length} expired cart sessions`);

      // Delete cart items first (foreign key)
      const sessionIds = expiredSessions.map(s => s.id);

      const { error: itemsError } = await supabaseClient
        .from('cart_items')
        .delete()
        .in('cart_session_id', sessionIds);

      if (itemsError) {
        console.error('Error deleting cart items:', itemsError);
      } else {
        console.log('Expired cart items deleted');
      }

      // Then delete sessions
      const { error: deleteError } = await supabaseClient
        .from('cart_sessions')
        .delete()
        .in('id', sessionIds);

      if (deleteError) {
        console.error('Error deleting cart sessions:', deleteError);
      } else {
        console.log('Expired cart sessions deleted');
      }
    } else {
      console.log('No expired cart sessions to clean');
    }

    // 3. Update order status for expired reservations without payment
    const { data: expiredOrders, error: ordersError } = await supabaseClient
      .from('orders')
      .select('id')
      .eq('status', 'pending_payment')
      .eq('payment_status', 'pending')
      .lt('created_at', new Date(Date.now() - 20 * 60 * 1000).toISOString()); // 20 minutes

    if (ordersError) {
      console.error('Error fetching expired orders:', ordersError);
    } else if (expiredOrders && expiredOrders.length > 0) {
      console.log(`Found ${expiredOrders.length} expired orders to cancel`);

      const { error: cancelError } = await supabaseClient
        .from('orders')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .in('id', expiredOrders.map(o => o.id));

      if (cancelError) {
        console.error('Error cancelling expired orders:', cancelError);
      } else {
        console.log('Expired orders cancelled');
      }
    } else {
      console.log('No expired orders to cancel');
    }

    // 4. Get statistics
    const stats = {
      reservations_cleaned: cleanupData ? 'success' : 'error',
      cart_sessions_deleted: expiredSessions?.length || 0,
      orders_cancelled: expiredOrders?.length || 0,
      timestamp: new Date().toISOString()
    };

    console.log('Cleanup completed:', stats);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cleanup completed successfully',
        stats
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error during cleanup:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error during cleanup'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
