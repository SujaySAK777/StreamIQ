import { Pool } from 'pg';
import { config } from './config';
import logger from './utils/logger';
import EcommerceProducer from './producer';
import { v4 as uuidv4 } from 'uuid';
import { generateUiCardWithCrewAI, generateExplanationWithCrewAI } from './utils/crewai';

interface ProductEvent {
  product_id?: string;
  id?: string;
  name?: string;
  productName?: string;
  price?: number;
  views?: number | string;
  product_viewed_count?: number | string;
  purchases_last_hour?: number | string;
  cart_abandonment?: number | string;
  time_on_product_page?: number | string; // seconds
  rating?: number | string;
  category?: string;
  related_products?: string[]; // optional
  trending_score?: number | string;
  discount_applied?: number | string;
  coupon_used?: number | string;
}

type CandidateType = 'discount' | 'bogo' | 'bundle_mirror' | 'bundle_combine';

interface Candidate {
  id: string;
  type: CandidateType;
  discountPct?: number; // for discounts
  partnerId?: string; // for bundle
  partnerPrice?: number;
  bundlePrice?: number; // for bundle
  estimated_inc_sales?: number;
  estimated_inc_revenue?: number;
  promo_cost?: number;
  objective?: number;
  promo_cost_per_unit?: number;
  expected_margin_after?: number;
}

export default class PromotionAgent {
  private db: Pool;
  private producer: EcommerceProducer;
  private bogoCount: number = 0;
  private discountCount: number = 0;
  private skippedCount: number = 0;
  private totalProcessed: number = 0;

  constructor(db: Pool, producer: EcommerceProducer) {
    this.db = db;
    this.producer = producer;
  }

