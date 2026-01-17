# BizVibe - Database Schema Design

## Overview

PostgreSQL database with PostGIS extension for location queries, hosted on Supabase with Row-Level Security (RLS) enabled.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐         ┌─────────────────┐        ┌─────────────┐        │
│  │   users     │         │   businesses    │        │   videos    │        │
│  ├─────────────┤         ├─────────────────┤        ├─────────────┤        │
│  │ id (PK)     │◀───────▶│ id (PK)         │───────▶│ id (PK)     │        │
│  │ email       │         │ owner_id (FK)   │        │ business_id │        │
│  │ role        │         │ name            │        │ mux_asset_id│        │
│  │ created_at  │         │ description     │        │ title       │        │
│  └─────────────┘         │ location (geo)  │        │ status      │        │
│         │                │ category_id     │        │ views_count │        │
│         │                └─────────────────┘        └─────────────┘        │
│         │                        │                         │               │
│         │                        │                         │               │
│         ▼                        ▼                         ▼               │
│  ┌─────────────┐         ┌─────────────────┐        ┌─────────────┐        │
│  │  profiles   │         │   products      │        │   saves     │        │
│  ├─────────────┤         ├─────────────────┤        ├─────────────┤        │
│  │ id (PK)     │         │ id (PK)         │        │ user_id     │        │
│  │ user_id(FK) │         │ business_id(FK) │        │ video_id    │        │
│  │ name        │         │ name            │        │ created_at  │        │
│  │ avatar_url  │         │ price           │        └─────────────┘        │
│  │ preferences │         │ inventory       │                               │
│  └─────────────┘         └─────────────────┘                               │
│                                  │                                         │
│                                  ▼                                         │
│                          ┌─────────────────┐                               │
│                          │    orders       │                               │
│                          ├─────────────────┤                               │
│                          │ id (PK)         │                               │
│                          │ buyer_id (FK)   │                               │
│                          │ business_id(FK) │                               │
│                          │ stripe_id       │                               │
│                          │ status          │                               │
│                          │ total           │                               │
│                          └─────────────────┘                               │
│                                                                             │
│  ┌─────────────┐         ┌─────────────────┐                               │
│  │conversations│         │   messages      │                               │
│  ├─────────────┤         ├─────────────────┤                               │
│  │ id (PK)     │◀───────▶│ id (PK)         │                               │
│  │ user_id     │         │ conversation_id │                               │
│  │ business_id │         │ sender_id       │                               │
│  │ last_message│         │ content         │                               │
│  └─────────────┘         │ read_at         │                               │
│                          └─────────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Tables

### users (Supabase Auth)
```sql
-- Managed by Supabase Auth
-- Extended via profiles table
```

### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'consumer' CHECK (role IN ('consumer', 'business', 'admin')),
  preferences JSONB DEFAULT '{}',
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_location ON profiles USING GIST(location);
```

### businesses
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  category_id UUID REFERENCES categories(id),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  address JSONB NOT NULL,
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
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_location ON businesses USING GIST(location);
CREATE INDEX idx_businesses_handle ON businesses(handle);
```

### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO categories (name, slug, icon) VALUES
  ('Local Eats', 'local-eats', '🍽️'),
  ('Fashion', 'fashion', '👗'),
  ('Home Services', 'home-services', '🏠'),
  ('Health & Beauty', 'health-beauty', '💆'),
  ('Fitness', 'fitness', '💪'),
  ('Tech & Gadgets', 'tech-gadgets', '📱'),
  ('Arts & Crafts', 'arts-crafts', '🎨'),
  ('Eco-Friendly', 'eco-friendly', '🌱');
```

### videos
```sql
CREATE TABLE videos (
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
CREATE INDEX idx_videos_business ON videos(business_id);
CREATE INDEX idx_videos_category ON videos(category_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created ON videos(created_at DESC);
```

### products
```sql
CREATE TABLE products (
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
CREATE INDEX idx_products_business ON products(business_id);
CREATE INDEX idx_products_available ON products(is_available);
```

### saves (Wishlist)
```sql
CREATE TABLE saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Indexes
CREATE INDEX idx_saves_user ON saves(user_id);
CREATE INDEX idx_saves_video ON saves(video_id);
```

### follows
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Indexes
CREATE INDEX idx_follows_user ON follows(user_id);
CREATE INDEX idx_follows_business ON follows(business_id);
```

### conversations
```sql
CREATE TABLE conversations (
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
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_business ON conversations(business_id);
```

### messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

### orders
```sql
CREATE TABLE orders (
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
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_business ON orders(business_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### order_items
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  variant JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### reviews
```sql
CREATE TABLE reviews (
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
CREATE INDEX idx_reviews_business ON reviews(business_id);
```

---

## Row-Level Security Policies

### profiles
```sql
-- Users can read any profile
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### businesses
```sql
-- Anyone can view businesses
CREATE POLICY "Businesses are viewable by everyone" ON businesses
  FOR SELECT USING (true);

-- Only owner can update
CREATE POLICY "Owners can update their business" ON businesses
  FOR UPDATE USING (auth.uid() = owner_id);
```

### videos
```sql
-- Anyone can view ready videos
CREATE POLICY "Ready videos are viewable" ON videos
  FOR SELECT USING (status = 'ready');

-- Business owners can manage their videos
CREATE POLICY "Owners can manage videos" ON videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = videos.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );
```

### messages
```sql
-- Participants can view messages
CREATE POLICY "Participants can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.user_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM businesses b WHERE b.id = c.business_id AND b.owner_id = auth.uid()))
    )
  );
```

---

## Database Functions

### Update video view count
```sql
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos 
  SET views_count = views_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Get nearby businesses
```sql
CREATE OR REPLACE FUNCTION get_nearby_businesses(
  user_location GEOGRAPHY,
  radius_meters INTEGER DEFAULT 10000,
  category_filter UUID DEFAULT NULL
)
RETURNS SETOF businesses AS $$
BEGIN
  RETURN QUERY
  SELECT b.*
  FROM businesses b
  WHERE ST_DWithin(b.location, user_location, radius_meters)
  AND (category_filter IS NULL OR b.category_id = category_filter)
  ORDER BY b.location <-> user_location;
END;
$$ LANGUAGE plpgsql;
```

### Update business rating
```sql
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses
  SET 
    rating_avg = (SELECT AVG(rating) FROM reviews WHERE business_id = NEW.business_id),
    rating_count = (SELECT COUNT(*) FROM reviews WHERE business_id = NEW.business_id)
  WHERE id = NEW.business_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_business_rating();
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
