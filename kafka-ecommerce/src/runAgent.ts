import { Pool } from 'pg';
import EcommerceProducer from './producer';
import PromotionAgent from './promotionAgent';
import logger from './utils/logger';
import { config } from './config';

(async function main() {
  const db = new Pool(config.postgres);
  const producer = new EcommerceProducer();
  await producer.connect();
  const agent = new PromotionAgent(db, producer);

  const sampleEvent = {
    product_id: '00000000-0000-0000-0000-000000000001',
    name: 'Test product',
    price: 99.99,
    views: 300,
    product_viewed_count: 300,
    purchases_last_hour: 3,
    cart_abandonment: 0.7,
    time_on_product_page: 50,
    rating: 3.8,
    category: null
  } as any;

  try {
    const res = await agent.processEvent(sampleEvent);
    logger.info('Agent result:', res);
  } catch (e) {
    logger.error('RunAgent error', e);
  } finally {
    await producer.disconnect();
    await db.end();
  }
})();
