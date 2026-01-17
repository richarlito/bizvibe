-- BizVibe Sample Data Seed
-- Run this in Supabase SQL Editor AFTER creating a test user/profile
-- ============================================================

-- IMPORTANT: You need an existing user profile first
-- Replace 'YOUR_USER_ID' with an actual user ID from your profiles table
-- You can find this by running: SELECT id, email FROM profiles;

-- ============================================================
-- STEP 1: Create Sample Businesses
-- ============================================================

-- First, let's create sample businesses
-- Note: You'll need to replace 'YOUR_USER_ID' with a real profile ID

DO $$
DECLARE
  owner_uuid UUID;
  coffee_biz_id UUID;
  fitness_biz_id UUID;
  restaurant_biz_id UUID;
  tech_biz_id UUID;
  spa_biz_id UUID;
  local_eats_cat UUID;
  fitness_cat UUID;
BEGIN
  -- Get the first profile to use as owner (or use a specific one)
  SELECT id INTO owner_uuid FROM profiles LIMIT 1;
  
  -- If no profile exists, we can't continue
  IF owner_uuid IS NULL THEN
    RAISE NOTICE 'No profiles found. Please create a user first by signing up in the app.';
    RETURN;
  END IF;
  
  -- Get category IDs
  SELECT id INTO local_eats_cat FROM categories WHERE slug = 'local-eats';
  SELECT id INTO fitness_cat FROM categories WHERE slug = 'fitness';
  
  -- Insert Coffee Beans Cafe
  INSERT INTO businesses (owner_id, name, handle, description, category_id, address, is_verified)
  VALUES (
    owner_uuid,
    'Coffee Beans Cafe',
    'coffeebeans',
    'Artisan coffee roasters since 2018. Fresh roasted beans every morning!',
    local_eats_cat,
    '{"street": "123 Main St", "city": "San Francisco", "state": "CA", "zip": "94102"}'::jsonb,
    true
  )
  ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO coffee_biz_id;

  -- Insert Urban Fitness Studio
  INSERT INTO businesses (owner_id, name, handle, description, category_id, address, is_verified)
  VALUES (
    owner_uuid,
    'Urban Fitness Studio',
    'urbanfitness',
    'Transform your body and mind. HIIT, yoga, and strength training classes.',
    fitness_cat,
    '{"street": "456 Fitness Ave", "city": "San Francisco", "state": "CA", "zip": "94103"}'::jsonb,
    true
  )
  ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO fitness_biz_id;

  -- Insert Bella Italia Restaurant
  INSERT INTO businesses (owner_id, name, handle, description, category_id, address)
  VALUES (
    owner_uuid,
    'Bella Italia Restaurant',
    'bellaitalia',
    'Authentic Italian cuisine made with love. Family recipes since 1985.',
    local_eats_cat,
    '{"street": "789 Italian Way", "city": "San Francisco", "state": "CA", "zip": "94104"}'::jsonb
  )
  ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO restaurant_biz_id;

  -- Insert Tech Repair Pro
  INSERT INTO businesses (owner_id, name, handle, description, address)
  VALUES (
    owner_uuid,
    'Tech Repair Pro',
    'techrepairpro',
    'Same-day phone and laptop repairs. Screen, battery, and more!',
    '{"street": "321 Tech Blvd", "city": "San Francisco", "state": "CA", "zip": "94105"}'::jsonb
  )
  ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO tech_biz_id;

  -- Insert Zen Spa & Wellness
  INSERT INTO businesses (owner_id, name, handle, description, address, is_verified)
  VALUES (
    owner_uuid,
    'Zen Spa & Wellness',
    'zenspa',
    'Escape the stress of daily life. Massage, facials, and wellness treatments.',
    '{"street": "555 Relaxation Rd", "city": "San Francisco", "state": "CA", "zip": "94106"}'::jsonb,
    true
  )
  ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO spa_biz_id;

  -- ============================================================
  -- STEP 2: Create Sample Videos
  -- Using public sample video URLs (Google's sample videos)
  -- ============================================================

  -- Coffee Beans Cafe Video
  INSERT INTO videos (business_id, title, description, video_url, status, duration, views_count, category_id)
  VALUES (
    coffee_biz_id,
    'Fresh Morning Brew',
    'Fresh roasted beans every morning! ☕ Come try our new seasonal blend and get 20% off your first order.',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'ready',
    15,
    2400,
    local_eats_cat
  );

  -- Urban Fitness Studio Video
  INSERT INTO videos (business_id, title, description, video_url, status, duration, views_count, category_id)
  VALUES (
    fitness_biz_id,
    '30 Day Transformation',
    'Transform your body in 30 days! 💪 New member special: First month FREE with annual membership.',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'ready',
    15,
    5200,
    fitness_cat
  );

  -- Bella Italia Restaurant Video
  INSERT INTO videos (business_id, title, description, video_url, status, duration, views_count, category_id)
  VALUES (
    restaurant_biz_id,
    'Authentic Italian Cuisine',
    'Authentic Italian cuisine made with love 🍝 Reserve your table for our special tasting menu this weekend!',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'ready',
    15,
    3800,
    local_eats_cat
  );

  -- Tech Repair Pro Video
  INSERT INTO videos (business_id, title, description, video_url, status, duration, views_count)
  VALUES (
    tech_biz_id,
    'Fast Phone Repairs',
    'Screen cracked? We fix it in 30 minutes or less! 📱 Same-day repairs for all phone models.',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'ready',
    15,
    1800
  );

  -- Zen Spa & Wellness Video
  INSERT INTO videos (business_id, title, description, video_url, status, duration, views_count)
  VALUES (
    spa_biz_id,
    'Escape & Relax',
    'Escape the stress of daily life 🧘‍♀️ Book a 90-minute massage and get a free facial treatment.',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'ready',
    15,
    4100
  );

  RAISE NOTICE 'Sample data created successfully!';
  RAISE NOTICE 'Created 5 businesses and 5 videos.';
END $$;

-- ============================================================
-- Verify the data was inserted
-- ============================================================

-- Check businesses
SELECT id, name, handle, is_verified FROM businesses;

-- Check videos with business names
SELECT 
  v.id,
  v.title,
  b.name as business_name,
  v.status,
  v.views_count
FROM videos v
JOIN businesses b ON v.business_id = b.id
ORDER BY v.created_at DESC;
