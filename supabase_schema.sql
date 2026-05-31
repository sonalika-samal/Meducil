-- Meducil Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id VARCHAR(100) UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(20) NOT NULL,
  symptoms TEXT NOT NULL,
  duration INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, successful, failed
  consultation_status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled
  meeting_link VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(100) DEFAULT 'Admin',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS (Row Level Security) Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public inserts to bookings (for patients booking)
CREATE POLICY "Allow public insert on bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow public read of published blog posts
CREATE POLICY "Allow public read of published blogs" ON blog_posts
  FOR SELECT USING (published = true);

-- Note: Admin access requires authenticated user policies which are not included here for simplicity.
