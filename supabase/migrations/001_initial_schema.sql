-- BizVibe Initial Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES TABLE (must be created first for foreign keys)
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO categories (name, slug, icon, color, sort_order) VALUES
  ('Local Eats', 'local-eats', 'utensils', '#FF6B42', 1),
  ('Fashion', 'fashion', 'shirt', '#5C6CFF', 2),
  ('Home Services', 'home-services', 'home', '#10B981', 3),
  ('Health & Beauty', 'health-beauty', 'heart', '#EC4899', 4),
  ('Fitness', 'fitness', 'dumbbell', '#8B5CF6', 5),
  ('Tech & Gadgets', 'tech-gadgets', 'smartphone', '#3B82F6', 6),
  ('Arts & Crafts', 'arts-crafts', 'palette', '#F59E0B', 7),
  ('Eco-Friendly', 'eco-friendly', 'leaf', '#22C55E', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PROFILES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'consumer' CHECK (role IN ('consumer', 'business', 'admin')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- BUSINESSES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  category_id UUID REFERENCES categories(id),
  address JSONB NOT NULL DEFAULT '{}',
  phone TEXT,
  website TEXT,
  hours JSONB,
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_handle ON businesses(handle);

-- RLS Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses are viewable by everyone" ON businesses
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own business" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their business" ON businesses
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their business" ON businesses
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================
-- VIDEOS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  mux_asset_id TEXT,
  mux_playback_id TEXT,
  thumbnail_url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- seconds
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error', 'deleted')),
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  products UUID[], -- Array of product IDs tagged
  views_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_videos_business ON videos(business_id);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created ON videos(created_at DESC);

-- RLS Policies
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ready videos are viewable by everyone" ON videos
  FOR SELECT USING (status = 'ready');

CREATE POLICY "Business owners can view all their videos" ON videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = videos.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can insert videos" ON videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = videos.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update their videos" ON videos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = videos.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can delete their videos" ON videos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = videos.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  images TEXT[],
  category TEXT,
  variants JSONB DEFAULT '[]',
  inventory INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  fulfillment_type TEXT DEFAULT 'shipping' CHECK (fulfillment_type IN ('shipping', 'pickup', 'both')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_business ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Available products are viewable by everyone" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Business owners can view all their products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = products.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can manage their products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = products.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- ============================================================
-- SAVES TABLE (Wishlist)
-- ============================================================

CREATE TABLE IF NOT EXISTS saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saves_user ON saves(user_id);
CREATE INDEX IF NOT EXISTS idx_saves_video ON saves(video_id);

-- RLS Policies
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saves" ON saves
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create saves" ON saves
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves" ON saves
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- FOLLOWS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_follows_user ON follows(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_business ON follows(business_id);

-- RLS Policies
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can create follows" ON follows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own follows" ON follows
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- CONVERSATIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  user_unread_count INTEGER DEFAULT 0,
  business_unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business ON conversations(business_id);

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = conversations.business_id AND businesses.owner_id = auth.uid())
  );

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update conversations" ON conversations
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = conversations.business_id AND businesses.owner_id = auth.uid())
  );

-- ============================================================
-- MESSAGES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.user_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM businesses b WHERE b.id = c.business_id AND b.owner_id = auth.uid()))
    )
  );

CREATE POLICY "Participants can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.user_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM businesses b WHERE b.id = c.business_id AND b.owner_id = auth.uid()))
    )
  );

-- ============================================================
-- ORDERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  business_id UUID REFERENCES businesses(id) NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  fulfillment_type TEXT NOT NULL,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_business ON orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = buyer_id OR 
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = orders.business_id AND businesses.owner_id = auth.uid())
  );

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Business owners can update order status" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = orders.business_id AND businesses.owner_id = auth.uid())
  );

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  variant JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- RLS Policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.buyer_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM businesses WHERE businesses.id = orders.business_id AND businesses.owner_id = auth.uid()))
    )
  );

CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.buyer_id = auth.uid()
    )
  );

-- ============================================================
-- REVIEWS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- DATABASE FUNCTIONS
-- ============================================================

-- Function to handle new user signup (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment video views
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos 
  SET views_count = views_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update business rating when review is added/updated
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses
  SET 
    rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE business_id = NEW.business_id),
    rating_count = (SELECT COUNT(*) FROM reviews WHERE business_id = NEW.business_id)
  WHERE id = NEW.business_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating business rating
DROP TRIGGER IF EXISTS trigger_update_rating ON reviews;
CREATE TRIGGER trigger_update_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_rating();

-- Function to update follower count
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE businesses SET follower_count = follower_count + 1 WHERE id = NEW.business_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE businesses SET follower_count = follower_count - 1 WHERE id = OLD.business_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating follower count
DROP TRIGGER IF EXISTS trigger_update_followers ON follows;
CREATE TRIGGER trigger_update_followers
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follower_count();

-- Function to update saves count
CREATE OR REPLACE FUNCTION update_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos SET saves_count = saves_count + 1 WHERE id = NEW.video_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos SET saves_count = saves_count - 1 WHERE id = OLD.video_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating saves count
DROP TRIGGER IF EXISTS trigger_update_saves ON saves;
CREATE TRIGGER trigger_update_saves
  AFTER INSERT OR DELETE ON saves
  FOR EACH ROW EXECUTE FUNCTION update_saves_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_businesses_updated_at ON businesses;
CREATE TRIGGER trigger_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_videos_updated_at ON videos;
CREATE TRIGGER trigger_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for conversations table (for last_message updates)
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- ============================================================
-- DONE!
-- ============================================================
-- Schema created successfully.
-- Now go to Authentication > Providers and enable Email provider.
