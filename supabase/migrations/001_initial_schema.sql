-- Kriya E-commerce SaaS Database Schema
-- Multi-tenant architecture with Row Level Security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE store_theme AS ENUM ('neon', 'soft', 'brutal');
CREATE TYPE store_plan AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE sync_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- ============================================
-- STORES TABLE
-- ============================================

CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Owner (Supabase Auth user)
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Store identity
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  custom_domain VARCHAR(255) UNIQUE,
  tagline TEXT,
  logo_url TEXT,
  
  -- Theme & appearance
  theme store_theme DEFAULT 'neon',
  
  -- Currency
  currency VARCHAR(3) DEFAULT 'USD',
  currency_symbol VARCHAR(5) DEFAULT '$',
  
  -- Marketing
  announcement TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  tiktok_url TEXT,
  
  -- Google Sheets integration
  google_sheet_id VARCHAR(255),
  google_sheet_last_sync TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  plan store_plan DEFAULT 'free',
  
  -- Additional settings (JSON)
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Indexes
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$')
);

CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_custom_domain ON stores(custom_domain) WHERE custom_domain IS NOT NULL;
CREATE INDEX idx_stores_active ON stores(is_active) WHERE is_active = true;

-- ============================================
-- CATEGORIES TABLE
-- ============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(store_id, slug)
);

CREATE INDEX idx_categories_store ON categories(store_id);
CREATE INDEX idx_categories_slug ON categories(store_id, slug);

-- ============================================
-- PRODUCTS TABLE
-- ============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  external_id VARCHAR(255), -- ID from Google Sheets
  
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  
  images TEXT[] DEFAULT '{}',
  
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER,
  
  variants JSONB,
  metadata JSONB,
  
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  UNIQUE(store_id, external_id),
  UNIQUE(store_id, slug)
);

CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(store_id, is_active) WHERE is_active = true;
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  order_number VARCHAR(50) NOT NULL,
  
  status order_status DEFAULT 'pending',
  
  -- Customer info
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  
  -- Addresses
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  
  -- Order items (snapshot of products at time of order)
  items JSONB NOT NULL,
  
  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  
  -- Payment
  payment_status payment_status DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  
  notes TEXT,
  metadata JSONB,
  
  UNIQUE(store_id, order_number)
);

CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(store_id, status);
CREATE INDEX idx_orders_customer ON orders(customer_email);
CREATE INDEX idx_orders_created ON orders(store_id, created_at DESC);

-- ============================================
-- SYNC LOGS TABLE
-- ============================================

CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  status sync_status DEFAULT 'pending',
  products_synced INTEGER DEFAULT 0,
  categories_synced INTEGER DEFAULT 0,
  error_message TEXT,
  duration_ms INTEGER
);

CREATE INDEX idx_sync_logs_store ON sync_logs(store_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Stores: Owner can do everything, public can read active stores
CREATE POLICY "Public can view active stores" ON stores
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage their stores" ON stores
  FOR ALL USING (auth.uid() = owner_id);

-- Categories: Public read, owner write
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM stores WHERE stores.id = categories.store_id AND stores.is_active = true)
  );

CREATE POLICY "Store owners can manage categories" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE stores.id = categories.store_id AND stores.owner_id = auth.uid())
  );

-- Products: Public read, owner write
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.is_active = true)
  );

CREATE POLICY "Store owners can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
  );

-- Orders: Only store owner can see
CREATE POLICY "Store owners can view orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
  );

CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.is_active = true)
  );

CREATE POLICY "Store owners can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
  );

-- Sync logs: Only store owner
CREATE POLICY "Store owners can view sync logs" ON sync_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM stores WHERE stores.id = sync_logs.store_id AND stores.owner_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number(store_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  prefix VARCHAR(3);
  seq INTEGER;
  order_num VARCHAR(50);
BEGIN
  -- Get store prefix from first 3 chars of store name
  SELECT UPPER(SUBSTRING(name, 1, 3)) INTO prefix FROM stores WHERE id = store_id;
  
  -- Count existing orders + 1
  SELECT COUNT(*) + 1 INTO seq FROM orders WHERE orders.store_id = generate_order_number.store_id;
  
  -- Format: KRI-20240115-0001
  order_num := prefix || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(seq::TEXT, 4, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Optional demo store)
-- ============================================

-- This will be inserted via the app when first user signs up with demo mode
