-- Bayt Shawarma's Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flavors table
CREATE TABLE IF NOT EXISTS public.flavors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price_single INT NOT NULL DEFAULT 70,
  price_double INT NOT NULL DEFAULT 130,
  in_stock INT NOT NULL DEFAULT 20,
  image_url TEXT,
  halal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'flat', 'bundle')),
  value INT, -- For percentage or flat discount
  bundle_qty INT, -- For bundle offers
  bundle_price INT, -- For bundle offers
  min_order_amount INT, -- For percentage/flat (min cart value)
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  items JSONB NOT NULL, -- [{flavor_id, name, qty, unit_price}]
  subtotal INT NOT NULL,
  discount INT DEFAULT 0,
  total_amount INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'preparing', 'ready', 'delivered', 'cancelled')),
  offer_applied TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory log table
CREATE TABLE IF NOT EXISTS public.inventory_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flavor_id UUID REFERENCES public.flavors(id) ON DELETE CASCADE,
  change INT NOT NULL, -- Positive for restock, negative for orders
  reason TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Flavors policies (public read, admin write)
CREATE POLICY "Anyone can view flavors" ON public.flavors
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage flavors" ON public.flavors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Offers policies (public read active, admin all)
CREATE POLICY "Anyone can view active offers" ON public.offers
  FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "Admins can manage offers" ON public.offers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Inventory log policies (admin only)
CREATE POLICY "Admins can manage inventory log" ON public.inventory_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role bypass for API routes
CREATE POLICY "Service role full access users" ON public.users
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access flavors" ON public.flavors
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access offers" ON public.offers
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access orders" ON public.orders
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access inventory_log" ON public.inventory_log
  FOR ALL TO service_role USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_log_flavor_id ON public.inventory_log(flavor_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_flavors_updated_at BEFORE UPDATE ON public.flavors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for orders (admin dashboard updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
