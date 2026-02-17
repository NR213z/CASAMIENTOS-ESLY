-- RPC Function: Approve Bank Transfer Payment
CREATE OR REPLACE FUNCTION approve_bank_transfer_payment(
  payment_uuid UUID,
  admin_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  payment_record RECORD;
  result JSONB;
BEGIN
  -- Get payment record
  SELECT * INTO payment_record
  FROM payments
  WHERE id = payment_uuid
    AND payment_method = 'bank_transfer';

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment not found or not a bank transfer'
    );
  END IF;

  IF payment_record.status = 'approved' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment already approved'
    );
  END IF;

  -- Update payment
  UPDATE payments
  SET status = 'approved',
      reviewed_by = admin_user_id,
      reviewed_at = NOW(),
      updated_at = NOW()
  WHERE id = payment_uuid;

  -- Update order
  UPDATE orders
  SET status = 'payment_confirmed',
      payment_status = 'approved',
      paid_at = NOW(),
      updated_at = NOW()
  WHERE id = payment_record.order_id;

  -- The trigger will automatically deduct stock

  result := jsonb_build_object(
    'success', true,
    'message', 'Payment approved successfully',
    'order_id', payment_record.order_id
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Reject Bank Transfer Payment
CREATE OR REPLACE FUNCTION reject_bank_transfer_payment(
  payment_uuid UUID,
  admin_user_id UUID,
  reason TEXT
)
RETURNS JSONB AS $$
DECLARE
  payment_record RECORD;
  result JSONB;
BEGIN
  -- Get payment record
  SELECT * INTO payment_record
  FROM payments
  WHERE id = payment_uuid
    AND payment_method = 'bank_transfer';

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment not found or not a bank transfer'
    );
  END IF;

  IF payment_record.status = 'rejected' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment already rejected'
    );
  END IF;

  -- Update payment
  UPDATE payments
  SET status = 'rejected',
      reviewed_by = admin_user_id,
      reviewed_at = NOW(),
      rejection_reason = reason,
      updated_at = NOW()
  WHERE id = payment_uuid;

  -- Update order
  UPDATE orders
  SET status = 'cancelled',
      payment_status = 'rejected',
      cancelled_at = NOW(),
      admin_notes = reason,
      updated_at = NOW()
  WHERE id = payment_record.order_id;

  -- Release stock reservations
  UPDATE stock_reservations
  SET released = TRUE
  WHERE order_id = payment_record.order_id
    AND released = FALSE;

  result := jsonb_build_object(
    'success', true,
    'message', 'Payment rejected successfully',
    'order_id', payment_record.order_id
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users (admins)
GRANT EXECUTE ON FUNCTION approve_bank_transfer_payment(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_bank_transfer_payment(UUID, UUID, TEXT) TO authenticated;
