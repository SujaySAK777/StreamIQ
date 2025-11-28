import { useEffect, useState } from 'react';
import { Sparkles, TrendingDown, Zap, Gift, Percent, ShoppingBag } from 'lucide-react';
import io from 'socket.io-client';
import { useProducts, calculateTrendingRatio } from '../hooks/useProducts';

interface PromotionDecision {
  id: string;
  product_id: string;
  product_name?: string;
  candidate: {
    type: string;
    discountPct?: number;
    bundlePrice?: number;
    objective?: number;
    estimated_inc_revenue?: number;
  };
  ui: {
    headline: string;
    subtext: string;
    rationale: string;
    cta: string;
    promotion_label: string;
  };
  uplift_score: number;
  top_drivers: Array<{ driver: string; score: number }>;
  created_at: string;
}

export function AgenticPromotions() {
  const { products } = useProducts();
  const [promotions, setPromotions] = useState<PromotionDecision[]>([]);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'analyzing' | 'deciding'>('idle');
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '10' | '15' | '20' | 'bogo'>('all');

  // Filter products that need promotion
  const needsPromoProducts = products.filter(p => {
    const ratio = calculateTrendingRatio(p);
    return ratio > 0 && ratio < 10 && p.views > 10;
  });

  useEffect(() => {
    const socket = io('http://localhost:3001');

    // Listen for promotion decisions from the agent
    socket.on('promotion_exposure', (data: PromotionDecision) => {
      console.log('📦 Received promotion:', {
        product: data.product_name,
        type: data.candidate.type,
        discount: data.candidate.discountPct,
        uplift: data.uplift_score,
        FULL_CANDIDATE: data.candidate  // LOG ENTIRE CANDIDATE OBJECT
      });
      
      setPromotions(prev => {
        const newPromotions = [data, ...prev];
        
        // LOG FILTER COUNTS after adding new promotion
        console.log('📊 FILTER COUNTS:', {
          total: newPromotions.length,
          bogo: newPromotions.filter(p => p.candidate.type === 'bogo').length,
          discount_5: newPromotions.filter(p => p.candidate.discountPct === 5).length,
          discount_10: newPromotions.filter(p => p.candidate.discountPct === 10).length,
          discount_15: newPromotions.filter(p => p.candidate.discountPct === 15).length,
          discount_20: newPromotions.filter(p => p.candidate.discountPct === 20).length,
        });
        
        return newPromotions;
      });
      
      setAgentStatus('idle');
    });

    socket.on('promotion_analyzing', () => {
      setAgentStatus('analyzing');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Percent className="w-5 h-5" />;
      case 'bogo': return <Gift className="w-5 h-5" />;
      case 'bundle_mirror':
      case 'bundle_combine': return <ShoppingBag className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Agent: Agentic Promotions
            </span>
            <div className={`w-3 h-3 rounded-full ${
              agentStatus === 'analyzing' ? 'bg-yellow-400 animate-pulse' :
              agentStatus === 'deciding' ? 'bg-blue-400 animate-pulse' :
              'bg-green-400'
            }`} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Smart Promotion Engine
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            AI agent automatically analyzes products, computes uplift scores, generates promotion candidates, 
            and decides optimal actions in real-time.
          </p>
        </div>

        {/* Products Needing Promotion */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-6 h-6 text-orange-400" />
            <h3 className="text-2xl font-bold text-primary">
              Products Under Analysis ({needsPromoProducts.length})
            </h3>
          </div>
          
          {needsPromoProducts.length === 0 ? (
            <div className="card text-center py-12">
              <Zap className="w-12 h-12 text-tertiary mx-auto mb-4" />
              <p className="text-secondary">No products currently need promotion</p>
              <p className="text-sm text-tertiary mt-2">Agent monitors products with {'<'}10% conversion ratio</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {needsPromoProducts.slice(0, 6).map(product => {
                const ratio = calculateTrendingRatio(product);
                return (
                  <div key={product.id} className="card p-4 border-l-4 border-orange-500">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-primary line-clamp-2 flex-1">{product.name}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400 font-bold whitespace-nowrap ml-2">
                        {ratio.toFixed(1)}% conv
                      </span>
                    </div>
                    <div className="text-sm text-secondary space-y-1">
                      <div className="flex justify-between">
                        <span>Views:</span>
                        <span className="font-bold">{product.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Purchases:</span>
                        <span className="font-bold">{product.purchases_last_hour}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-bold text-primary">${product.price}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-tertiary">
                      <div className="flex items-center gap-2 text-xs text-tertiary">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        <span>Agent monitoring...</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI-Generated Promotion Decisions */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-primary">
                ✅ Approved Promotions
              </h3>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-tertiary text-secondary hover:bg-secondary/20'
                }`}
              >
                All ({promotions.length})
              </button>
              <button
                onClick={() => setSelectedFilter('5')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === '5'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-tertiary text-secondary hover:bg-secondary/20'
                }`}
              >
                5% ({promotions.filter(p => p.candidate.discountPct === 5).length})
              </button>
              <button
                onClick={() => setSelectedFilter('10')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === '10'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-tertiary text-secondary hover:bg-secondary/20'
                }`}
              >
                10% ({promotions.filter(p => p.candidate.discountPct === 10).length})
              </button>
              <button
                onClick={() => setSelectedFilter('15')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === '15'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-tertiary text-secondary hover:bg-secondary/20'
                }`}
              >
                15% ({promotions.filter(p => p.candidate.discountPct === 15).length})
              </button>
              <button
                onClick={() => setSelectedFilter('20')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === '20'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-tertiary text-secondary hover:bg-secondary/20'
                }`}
              >
                20% ({promotions.filter(p => p.candidate.discountPct === 20).length})
              </button>
              <button
                onClick={() => setSelectedFilter('bogo')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === 'bogo'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-tertiary text-secondary hover:bg-secondary/20'
                }`}
              >
                BOGO ({promotions.filter(p => p.candidate.type === 'bogo').length})
              </button>
            </div>
          </div>

          {promotions.length === 0 ? (
            <div className="card text-center py-12">
              <Sparkles className="w-12 h-12 text-tertiary mx-auto mb-4 animate-pulse" />
              <p className="text-secondary">No approved promotions yet</p>
              <p className="text-sm text-tertiary mt-2">
                Waiting for products that pass agent thresholds...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {promotions
                .filter(promo => {
                  if (selectedFilter === 'all') return true;
                  if (selectedFilter === 'bogo') return promo.candidate.type === 'bogo';
                  return promo.candidate.discountPct === parseInt(selectedFilter);
                })
                .map(promo => (
                <div key={promo.id} className="card p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      {getPromoIcon(promo.candidate.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-primary mb-1">{promo.ui.headline}</h4>
                          <p className="text-sm text-tertiary mb-1">
                            Product: <span className="font-semibold text-secondary">{promo.product_name}</span>
                          </p>
                          <p className="text-sm text-tertiary">ID: {promo.product_id}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full gradient-primary text-white text-sm font-bold whitespace-nowrap">
                          {promo.ui.promotion_label}
                        </span>
                      </div>

                      {/* Promotion Amount - Prominently displayed */}
                      {promo.candidate.type === 'bogo' ? (
                        <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/40">
                          <div className="text-center">
                            <div className="text-sm text-green-300 mb-1">Special Offer</div>
                            <div className="text-3xl font-black text-green-400">BUY 1 GET 1</div>
                            <div className="text-xs text-green-300 mt-1">Buy one, get one free - 50% off total</div>
                          </div>
                        </div>
                      ) : promo.candidate.discountPct ? (
                        <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/40">
                          <div className="text-center">
                            <div className="text-sm text-blue-300 mb-1">Discount Offered</div>
                            <div className="text-4xl font-black text-blue-400">{promo.candidate.discountPct}%</div>
                            <div className="text-xs text-blue-300 mt-1">Additional discount on top of current price</div>
                          </div>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 rounded-lg bg-tertiary">
                          <div className="text-xs text-secondary mb-1">Uplift Score</div>
                          <div className="text-lg font-bold text-primary">{(promo.uplift_score * 100).toFixed(1)}%</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-tertiary">
                          <div className="text-xs text-secondary mb-1">Expected Revenue</div>
                          <div className="text-lg font-bold text-green-400">${promo.candidate.estimated_inc_revenue?.toFixed(0)}</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-tertiary">
                          <div className="text-xs text-secondary mb-1">Objective</div>
                          <div className="text-lg font-bold text-blue-400">${promo.candidate.objective?.toFixed(0)}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-bold text-primary mb-1">Why this promotion?</div>
                          <p className="text-secondary mb-2">{promo.ui.rationale}</p>
                          
                          {/* Simple explanation */}
                          <div className="text-xs text-secondary/80 mb-2 leading-relaxed">
                            The AI analyzed customer behavior and found that {promo.top_drivers[0]?.driver.replace('_', ' ')} ({(promo.top_drivers[0]?.score * 100 || 0).toFixed(0)}%) is the strongest signal. 
                            {promo.candidate.type === 'bogo' 
                              ? ' A Buy-One-Get-One offer will maximize conversions for this product.'
                              : ` A ${promo.candidate.discountPct}% discount should increase purchases without over-discounting.`
                            }
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {promo.top_drivers.map((driver, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                                {driver.driver.replace('_', ' ')}: {(driver.score * 100).toFixed(0)}%
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-tertiary">
                        <span>Product ID: {promo.product_id}</span>
                        <span>{new Date(promo.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
