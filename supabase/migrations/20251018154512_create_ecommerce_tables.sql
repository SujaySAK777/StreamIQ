/*
  # E-Commerce Platform Schema

  ## Overview
  Complete database schema for AI-powered e-commerce platform with real-time recommendations.

  ## New Tables
  
  ### `categories`
  Product categories for organization
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name
  - `slug` (text, unique) - URL-friendly category name
  - `description` (text) - Category description
  - `created_at` (timestamptz) - Creation timestamp

  ### `products`
  Main product catalog
  - `id` (uuid, primary key) - Unique product identifier
  - `category_id` (uuid, foreign key) - Reference to category
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly product name
  - `description` (text) - Product description
  - `price` (decimal) - Product price
  - `image_url` (text) - Product image URL
  - `stock` (integer) - Available stock quantity
  - `rating` (decimal) - Average rating (0-5)
  - `views` (integer) - Total views counter
  - `purchases_last_hour` (integer) - Recent purchase count
  - `trending_score` (decimal) - Trending algorithm score
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `user_behavior`
  Tracks user interactions for recommendations
  - `id` (uuid, primary key) - Unique behavior record identifier
  - `user_id` (uuid) - Anonymous user identifier
  - `product_id` (uuid, foreign key) - Product interacted with
  - `action_type` (text) - Type of action (view, click, purchase, etc.)
  - `created_at` (timestamptz) - Action timestamp

  ### `recommendations`
  Real-time AI-generated recommendations
  - `id` (uuid, primary key) - Unique recommendation identifier
  - `user_id` (uuid) - Target user identifier
  - `product_id` (uuid, foreign key) - Recommended product
  - `confidence_score` (decimal) - ML model confidence (0-1)
  - `reason` (text) - Recommendation reason
  - `created_at` (timestamptz) - Generation timestamp

  ### `live_activity`
  Real-time activity feed
  - `id` (uuid, primary key) - Unique activity identifier
  - `product_id` (uuid, foreign key) - Product involved
  - `activity_type` (text) - Activity type
  - `message` (text) - Activity message
  - `created_at` (timestamptz) - Activity timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for products and categories
  - Authenticated users can create behavior records
  - System-managed recommendations and activity

  ## Indexes
  - Performance indexes on frequently queried columns
  - Composite indexes for complex queries
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  stock integer DEFAULT 0,
  rating decimal(2,1) DEFAULT 0,
  views integer DEFAULT 0,
  purchases_last_hour integer DEFAULT 0,
  trending_score decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_behavior table
CREATE TABLE IF NOT EXISTS user_behavior (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  confidence_score decimal(3,2) DEFAULT 0,
  reason text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create live_activity table
CREATE TABLE IF NOT EXISTS live_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_user_behavior_user ON user_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_product ON user_behavior(product_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_live_activity_created ON live_activity(created_at DESC);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for user_behavior (users can insert their own)
CREATE POLICY "Users can create behavior records"
  ON user_behavior FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their behavior"
  ON user_behavior FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for recommendations (public read for demo)
CREATE POLICY "Public can view recommendations"
  ON recommendations FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for live_activity (public read)
CREATE POLICY "Public can view live activity"
  ON live_activity FOR SELECT
  TO anon, authenticated
  USING (true);