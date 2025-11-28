import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Avoid throwing at module import time so frontend code can import types
// even when env vars aren't provided (e.g. local dev without Supabase).
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  rating: number;
  views: number;
  purchases_last_hour: number;
  trending_score: number;
  created_at: string;
  updated_at: string;
}

export interface UserBehavior {
  id: string;
  user_id: string;
  product_id: string;
  action_type: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  product_id: string;
  confidence_score: number;
  reason: string;
  created_at: string;
}

export interface LiveActivity {
  id: string;
  product_id: string;
  activity_type: string;
  message: string;
  created_at: string;
}
