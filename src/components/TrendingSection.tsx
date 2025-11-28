import { TrendingUp, Flame } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useTrendingProducts } from '../hooks/useProducts';

export function TrendingSection() {
  const { products, loading } = useTrendingProducts(6);

  if (loading) {
    return (
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="aspect-square bg-tertiary rounded-xl mb-4" />
                <div className="h-6 bg-tertiary rounded mb-2" />
                <div className="h-4 bg-tertiary rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-orange-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-red-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center animate-float">
            <Flame className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary animate-slide-up">
            Trending Now
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto animate-fade-in">
            Hot products flying off the shelves. Updated in real-time based on
            user activity and purchases.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary border border-primary animate-pulse-slow">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              Live Data Stream Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
