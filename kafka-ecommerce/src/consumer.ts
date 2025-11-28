import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Pool } from 'pg';
import { Server as SocketServer } from 'socket.io';
import { config } from './config';
import EcommerceProducer from './producer';
import PromotionAgent from './promotionAgent';
import logger from './utils/logger';

class EcommerceConsumer {
  private consumer: Consumer;
  private db: Pool;
  private io?: SocketServer;
  private producer?: EcommerceProducer;
  private promotionAgent?: PromotionAgent;
  private dbAvailable: boolean = true;
  private isConnected: boolean = false;

  constructor() {
    const kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: [config.kafka.broker]
    });

    this.consumer = kafka.consumer({ groupId: config.kafka.groupId });
    this.db = new Pool(config.postgres);
  }

  setSocketServer(io: SocketServer) {
    this.io = io;
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topics: [
          config.kafka.topics.transactions,
          config.kafka.topics.productViews,
          config.kafka.topics.userActivity
        ],
        fromBeginning: true
      });
      // Ensure the promotion producer and agent are ready
      this.producer = new EcommerceProducer();
      await this.producer.connect();
      this.promotionAgent = new PromotionAgent(this.db, this.producer);
      this.isConnected = true;
      logger.info('Consumer connected to Kafka');
    } catch (error) {
      logger.error('Failed to connect consumer:', error);
      throw error;
    }
  }

  async startConsuming(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Consumer not connected to Kafka');
    }

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          const { topic, message } = payload;
          if (!message.value) return;

          const data = JSON.parse(message.value.toString());
          await this.processMessage(topic, data);
        } catch (error) {
          logger.error('Error processing message:', error);
        }
      }
    });
  }

  private async processMessage(topic: string, data: any): Promise<void> {
    try {
      // Store in database
      await this.storeInDatabase(topic, data);

      // Broadcast to WebSocket clients
        if (this.io) {
        // Normalize amount from incoming record: prefer `price`, then `retail_price`, then `total_amount`.
        const amount = parseFloat((data.price ?? data.retail_price ?? data.total_amount ?? 0).toString()) || 0;
        this.io.emit('transaction', {
          product_name: data.product_name || data.productName || data.name,
          amount,
          category: data.category || 'General',
          brand: data.brand || '',
          quantity: parseInt(data.quantity || '1') || 1,
          timestamp: new Date().toISOString()
        });
            // Also send a richer product update for frontend display. Normalize common fields.
            try {
              const productUpdate = {
                id: data.product_id || data.id || null,
                name: data.product_name || data.name || 'Unknown Product',
                category: data.category || '',
                brand: data.brand || '',
                price: parseFloat(data.price || data.retail_price || 0) || 0,
                description: data.description || '',
                image_url: data.image_url || '',
                stock: parseInt(data.quantity || data.stock || '0') || 0,
                rating: parseFloat(data.rating || '0') || 0,
                views: parseInt(data.product_viewed_count || data.views || '0') || 0,
                purchases_last_hour: parseInt(data.purchase_count || data.purchases_last_hour || '0') || 0,
                trending_score: parseFloat(data.trending_score || '0') || 0,
                created_at: data.timestamp || new Date().toISOString(),
              };

              // Process products through promotion agent ONLY if they need promotion
              // Filter: Only products with low purchases OR high cart abandonment OR low trending score
              const shouldConsiderPromotion = 
                (productUpdate.purchases_last_hour < 5) ||  // Low sales
                (parseInt(data.cart_abandonment || '0') === 1) ||  // Cart abandoned
                (productUpdate.trending_score < 50) ||  // Not trending well
                (productUpdate.views > 10 && productUpdate.purchases_last_hour === 0);  // High views but no purchases
              
              if (this.promotionAgent && shouldConsiderPromotion) {
                // Fire-and-forget agent processing
                this.promotionAgent.processEvent({
                  product_id: productUpdate.id,
                  name: productUpdate.name,
                  price: productUpdate.price,
                  views: productUpdate.views,
                  purchases_last_hour: productUpdate.purchases_last_hour,
                  trending_score: productUpdate.trending_score,
                  category: productUpdate.category,
                  rating: productUpdate.rating,
                  discount_applied: parseFloat(data.discount_applied || '0') || 0,
                  coupon_used: parseInt(data.coupon_used || '0') || 0,
                  cart_abandonment: parseInt(data.cart_abandonment || '0') || 0,
                  product_viewed_count: parseInt(data.product_viewed_count || data.views || '0') || 0,
                  time_on_product_page: parseInt(data.time_on_product_page || '0') || 0
                }).then(result => {
                  // Only emit APPROVED promotions to WebSocket
                  if (this.io && result && typeof result === 'object' && 'id' in result) {
                    this.io.emit('promotion_exposure', result);
                    logger.info('✅ Emitted approved promotion to WebSocket', { 
                      product: result.product_id, 
                      type: result.candidate?.type,
                      discount: result.candidate?.discountPct 
                    });
                  }
                }).catch(err => {
                  logger.error('Agent processing failed', err);
                });
              }

              this.io.emit('product_update', productUpdate);
            } catch (e) {
              // don't let emitting product updates crash processing
              logger.error('Failed to emit product_update:', e);
            }
      }

      logger.info(`Processed message from topic: ${topic}`);
    } catch (error) {
      logger.error('Error processing message:', error);
      throw error;
    }
  }

  private async storeInDatabase(topic: string, data: any): Promise<void> {
    if (!this.dbAvailable) return;

    // Attempt to connect to DB; if connection fails disable DB writes to avoid noisy logs
    let client = null as any;
    try {
      client = await this.db.connect();
    } catch (err) {
      this.dbAvailable = false;
      logger.error('Postgres unavailable — disabling DB writes:', err);
      return;
    }

    try {
      await client.query('BEGIN');

      if (topic === 'product_views') {
        await client.query(`
          INSERT INTO product_views (
            user_id,
            product_name,
            category,
            timestamp
          ) VALUES ($1, $2, $3, $4)
        `, [data.userId, data.productName, data.category, data.timestamp]);
      } else if (topic === 'purchases') {
        await client.query(`
          INSERT INTO transactions (
            user_id,
            product_name,
            retail_price,
            category,
            timestamp
          ) VALUES ($1, $2, $3, $4, $5)
        `, [data.userId, data.productName, data.price, data.category, data.timestamp]);
      }

      await client.query('INSERT INTO transactions (topic, data) VALUES ($1, $2)', [topic, data]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error storing in database:', error);
    } finally {
      try {
        client.release();
      } catch (e) {
        // ignore
      }
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      if (this.producer) await this.producer.disconnect();
      await this.db.end();
      this.isConnected = false;
      logger.info('Consumer disconnected');
    } catch (error) {
      logger.error('Error disconnecting consumer:', error);
      throw error;
    }
  }
}

// Start the consumer
async function main() {
  const consumer = new EcommerceConsumer();
  
  try {
    await consumer.connect();
    await consumer.startConsuming();
  } catch (error) {
    logger.error('Consumer failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default EcommerceConsumer;

