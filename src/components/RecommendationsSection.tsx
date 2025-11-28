import { useEffect, useState } from 'react';
import { Sparkles, Brain, RefreshCw } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product, supabase } from '../lib/supabase';

export function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(simulateRecommendationUpdate, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);

      setRecommendations(data || []);
    } finally {
      setLoading(false);
    }
  };

  const simulateRecommendationUpdate = async () => {
    setIsRefreshing(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .limit(100);

    if (data && data.length > 6) {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setRecommendations(shuffled.slice(0, 6));
    }

    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-tertiary rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="aspect-square bg-tertiary rounded-xl mb-4" />
                  <div className="h-6 bg-tertiary rounded mb-2" />
                  <div className="h-4 bg-tertiary rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center animate-float">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-4xl md:text-5xl font-bold text-primary animate-slide-up">
              Recommended for You
            </h2>
            {isRefreshing && (
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            )}
          </div>

          <p className="text-lg text-secondary max-w-2xl mx-auto animate-fade-in">
            Personalized picks powered by AI. Watch as recommendations evolve
            based on real-time behavior analysis.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary border border-primary">
              <Sparkles className="w-4 h-4 text-primary animate-pulse-slow" />
              <span className="text-sm font-semibold text-primary">
                AI-Powered Curation
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary border border-primary">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-primary">
                Updates Every 8s
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className={isRefreshing ? 'animate-scale-in' : ''}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={simulateRecommendationUpdate}
            disabled={isRefreshing}
            className="btn-secondary"
          >
            <RefreshCw className={`w-4 h-4 inline mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Recommendations
          </button>
        </div>
      </div>
    </section>
  );
}
