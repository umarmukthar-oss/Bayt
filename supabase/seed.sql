-- Bayt Shawarma's Seed Data
-- Run this after schema.sql in Supabase SQL Editor

-- Insert default flavors
INSERT INTO public.flavors (name, description, price_single, price_double, in_stock, image_url) VALUES
  ('Normal', 'Classic chicken shawarma with fresh vegetables and tahini sauce', 70, 130, 20, '/images/normal.jpg'),
  ('Tandoori', 'Tandoori spiced chicken with mint chutney and onions', 70, 130, 20, '/images/tandoori.jpg'),
  ('Schezwan', 'Fiery schezwan sauce with crispy chicken and vegetables', 70, 130, 20, '/images/schezwan.jpg'),
  ('Cheese', 'Loaded with melted cheese and creamy garlic sauce', 90, 170, 15, '/images/cheese.jpg'),
  ('Peri Peri', 'Portuguese style peri peri chicken with spicy mayo', 80, 150, 15, '/images/peri-peri.jpg'),
  ('Mexican', 'Mexican spiced chicken with salsa and jalapeños', 85, 160, 15, '/images/mexican.jpg')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price_single = EXCLUDED.price_single,
  price_double = EXCLUDED.price_double;

-- Insert default offers
INSERT INTO public.offers (title, description, type, bundle_qty, bundle_price, active) VALUES
  ('Buy 2, Save ₹10!', 'Get any 2 shawarmas and save ₹10-20 instantly', 'bundle', 2, NULL, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.offers (title, description, type, value, min_order_amount, active) VALUES
  ('10% Off on ₹300+', 'Get 10% off on orders above ₹300', 'percentage', 10, 300, true)
ON CONFLICT DO NOTHING;
