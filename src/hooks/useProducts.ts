import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Product } from '../lib/supabase';
import { getProductImage } from '../utils/productImages';

// Calculate trending ratio: purchases_last_hour / views (as percentage 0-100)
// If no views, return 0. Higher ratio = more trending.
export function calculateTrendingRatio(product: Product): number {
  if (product.views === 0) return 0;
  return (product.purchases_last_hour / product.views) * 100;
}

// This hook provides a product list that is seeded from Supabase when
// available, and updated in real-time via WebSocket `product_update` events.
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let socket: any;
    let mounted = true;

    const init = async () => {
      // Try to fetch from Supabase if available
      try {
        // `supabase` may be null if env not configured; import guarded in lib
        // We dynamically import to avoid bundling errors in environments without VITE vars
        const lib = await import('../lib/supabase');
        if (lib.supabase && lib.supabase.from) {
          const { data } = await lib.supabase.from('products').select('*').order('trending_score', { ascending: false }).limit(100);
          if (mounted && data) setProducts(data as Product[]);
        }
      } catch (e) {
        // ignore — supabase not configured or query failed
      } finally {
        if (mounted) setLoading(false);
      }

      // Connect to WebSocket for live product updates
      try {
        socket = io('http://localhost:3001');

        // Buffer incoming product updates to avoid overwhelming React with
        // very high-frequency updates (which can cause the UI to become
        // unresponsive or blank). We'll collect updates into a small queue
        // and flush them at a steady interval.
        const updateQueue: any[] = [];
        const flushIntervalMs = 1000; // flush once per second to reduce re-renders
        const maxPerFlush = 50; // apply at most 50 updates per flush

        const flush = () => {
          if (updateQueue.length === 0) return;
          // Batch apply up to `maxPerFlush` updates to avoid huge single updates
          const batch: any[] = [];
          for (let i = 0; i < maxPerFlush && updateQueue.length > 0; i++) {
            batch.push(updateQueue.shift());
          }

          // Batch apply updates
          setProducts(prev => {
            const copy = [...prev];

            for (const payload of batch) {
              try {
                const productName = payload.name || payload.product_name || 'Unknown';
                const category = payload.category || '';
                const incoming: Product = {
                  id: payload.id || `${Date.now()}-${Math.random()}`,
                  category_id: payload.category_id || '',
                  name: productName,
                  slug: payload.slug || '',
                  description: payload.description || '',
                  price: Number(payload.price) || 0,
                  image_url: payload.image_url && payload.image_url !== '/placeholder.png' 
                    ? payload.image_url 
                    : getProductImage(productName, category),
                  stock: Number(payload.stock) || 0,
                  rating: Number(payload.rating) || 0,
                  views: Number(payload.views) || 0,
                  purchases_last_hour: Number(payload.purchases_last_hour) || 0,
                  trending_score: Number(payload.trending_score) || 0,
                  created_at: payload.created_at || new Date().toISOString(),
                  updated_at: payload.created_at || new Date().toISOString()
                } as Product;
                const idx = copy.findIndex(p => p.id === incoming.id);
                if (idx >= 0) {
                  copy[idx] = { ...copy[idx], ...incoming };
                } else {
                  copy.unshift(incoming);
                  if (copy.length > 200) copy.pop();
                }
              } catch (e) {
                // ignore malformed payloads
              }
            }

            return copy;
          });
        };

        const timer = setInterval(flush, flushIntervalMs);

        socket.on('product_update', (payload: any) => {
          try {
            updateQueue.push(payload);
            // keep queue size bounded
            if (updateQueue.length > 1000) updateQueue.splice(0, updateQueue.length - 1000);
          } catch (e) {
            // ignore
          }
        });

        // ensure interval is cleared on cleanup
        (socket as any).__flushTimer = timer;

      } catch (err) {
        // Socket connection failed — ignore so main UI still works
        console.warn('WebSocket connection failed for products:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      try {
        if (socket) {
          const t = (socket as any).__flushTimer;
          if (t) clearInterval(t);
          socket.disconnect();
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const lib = await import('../lib/supabase');
      if (lib.supabase && lib.supabase.from) {
        const { data } = await lib.supabase.from('products').select('*').order('trending_score', { ascending: false }).limit(100);
        if (data) setProducts(data as Product[]);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, refetch } as const;
}

export function useTrendingProducts(limit = 6) {
  const { products, loading } = useProducts();
  // Products with conversion ratio > 50% and <= 100% are considered trending
  const trending = products
    .filter(p => {
      const r = calculateTrendingRatio(p);
      return r > 50 && r <= 100;
    })
    .sort((a, b) => calculateTrendingRatio(b) - calculateTrendingRatio(a))
    .slice(0, limit);
  return { products: trending, loading } as const;
}
