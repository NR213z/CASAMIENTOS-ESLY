-- Add stock management columns to products table
ALTER TABLE products
  ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN reserved_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN low_stock_threshold INTEGER DEFAULT 5;

-- Create index for available stock calculation
CREATE INDEX idx_products_available_stock ON products((stock_quantity - reserved_quantity));

-- Update existing products to have stock
UPDATE products SET stock_quantity = 100 WHERE stock_quantity = 0;