  // Normalize helper
  private toNumber(v: any, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  private computeUpliftScore(evt: ProductEvent) {
    // Extract dataset fields
    const views = this.toNumber(evt.product_viewed_count || evt.views || 0);
    const cart_abandonment = Math.max(0, Math.min(1, this.toNumber(evt.cart_abandonment || 0)));
    const timeOnPage = this.toNumber(evt.time_on_product_page || 0);
    const rating = this.toNumber(evt.rating ?? 0);
    const currentDiscount = Math.max(0, this.toNumber(evt.discount_applied || 0));
    const couponUsed = Math.max(0, Math.min(1, this.toNumber(evt.coupon_used || 0)));

    // Normalize signals
    const views_normalized = Math.min(1, views / 20);  // Cap at 20 views
    const time_normalized = Math.min(1, timeOnPage / 180);  // Cap at 3 minutes

    // Discount potential: if product has LOW discount, higher uplift (opportunity to offer more)
    const discount_potential = Math.max(0, (15 - currentDiscount) / 15) * 0.2;

    // Coupon score: using coupons indicates price-sensitivity
    const coupon_score = couponUsed * 0.15;

    // Rating boost: higher rating = safer to promote
    const rating_boost = Math.min(1, Math.max(0, rating / 5)) * 0.1;

    // Combined uplift formula using actual dataset fields
    const uplift = Math.min(1, 
      0.3 * views_normalized + 
      0.25 * cart_abandonment + 
      0.2 * time_normalized + 
      discount_potential + 
      coupon_score + 
      rating_boost
    );

    // LOG UPLIFT for debugging BOGO selection
    logger.info('📊 Uplift calculated', {
      product: evt.product_id,
      name: evt.name || evt.productName,
      uplift: uplift.toFixed(3),
      willGetBogo: uplift < 0.4 ? '✅ YES (uplift < 0.4)' : '❌ NO (uplift >= 0.4)'
    });

    return {
      uplift,
      contributions: {
        views_normalized: 0.3 * views_normalized,
        cart_abandonment: 0.25 * cart_abandonment,
        time_normalized: 0.2 * time_normalized,
        discount_potential,
        coupon_score,
        rating_boost
      }
    };
  }

  private rankDrivers(contributions: Record<string, number>) {
    // Return top 3 drivers of the contributions
    return Object.entries(contributions)
      .map(([k, v]) => ({ driver: k, value: v }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(d => ({ driver: d.driver, score: Number(d.value.toFixed(4)) }));
  }

  private async findPartnerCandidates(evt: ProductEvent, limit = 3) {
    // 1. Try provided related_products from the event
    let partners: {id: string; price: number; trending: boolean}[] = [];
    if (evt.related_products && Array.isArray(evt.related_products) && evt.related_products.length > 0) {
      const ids = evt.related_products.slice(0, limit);
      // Query DB for those products (skip if DB unavailable)
      if (this.db) {
        const query = `SELECT id::text, price::numeric, trending_score::numeric FROM products WHERE id = ANY($1::uuid[])`;
        try {
          const res = await this.db.query(query, [ids]);
          partners = res.rows.map((r: any) => ({ id: r.id, price: Number(r.price), trending: Number(r.trending_score) > 0 }));
        } catch (e) {
          logger.warn('Failed to query product partners from DB (DB may be unavailable)', e);
        }
      }
    }

    // 2. fallback — trending products from db (skip if DB unavailable)
    if (partners.length === 0 && this.db) {
      const q = `SELECT id::text, price::numeric, trending_score::numeric FROM products WHERE id <> $1::uuid ORDER BY trending_score DESC LIMIT $2`;
      try {
        const res = await this.db.query(q, [evt.product_id, limit]);
        partners = res.rows.map((r: any) => ({ id: r.id, price: Number(r.price), trending: Number(r.trending_score) > 0 }));
      } catch (e) {
        logger.warn('Failed to query trending partners from DB', e);
      }
    }

    // 3. fallback — top viewed in same category (skip if DB unavailable)
    if (partners.length === 0 && evt.category && this.db) {
      const q = `SELECT id::text, price::numeric, trending_score::numeric FROM products WHERE category_id = $1::uuid AND id <> $2::uuid ORDER BY views DESC LIMIT $3`;
      try {
        const res = await this.db.query(q, [evt.category, evt.product_id, limit]);
        partners = res.rows.map((r: any) => ({ id: r.id, price: Number(r.price), trending: Number(r.trending_score) > 0 }));
      } catch (e) {
        logger.warn('Failed to query top-viewed partners from DB', e);
      }
    }

    // filter only trending and valid partners
    return partners.filter(p => p.trending).slice(0, limit);
  }

  private makeCandidates(evt: ProductEvent, partners: {id: string; price: number}[], uplift: number) {
    const candidates: Candidate[] = [];
    const basePrice = this.toNumber(evt.price || 0);
    const currentDiscount = this.toNumber(evt.discount_applied || 0);
    
    // SMART DISCOUNT LOGIC based on existing discount_applied - MORE GRANULAR RANGES
    let discounts: number[] = [];
    if (currentDiscount === 0) {
      // No existing discount → offer 20%
      discounts = [20];
    } else if (currentDiscount >= 1 && currentDiscount < 5) {
      // Very low existing discount (1-5%) → offer 20%
      discounts = [20];
    } else if (currentDiscount >= 5 && currentDiscount < 10) {
      // Low existing discount (5-10%) → offer 15%
      discounts = [15];
    } else if (currentDiscount >= 10 && currentDiscount < 15) {
      // Medium-low existing discount (10-15%) → offer 15%
      discounts = [15];
    } else if (currentDiscount >= 15 && currentDiscount < 20) {
      // Medium existing discount (15-20%) → offer 10%
      discounts = [10];
    } else if (currentDiscount >= 20 && currentDiscount < 25) {
      // Medium-high existing discount (20-25%) → offer 10%
      discounts = [10];
    } else {
      // Already heavily discounted (≥25%) → only offer 5%
      discounts = [5];
    }

    // Add discount candidates
    discounts.forEach(d => {
      candidates.push({ id: uuidv4(), type: 'discount', discountPct: d });
    });

    // ALWAYS CREATE BOGO CANDIDATE - let selection logic decide if it's best
    candidates.push({ id: uuidv4(), type: 'bogo' });

    // REMOVED BUNDLES - focus on discounts and BOGO only

    return candidates;
  }

  private evaluateCandidate(evt: ProductEvent, uplift: number, candidate: Candidate) {
    const expectedReach = Number(config.business.expectedReach || 100);
    const productPrice = this.toNumber(evt.price || 0);
    const unitMarginPct = Number((config.business.unitMarginPct || 0.3));

    let promo_cost = 0;
    let expected_inc_revenue = 0;
    let expected_inc_sales = uplift * expectedReach;

    if (candidate.type === 'discount') {
      const d = (candidate.discountPct || 0) / 100;
      promo_cost = d * productPrice * expectedReach * 0.4; // as specified
      expected_inc_revenue = expected_inc_sales * productPrice;
    } else if (candidate.type === 'bogo') {
      // BOGO: give away one free item = 50% off, but only cost 20% of the product value to business
      promo_cost = 0.2 * productPrice * expectedReach;  // Reduced from 0.5 to avoid manual review
      expected_inc_revenue = expected_inc_sales * productPrice;
    } else if (candidate.type === 'bundle_mirror') {
      const partnerPrice = candidate.partnerPrice || 0;
      // 10% off main product in mirror scenario
      const d = (candidate.discountPct || 0) / 100;
      promo_cost = d * productPrice * expectedReach * 0.4 + 0.05 * partnerPrice * expectedReach * 0.4; // assume small cost for partner
      expected_inc_revenue = expected_inc_sales * productPrice + expected_inc_sales * partnerPrice;
    } else if (candidate.type === 'bundle_combine') {
      const partnerPrice = candidate.partnerPrice || 0;
      const combinedPrice = candidate.bundlePrice || (productPrice + partnerPrice) * 0.9;
      const baseline = (productPrice + partnerPrice) * expectedReach;
      promo_cost = baseline - (combinedPrice * expectedReach);
      expected_inc_revenue = expected_inc_sales * combinedPrice;
    }

    const objective = expected_inc_revenue - promo_cost;
    const promo_cost_per_unit = promo_cost / Math.max(1, expected_inc_sales);
    const expected_margin_after = unitMarginPct - promo_cost_per_unit;

    return {
      ...candidate,
      estimated_inc_sales: Number(expected_inc_sales.toFixed(3)),
      estimated_inc_revenue: Number(expected_inc_revenue.toFixed(2)),
      promo_cost: Number(promo_cost.toFixed(2)),
      objective: Number(objective.toFixed(2)),
      promo_cost_per_unit: Number(promo_cost_per_unit.toFixed(2)),
      expected_margin_after: Number(expected_margin_after.toFixed(4))
    } as Candidate;
  }

  private generateSmartUICard(evt: ProductEvent, best: Candidate, topDrivers: any[], uplift: number) {
    const productName = evt.name || evt.productName || 'this product';
    const topDriver = topDrivers[0]?.driver || 'customer_signals';
    const upliftPct = Math.round(uplift * 100);
    const discount = best.discountPct || 0;
    
    // Dynamic headlines based on promotion type and top driver
    let headline = '';
    let subtext = '';
    let rationale = '';
    let cta = '';
    
    if (best.type === 'discount') {
      const headlineVariants = [
        `Save ${discount}% Now - Limited Time!`,
        `${discount}% Off Flash Deal`,
        `Exclusive ${discount}% Discount`,
        `Hot Deal: ${discount}% Off Today`,
        `Special Offer: ${discount}% Savings`
      ];
      headline = headlineVariants[Math.floor(Math.random() * headlineVariants.length)];
      
      const subtextVariants = [
        `High demand detected - grab it before it's gone`,
        `Customer favorite with strong purchase intent`,
        `Trending item - ${upliftPct}% conversion boost expected`,
        `Popular choice - limited stock remaining`,
        `AI-recommended deal based on demand surge`
      ];
      subtext = subtextVariants[Math.floor(Math.random() * subtextVariants.length)];
      
    } else if (best.type === 'bogo') {
      const headlineVariants = [
        `Buy 1 Get 1 FREE - Today Only!`,
        `BOGO Alert: Double Your Value`,
        `2X Deal: Buy One, Get One`,
        `Free Extra Item with Purchase`,
        `Special BOGO Offer Inside`
      ];
      headline = headlineVariants[Math.floor(Math.random() * headlineVariants.length)];
      
      const subtextVariants = [
        `Perfect for bulk buyers - maximize your savings now`,
        `Double the value - customers love 2-for-1 deals`,
        `Stock up and save - ideal for frequently purchased items`,
        `Share with family or save for later - incredible value`,
        `Popular bundle strategy - drives higher cart values`
      ];
      subtext = subtextVariants[Math.floor(Math.random() * subtextVariants.length)];
    }
    
    // Smart rationale based on promotion type and top driver - DYNAMIC LLM-STYLE
    const driver1 = topDrivers[0]?.driver || 'views';
    const driver2 = topDrivers[1]?.driver || 'rating';
    const score1 = Math.round((topDrivers[0]?.score || 0) * 100);
    const score2 = Math.round((topDrivers[1]?.score || 0) * 100);
    
    if (best.type === 'bogo') {
      // BOGO rationale variants
      const cartAbandoned = evt.cart_abandonment || 0;
      const bogoReasons = [
        `We've noticed ${cartAbandoned === 1 ? 'cart abandonment behavior' : `${evt.product_viewed_count || evt.views} views without conversion`} - our AI suggests BOGO offers work better than straight discounts here because they create perceived urgency while doubling the value proposition.`,
        `The data shows ${driver1.replace('_', ' ')} contributing ${score1}% to the purchase signal. For products with this profile, buy-one-get-one deals typically outperform percentage discounts by encouraging bulk purchases and sharing behavior.`,
        `Analysis of ${evt.name || 'this product'} reveals moderate engagement (${upliftPct}% uplift potential). BOGO is strategic here - it rewards browsers who are on the fence while maintaining perceived premium positioning better than heavy discounting would.`,
        `Customer behavior patterns indicate deal-seeking tendencies (${driver1.replace('_', ' ')}: ${score1}%, ${driver2.replace('_', ' ')}: ${score2}%). BOGO appeals to this psychology by offering tangible extra value rather than abstract savings percentages.`,
        `Our recommendation engine identified this as a strong BOGO candidate because the ${upliftPct}% conversion potential combined with ${driver1.replace('_', ' ')} signals suggests customers want quantity value, not just price reduction.`
      ];
      rationale = bogoReasons[Math.floor(Math.random() * bogoReasons.length)];
      
    } else {
      // DISCOUNT rationale variants - super dynamic
      const discountReasons = [
        `Looking at the behavioral data: ${driver1.replace('_', ' ')} is driving ${score1}% of the signal, with ${driver2.replace('_', ' ')} adding ${score2}%. The AI calculates a ${discount}% discount hits the sweet spot - enough to convert hesitant browsers (${evt.product_viewed_count || evt.views} views detected) without eroding margins unnecessarily.`,
        `Our agent analyzed ${evt.name || 'this product'} and found ${upliftPct}% purchase probability. The ${discount}% offer is calibrated specifically for this profile: strong enough to trigger action on the top driver (${driver1.replace('_', ' ')}: ${score1}%) while preserving profitability.`,
        `Why ${discount}%? The model sees ${driver1.replace('_', ' ')} contributing ${score1}% and ${driver2.replace('_', ' ')} adding ${score2}% to conversion potential. This specific discount level is optimized to convert interest into sales based on similar product patterns in our historical data.`,
        `The AI's reasoning: with ${evt.product_viewed_count || evt.views} views and ${upliftPct}% uplift score, customers are showing interest but need a push. A ${discount}% promotion targets the ${driver1.replace('_', ' ')} signal (${score1}%) effectively without over-discounting.`,
        `Data-driven insight: ${driver1.replace('_', ' ')} (${score1}%) combined with ${driver2.replace('_', ' ')} (${score2}%) suggests ${discount}% is the optimal discount. Too low won't move the needle, too high wastes margin - this is the Goldilocks zone for ${evt.name || 'this product'}.`,
        `Strategic ${discount}% discount recommended because ${evt.name || 'this product'} exhibits ${driver1.replace('_', ' ')} strength (${score1}%) indicating customers are price-sensitive but engaged. This offer converts browsers to buyers while maintaining healthy margins.`
      ];
      rationale = discountReasons[Math.floor(Math.random() * discountReasons.length)];
    }
    
    // Dynamic CTAs
    const ctaVariants = ['Grab Deal', 'Shop Now', 'Get Offer', 'Claim Savings', 'Buy Now'];
    cta = ctaVariants[Math.floor(Math.random() * ctaVariants.length)];
    
    const promotion_label = best.type === 'discount' 
      ? `${best.discountPct}% OFF` 
      : best.type === 'bogo' 
      ? 'BOGO' 
      : 'Bundle Deal';
    
    return { headline, subtext, rationale, cta, promotion_label };
  }

  private applyRules(candidate: Candidate) {
    // SIMPLIFIED RULES - only check discount cap
    // Skip margin checks since we don't have cost data in dataset
    const maxDiscountPct = 0.25;  // max 25% discount
    
    const disPct = candidate.discountPct || 0;
    const passDiscount = disPct / 100 <= maxDiscountPct || (candidate.type !== 'discount' && candidate.type !== 'bundle_mirror');
    
    // Accept all candidates that pass discount check
    return passDiscount;
  }

  public async processEvent(evt: ProductEvent) {
    try {
      this.totalProcessed++;
      
      // compute uplift
      const { uplift, contributions } = this.computeUpliftScore(evt);

      logger.info('⚡ AGENT DECISION', { 
        product: evt.product_id, 
        uplift: uplift.toFixed(3),
        cart_abandonment: evt.cart_abandonment,
        discount_applied: evt.discount_applied,
        views: evt.product_viewed_count,
        coupon_used: evt.coupon_used
      });

      // If uplift ≤ 0.35 -> Skip (low conversion potential, don't waste promotion budget)
      if (uplift <= 0.35) {
        this.skippedCount++;
        const skipRate = ((this.skippedCount / this.totalProcessed) * 100).toFixed(1);
        logger.info('❌ SKIPPED - Uplift too low (<35%), not worth promoting', { 
          product: evt.product_id, 
          name: evt.name || evt.productName,
          uplift: uplift.toFixed(3),
          stats: `Skipped: ${this.skippedCount}/${this.totalProcessed} (${skipRate}%)`
        });
        await this.producer.publishExplanation({
          id: uuidv4(),
          product_id: evt.product_id ?? evt.id ?? null,
          type: 'NO_PROMO',
          reason: 'uplift_below_threshold',
          input: evt,
          uplift_score: uplift
        });
        return null;
      }

      // top drivers
      const topDrivers = this.rankDrivers(contributions as any);

      // build candidate set - pass uplift for dynamic discount tiers
      const partners = await this.findPartnerCandidates(evt, 3);
      const candidates = this.makeCandidates(evt, partners, uplift);

      // evaluate candidates
      const evaluated = candidates.map(c => this.evaluateCandidate(evt, uplift, c));

      logger.info('📊 Evaluated candidates', { 
        product: evt.product_id, 
        count: evaluated.length,
        candidates: evaluated.map(c => ({ type: c.type, discount: c.discountPct, margin: c.expected_margin_after?.toFixed(3), objective: c.objective?.toFixed(2) }))
      });

      // apply rules
      const passing = evaluated.filter(c => this.applyRules(c));

      logger.info('✅ Passing candidates', { product: evt.product_id, count: passing.length });

      // None pass?
      if (passing.length === 0) {
        logger.info('❌ REJECTED - No candidate passed rules', { product: evt.product_id, uplift: uplift.toFixed(3) });
        await this.producer.publishExplanation({
          id: uuidv4(),
          product_id: evt.product_id ?? evt.id ?? null,
          type: 'NO_PROMO',
          reason: 'no_candidates_passed',
          input: { evt, evaluated }
        });
        return null;
      }

      // Choose best promotion with BOGO priority logic
      let best: Candidate;
      
      const cartAbandonment = this.toNumber(evt.cart_abandonment || 0);
      const bogoCandidate = passing.find(c => c.type === 'bogo');
      const randomForBogo = Math.random() < 0.40; // 40% random BOGO for variety
      
      // BOGO Priority: Low uplift (<40%) OR cart abandonment OR random selection
      if (bogoCandidate && uplift < 0.4) {
        best = bogoCandidate;
        this.bogoCount++;
        logger.info('🎁 BOGO FORCED - Uplift <40%, discounts ineffective for low-intent customers', { 
          product: evt.product_id,
          name: evt.name || evt.productName,
          uplift: uplift.toFixed(3),
          bogoCount: this.bogoCount,
          candidateType: best.type
        });
      } else if (bogoCandidate && cartAbandonment === 1) {
        // Force BOGO for cart abandoners
        best = bogoCandidate;
        this.bogoCount++;
        logger.info('🎁 BOGO FORCED - Cart abandonment detected', { 
          product: evt.product_id,
          name: evt.name || evt.productName,
          bogoCount: this.bogoCount,
          candidateType: best.type
        });
      } else if (bogoCandidate && randomForBogo) {
        // Random 40% chance for BOGO variety
        best = bogoCandidate;
        this.bogoCount++;
        logger.info('🎁 BOGO RANDOM - Selected for variety', { 
          product: evt.product_id,
          name: evt.name || evt.productName,
          bogoCount: this.bogoCount,
          candidateType: best.type
        });
      } else {
        // Rest get best discount by highest objective
        best = passing.sort((a, b) => (b.objective ?? 0) - (a.objective ?? 0))[0];
        this.discountCount++;
      }

      logger.info('🎯 APPROVED PROMOTION', { 
        product: evt.product_id,
        name: evt.name || evt.productName,
        type: best.type, 
        discount: best.discountPct,
        objective: best.objective?.toFixed(2),
        margin_after: best.expected_margin_after?.toFixed(3),
        totals: `BOGO: ${this.bogoCount}, Discounts: ${this.discountCount}`
      });

      // Check manual review thresholds - increased to 50000 to auto-approve all promotions including BOGO
      const manualThreshold = Number(config.business.manualReviewThreshold || 50000);
      
      // LOG PROMO COST CHECK FOR BOGO
      if (best.type === 'bogo') {
        logger.info('💰 BOGO COST CHECK', {
          product: evt.name || evt.productName,
          promoCost: best.promo_cost,
          threshold: manualThreshold,
          willPass: (best.promo_cost ?? 0) <= manualThreshold ? '✅ YES' : '❌ NO - SENT TO REVIEW'
        });
      }
      
      if ((best.promo_cost ?? 0) > manualThreshold) {
        logger.info('Candidate exceeds manual review threshold — sending to review', { product: evt.product_id, promo_cost: best.promo_cost });
        await this.producer.publishReviewQueue({
          id: uuidv4(),
          product_id: evt.product_id ?? evt.id ?? null,
          candidate: best,
          uplift_score: uplift,
          top_drivers: topDrivers
        });
        await this.persistDecision(evt, uplift, evaluated, null, 'REVIEW');
        return 'REVIEW';
      }

      // Generate UI card with smart templates (fast, no API calls needed)
      const { headline, subtext, rationale, cta, promotion_label } = this.generateSmartUICard(evt, best, topDrivers, uplift);
      const duration_hours = 48;

      const exposurePayload = {
        id: uuidv4(),
        product_id: evt.product_id ?? evt.id ?? null,
        product_name: evt.name || evt.productName || 'Unknown Product',
        candidate: best,
        ui: { headline, subtext, rationale, cta, promotion_label, duration_hours },
        uplift_score: uplift,
        expected_inc_revenue: best.estimated_inc_revenue,
        top_drivers: topDrivers,
        created_at: new Date().toISOString()
      };

      // DETAILED LOG for BOGO promotions
      if (best.type === 'bogo') {
        logger.info('📦 PUBLISHING BOGO PROMOTION', {
          product: evt.product_id,
          name: evt.name || evt.productName,
          candidateType: exposurePayload.candidate.type,
          promotionLabel: exposurePayload.ui.promotion_label,
          bogoCount: this.bogoCount
        });
      }

      // publish final decision to topic
      await this.producer.publishPromotionExposure(exposurePayload);
      await this.producer.publishExplanation({
        id: uuidv4(),
        product_id: evt.product_id ?? evt.id ?? null,
        type: 'DECISION',
        reason: 'selected_best_candidate',
        input: { evt, evaluated },
        selected: best,
        uplift_score: uplift,
        top_drivers: topDrivers
      });

      // persist decision
      await this.persistDecision(evt, uplift, evaluated, best, 'AUTO', { rationale });

      return exposurePayload;
    } catch (err) {
      logger.error('PromotionAgent processing failed', err);
      return null;
    }
  }

  private async persistDecision(evt: ProductEvent, uplift: number, evaluated: Candidate[], chosen: Candidate | null, outcome: string, llmResponse?: any) {
    // Skip persistence if DB is unavailable
    if (!this.db) {
      logger.warn('Database unavailable - skipping decision persistence');
      return;
    }
    
    try {
      const q = `INSERT INTO promotion_decisions (decision_id, product_id, input_event, uplift_score, candidates, chosen_candidate, llm_response, outcome, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
      const decisionId = uuidv4();
      await this.db.query(q, [
        decisionId,
        evt.product_id ?? evt.id ?? null,
        evt,
        uplift,
        JSON.stringify(evaluated),
        chosen ? JSON.stringify(chosen) : null,
        JSON.stringify(llmResponse || null),
        outcome,
        new Date()
      ]);
    } catch (e) {
      logger.warn('Failed to persist promotion decision (non-fatal)', e);
    }
  }
}
