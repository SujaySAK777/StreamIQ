import { useState } from 'react';
import { Filter } from 'lucide-react';
import { ProductCard } from './ProductCard';
import ErrorBoundary from './ErrorBoundary';
import { useProducts, calculateTrendingRatio } from '../hooks/useProducts';

export function AllProducts() {
  const { products, loading } = useProducts();
  const [filter, setFilter] = useState<'all' | 'trending' | 'needs-promotion'>('all');

  const filteredProducts = products.filter(product => {
    const ratio = calculateTrendingRatio(product);
    if (filter === 'trending') return ratio > 50 && ratio <= 100;
    if (filter === 'needs-promotion') return ratio < 10;
    return true;
  });

  if (loading) {
    return (
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-secondary rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
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
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              All Products
            </h2>
            <p className="text-lg text-secondary">
              Discover our complete collection of {products.length} premium
              items
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-tertiary" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === 'all'
                    ? 'gradient-primary text-white'
                    : 'bg-tertiary text-secondary hover:bg-secondary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('trending')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === 'trending'
                    ? 'gradient-primary text-white'
                    : 'bg-tertiary text-secondary hover:bg-secondary'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setFilter('needs-promotion')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === 'needs-promotion'
                    ? 'gradient-primary text-white'
                    : 'bg-tertiary text-secondary hover:bg-secondary'
                }`}
              >
                Needs Promotion
              </button>
            </div>
          </div>
        </div>

        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(index % 8) * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </ErrorBoundary>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-secondary">
              No products match your filter
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
