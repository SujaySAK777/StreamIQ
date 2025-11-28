import { useEffect, useState } from 'react';
import { Users, ShoppingBag, Eye } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import io from 'socket.io-client';
import { getProductImage } from '../utils/productImages';

interface Activity {
  id: string;
  icon: 'view' | 'purchase' | 'users';
  message: string;
  timestamp: Date;
  productName?: string;
  amount?: number;
  category?: string;
  imageUrl?: string;
}

interface TransactionEvent {
  product_name: string;
  amount: number;
  category?: string;
  timestamp: string;
}

export function LiveActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
    
    const WS_URL = (import.meta as any).env?.VITE_WS_URL || 'http://localhost:3001';
    const socket = io(WS_URL as string);

    // Buffer activities so frequent transaction events don't cause
    // excessive renders or empty/blank UI.
    const queue: Activity[] = [];
    const flushIntervalMs = 500;
    const maxPerFlush = 5;

    const flush = () => {
      if (queue.length === 0) return;
      const batch: Activity[] = [];
      for (let i = 0; i < maxPerFlush && queue.length > 0; i++) {
        batch.push(queue.shift()!);
      }

      setActivities(prev => {
        const merged = [...batch, ...prev].slice(0, 10);
        return merged;
      });
    };

    const timer = setInterval(flush, flushIntervalMs);

    socket.on('transaction', (transaction: any) => {
      try {
        // Read amount from several possible fields and coerce to number
        const amt = Number(transaction.amount ?? transaction.retail_price ?? transaction.price ?? transaction.retailPrice ?? 0) || 0;
        const productName = transaction.product_name || transaction.productName || 'Unknown Product';
        const category = transaction.category || 'General';
        const imageUrl = getProductImage(productName, category);

        const newActivity: Activity = {
          id: Math.random().toString(36).substring(7),
          icon: 'purchase',
          message: `New purchase: ${productName} for $${amt.toFixed(2)}`,
          timestamp: new Date(transaction.timestamp || new Date().toISOString()),
          productName,
          amount: amt,
          category,
          imageUrl
        };

        queue.push(newActivity);
        if (queue.length > 200) queue.splice(0, queue.length - 200);
      } catch (e) {
        // ignore malformed payloads
      }
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      clearInterval(timer);
      try { socket.disconnect(); } catch (e) { /* ignore */ }
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const lib = await import('../lib/supabase');
      if (lib.supabase && lib.supabase.from) {
        const { data } = await lib.supabase.from('products').select('*').limit(20);
        if (data) setProducts(data);
      }
    } catch (e) {
      // ignore — supabase may not be configured in this environment
    }
  };

  const generateActivity = () => {
    if (products.length === 0) return;

    const types: Activity['icon'][] = ['view', 'purchase', 'users'];
    const type = types[Math.floor(Math.random() * types.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const count = Math.floor(Math.random() * 50) + 1;

    const messages = {
      view: `${count} people viewing "${product.name}"`,
      purchase: `Someone just purchased "${product.name}"`,
      users: `${count} users viewing this category now`,
    };

    const newActivity: Activity = {
      id: Date.now().toString(),
      icon: type,
      message: messages[type],
      timestamp: new Date(),
    };

    setActivities(prev => [newActivity, ...prev].slice(0, 5));
  };

  const getIcon = (type: Activity['icon']) => {
    switch (type) {
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'purchase':
        return <ShoppingBag className="w-4 h-4" />;
      case 'users':
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-12 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-6 glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Activity
            </h3>
            <span className="text-sm text-tertiary">Real-time updates</span>
          </div>

          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                Watching for activity...
              </div>
            ) : (
              activities.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-tertiary rounded-xl animate-slide-up hover:bg-secondary transition-colors"
                >
                  {activity.imageUrl ? (
                    <img
                      src={activity.imageUrl}
                      alt={activity.productName || 'Product'}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        const iconDiv = e.currentTarget.nextElementSibling as HTMLElement;
                        if (iconDiv) iconDiv.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center text-white flex-shrink-0"
                    style={{ display: activity.imageUrl ? 'none' : 'flex' }}
                  >
                    {getIcon(activity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">
                      New purchase: {activity.productName || 'Unknown Product'}
                    </p>
                    {activity.amount !== undefined && (
                      <p className="text-sm font-semibold text-green-500">
                        ${activity.amount.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-tertiary">
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
