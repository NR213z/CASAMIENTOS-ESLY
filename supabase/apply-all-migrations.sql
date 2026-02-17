-- Create cart_sessions table for guest checkout
CREATE TABLE cart_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cart_sessions_session_id ON cart_sessions(session_id);
CREATE INDEX idx_cart_sessions_expires_at ON cart_sessions(expires_at);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_session_id UUID REFERENCES cart_sessions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_snapshot DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_session_id, product_id)
);

CREATE INDEX idx_cart_items_session ON cart_items(cart_session_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- Enable RLS
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_sessions
CREATE POLICY "Anyone can create cart sessions"
  ON cart_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read cart sessions"
  ON cart_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update their cart sessions"
  ON cart_sessions FOR UPDATE
  USING (expires_at > NOW());

-- RLS Policies for cart_items
CREATE POLICY "Anyone can manage their cart items"
  ON cart_items FOR ALL
  USING (true);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cart_sessions_updated_at
  BEFORE UPDATE ON cart_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================
-- MIGRATION 002: CREATE ORDER TABLES
-- =========================================


-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,

  -- Customer info (guest checkout)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Order details
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN (
      'pending_payment',
      'payment_processing',
      'payment_review',
      'payment_confirmed',
      'preparing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    )),

  -- Payment info
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mercadopago', 'bank_transfer')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'approved', 'rejected', 'refunded')),

  -- Additional notes
  customer_notes TEXT,
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Create order_items table (snapshot of products at purchase time)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Snapshot data
  product_name TEXT NOT NULL,
  product_description TEXT,
  product_category TEXT,
  product_image_url TEXT,

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  -- Payment details
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mercadopago', 'bank_transfer')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'ARS',

  -- Payment status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'refunded')),

  -- Mercado Pago specific
  mp_payment_id TEXT UNIQUE,
  mp_preference_id TEXT,
  mp_status TEXT,
  mp_status_detail TEXT,

  -- Bank transfer specific
  bank_reference_number TEXT,
  bank_receipt_url TEXT,
  bank_account_last_digits TEXT,

  -- Admin review (for bank transfers)
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Webhook/notification tracking
  webhook_received_at TIMESTAMPTZ,
  notification_sent_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_mp_payment_id ON payments(mp_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Create stock_reservations table
CREATE TABLE stock_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  released BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_reservations_product ON stock_reservations(product_id);
CREATE INDEX idx_stock_reservations_order ON stock_reservations(order_id);
CREATE INDEX idx_stock_reservations_expires ON stock_reservations(expires_at);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policies for order_items
CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- RLS Policies for payments
CREATE POLICY "Anyone can create payments"
  ON payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read payments"
  ON payments FOR SELECT
  USING (true);

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policies for stock_reservations
CREATE POLICY "Public can create reservations"
  ON stock_reservations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read reservations"
  ON stock_reservations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update reservations"
  ON stock_reservations FOR UPDATE
  USING (true);

-- Trigger to auto-update updated_at for orders and payments
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================
-- MIGRATION 003: ADD STOCK TO PRODUCTS
-- =========================================


-- Add stock management columns to products table
ALTER TABLE products
  ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN reserved_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN low_stock_threshold INTEGER DEFAULT 5;

-- Create index for available stock calculation
CREATE INDEX idx_products_available_stock ON products((stock_quantity - reserved_quantity));

-- Update existing products to have stock
UPDATE products SET stock_quantity = 100 WHERE stock_quantity = 0;


-- =========================================
-- MIGRATION 004: CREATE TRIGGERS
-- =========================================


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


-- =========================================
-- MIGRATION 005: CREATE RPC FUNCTIONS
-- =========================================


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
