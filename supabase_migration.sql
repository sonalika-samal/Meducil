-- =========================================================================
-- MEDUCIL DATABASE MIGRATION - ORDER TRACKING FIELDS
-- =========================================================================

-- 1. Ensure courier_name column exists in orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS courier_name VARCHAR(255);

-- 2. Ensure tracking_url column exists in orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_url TEXT;

-- 3. Ensure tracking_number column exists in orders table (just in case)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);

-- 4. Ensure categories column exists in medicines table as TEXT array
ALTER TABLE medicines 
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- 5. Ensure system column exists in medicines table
ALTER TABLE medicines 
ADD COLUMN IF NOT EXISTS system VARCHAR(50) DEFAULT 'Homeopathy';

-- 6. Migrate existing data from category column to categories array if empty
UPDATE medicines 
SET categories = ARRAY[category] 
WHERE categories = '{}' OR categories IS NULL;


-- Note: RLS policies do not need to be changed as they are already configured 
-- for SELECT, INSERT, UPDATE, and DELETE operations.


-- =========================================================================
-- 7. REVIEWS TABLE & POLICIES (Customer Reviews Feedback)
-- =========================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS policies for reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Allow public select on reviews'
  ) THEN
    CREATE POLICY "Allow public select on reviews" ON reviews FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Allow public insert on reviews'
  ) THEN
    CREATE POLICY "Allow public insert on reviews" ON reviews FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 8. Seed some initial reviews if reviews table is empty
INSERT INTO reviews (medicine_id, name, rating, comment, created_at)
SELECT 'cca-1', 'Amit Patel', 5, 'Excellent remedy for allergic runny nose. Showed results within a day! Highly recommend it.', NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE medicine_id = 'cca-1');

INSERT INTO reviews (medicine_id, name, rating, comment, created_at)
SELECT 'cca-1', 'Sarah Jones', 4, 'Very helpful for mild sneezing and dust allergies. Safe with no drowsiness.', NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE medicine_id = 'cca-1' AND name = 'Sarah Jones');

INSERT INTO reviews (medicine_id, name, rating, comment, created_at)
SELECT 'dig-1', 'Rajesh Sharma', 5, 'Highly effective for acidity and indigestion. A must-have in every home.', NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE medicine_id = 'dig-1');

