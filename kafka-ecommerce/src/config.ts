import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const config = {
  kafka: {
    broker: process.env.KAFKA_BROKER || 'localhost:9092',
    clientId: process.env.KAFKA_CLIENT_ID || 'ecommerce-app',
    groupId: process.env.KAFKA_GROUP_ID || 'ecommerce-group',
    topics: {
      transactions: process.env.KAFKA_TRANSACTIONS_TOPIC || 'ecommerce-transactions',
      productViews: process.env.KAFKA_PRODUCT_VIEWS_TOPIC || 'product-views',
      userActivity: process.env.KAFKA_USER_ACTIVITY_TOPIC || 'user-activity',
      promotionExposure: process.env.KAFKA_PROMOTION_EXPOSURE_TOPIC || 'actions.promotion_exposure',
      promotionDecisions: process.env.KAFKA_PROMOTION_DECISIONS_TOPIC || 'actions.promotion_decisions',
      promotionOutcomes: process.env.KAFKA_PROMOTION_OUTCOMES_TOPIC || 'actions.promotion_outcomes',
      explanations: process.env.KAFKA_EXPLANATIONS_TOPIC || 'actions.explanations',
      reviewQueue: process.env.KAFKA_REVIEW_QUEUE_TOPIC || 'actions.review_queue'
    }
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'ecommerce',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres'
  },
  server: {
    wsPort: parseInt(process.env.WS_PORT || '3001'),
    apiPort: parseInt(process.env.API_PORT || '3000')
  },
  business: {
    expectedReach: parseInt(process.env.BUSINESS_EXPECTED_REACH || '100'),
    maxDiscountPct: parseFloat(process.env.BUSINESS_MAX_DISCOUNT_PCT || '0.25'),
    minMarginAfter: parseFloat(process.env.BUSINESS_MIN_MARGIN_AFTER || '0.05'),
    manualReviewThreshold: parseFloat(process.env.BUSINESS_MANUAL_REVIEW_THRESHOLD || '10000.0'), // Increased to 100k to auto-approve BOGO
    viewsNormalizer: parseInt(process.env.BUSINESS_VIEWS_NORMALIZER || '500'),
    timeNormalizerSeconds: parseInt(process.env.BUSINESS_TIME_NORMALIZER || '60')
  ,
    unitMarginPct: parseFloat(process.env.BUSINESS_UNIT_MARGIN_PCT || '0.25')
  },
  producer: {
    batchSize: parseInt(process.env.BATCH_SIZE || '100'),
    streamDelayMs: parseInt(process.env.STREAM_DELAY_MS || '1000'),
    datasetPath: path.resolve(__dirname, '../data/indian_ecommerce_dataset_50k.csv')
  }
};