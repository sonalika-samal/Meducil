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

-- Note: RLS policies do not need to be changed as they are already configured 
-- for SELECT, INSERT, UPDATE, and DELETE operations.
