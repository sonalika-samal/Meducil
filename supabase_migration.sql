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
