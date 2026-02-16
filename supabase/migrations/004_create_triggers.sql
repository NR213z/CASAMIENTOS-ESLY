-- Sequence for order numbers
CREATE SEQUENCE order_number_seq START 1;

-- Trigger: Auto-generate Order Number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' ||
                      TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                      LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Trigger: Update Product Reserved Quantity
CREATE OR REPLACE FUNCTION update_product_reserved_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products
    SET reserved_quantity = reserved_quantity + NEW.quantity
    WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.released = TRUE AND OLD.released = FALSE) THEN
    UPDATE products
    SET reserved_quantity = GREATEST(0, reserved_quantity - COALESCE(OLD.quantity, NEW.quantity))
    WHERE id = COALESCE(OLD.product_id, NEW.product_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manage_stock_reservation
  AFTER INSERT OR DELETE OR UPDATE ON stock_reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_product_reserved_quantity();

-- Trigger: Deduct Stock on Payment Confirmation
CREATE OR REPLACE FUNCTION deduct_stock_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Deduct actual stock and release reservation
    UPDATE products p
    SET stock_quantity = stock_quantity - oi.quantity,
        reserved_quantity = GREATEST(0, reserved_quantity - oi.quantity)
    FROM order_items oi
    WHERE oi.order_id = NEW.order_id
      AND oi.product_id = p.id;

    -- Mark reservations as released
    UPDATE stock_reservations
    SET released = TRUE
    WHERE order_id = NEW.order_id AND released = FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deduct_stock_trigger
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION deduct_stock_on_payment();

-- Function: Cleanup Expired Reservations (to be called periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS void AS $$
BEGIN
  -- Mark expired reservations as released
  UPDATE stock_reservations
  SET released = TRUE
  WHERE expires_at < NOW()
    AND released = FALSE;

  -- Cancel orders with expired reservations and no payment
  UPDATE orders o
  SET status = 'cancelled',
      cancelled_at = NOW()
  FROM stock_reservations sr
  WHERE o.id = sr.order_id
    AND sr.released = TRUE
    AND o.payment_status = 'pending'
    AND o.status = 'pending_payment'
    AND o.created_at < (NOW() - INTERVAL '20 minutes');
END;
$$ LANGUAGE plpgsql;
