import { Star, Eye, TrendingUp, ShoppingCart } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { calculateTrendingRatio } from '../hooks/useProducts';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const trendingRatio = calculateTrendingRatio(product);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="card group overflow-hidden cursor-pointer animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-tertiary">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {trendingRatio > 50 && trendingRatio <= 100 && (
            <div className="px-3 py-1 rounded-full gradient-primary text-white text-xs font-bold flex items-center gap-1 animate-pulse-slow">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          )}
          {trendingRatio < 10 && trendingRatio > 0 && (
            <div className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
              Needs Promo
            </div>
          )}
          
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`btn-primary ${isAdding ? 'scale-90 opacity-75' : ''}`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            {isAdding ? 'Added!' : 'Quick Add'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-primary group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-cyan-500 group-hover:bg-clip-text transition-all line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 bg-tertiary px-2 py-1 rounded-lg flex-shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-primary">{product.rating}</span>
          </div>
        </div>

        <p className="text-sm text-secondary line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>
          <div className="flex items-center gap-3 text-xs text-tertiary">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {product.views}
            </div>
            {product.purchases_last_hour > 0 && (
              <div className="flex items-center gap-1 text-green-500 font-semibold">
                <TrendingUp className="w-3 h-3" />
                {product.purchases_last_hour} sold/hr
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
