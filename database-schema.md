# Supabase Database Schema

Execute these SQL commands in your Supabase SQL Editor to create the database tables.

## Products Table

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

-- Create policy for authenticated insert (optional, for admin panel later)
CREATE POLICY "Authenticated users can insert products" 
ON products FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated update (optional, for admin panel later)
CREATE POLICY "Authenticated users can update products" 
ON products FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create policy for authenticated delete (optional, for admin panel later)
CREATE POLICY "Authenticated users can delete products" 
ON products FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_created_at_idx ON products(created_at DESC);
```

## Orders Table (Future Implementation)

```sql
-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

## Order Items Table (Future Implementation)

```sql
-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

## Sample Product Data

```sql
-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, in_stock) VALUES
('Decoración Premium', 'Decoración completa para eventos de hasta 100 personas. Incluye centros de mesa, arreglos florales y ambientación temática.', 150000, 'decoracion', '/product-decoration.jpg', true),
('Paquete de Iluminación', 'Sistema de iluminación profesional con luces LED RGB, spots y efectos especiales para crear el ambiente perfecto.', 85000, 'iluminacion', '/product-lighting.jpg', true),
('Mobiliario Lounge', 'Set de mobiliario lounge elegante: sofás, mesas ratona, puffs y sillones para zona de descanso VIP.', 120000, 'mobiliario', '/product-furniture.jpg', true),
('Candy Bar Personalizado', 'Mesa dulce totalmente personalizada con temática a elección, incluye postres, dulces y decoración.', 95000, 'catering', '/product-candybar.jpg', true),
('Photobooth Premium', 'Cabina de fotos con impresión instantánea, backdrop personalizado, props y album digital.', 75000, 'entretenimiento', '/product-photobooth.jpg', false),
('DJ + Sonido Profesional', 'DJ profesional con equipo de sonido completo, luces y playlist personalizada según tus preferencias.', 180000, 'entretenimiento', '/product-dj.jpg', true);
```

## Contacts Table

```sql
-- Contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (allows anyone to send a message)
CREATE POLICY "Public can insert contacts" 
ON contacts FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated read (admins only)
CREATE POLICY "Authenticated users can view contacts" 
ON contacts FOR SELECT 
USING (auth.role() = 'authenticated');
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL commands above
4. Execute each section in order
5. Verify the tables were created in the Table Editor
6. Update your .env file with your Supabase credentials
