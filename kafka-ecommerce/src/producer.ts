import { Kafka, Producer } from 'kafkajs';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { config } from './config';
import logger from './utils/logger';

class EcommerceProducer {
  private producer: Producer;
  private isConnected: boolean = false;

  constructor() {
    const kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: [config.kafka.broker]
    });
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.isConnected = true;
      logger.info('Producer connected to Kafka');
    } catch (error) {
      logger.error('Failed to connect producer:', error);
      throw error;
    }
  }

  async streamData(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Producer not connected to Kafka');
    }

    const parser = createReadStream(config.producer.datasetPath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true
      }));

    let batchCount = 0;
    let records: any[] = [];

    for await (const record of parser) {
      records.push(record);
      batchCount++;

      if (batchCount >= config.producer.batchSize) {
        await this.sendBatch(records);
        records = [];
        batchCount = 0;
        await new Promise(resolve => setTimeout(resolve, config.producer.streamDelayMs));
      }
    }

    // Send remaining records
    if (records.length > 0) {
      await this.sendBatch(records);
    }
  }

  async publishPromotionExposure(payload: any) {
    try {
      await this.producer.send({
        topic: config.kafka.topics.promotionExposure,
        messages: [{ value: JSON.stringify(payload) }]
      });
      logger.info('Published promotion exposure', { product: payload.product_id });
    } catch (error) {
      logger.error('Failed to publish promotion exposure', error);
    }
  }

  async publishExplanation(payload: any) {
    try {
      await this.producer.send({
        topic: config.kafka.topics.explanations,
        messages: [{ value: JSON.stringify(payload) }]
      });
      logger.info('Published explanation', { product: payload.product_id });
    } catch (error) {
      logger.error('Failed to publish explanation', error);
    }
  }

  async publishReviewQueue(payload: any) {
    try {
      await this.producer.send({
        topic: config.kafka.topics.reviewQueue,
        messages: [{ value: JSON.stringify(payload) }]
      });
      logger.info('Published to review queue', { product: payload.product_id });
    } catch (error) {
      logger.error('Failed to publish to review queue', error);
    }
  }

  private async sendBatch(records: any[]): Promise<void> {
    try {
      const messages = records.map(record => ({
        value: JSON.stringify({
          ...record,
          timestamp: new Date().toISOString()
        })
      }));

      await this.producer.send({
        topic: config.kafka.topics.transactions,
        messages
      });

      logger.info(`Sent batch of ${records.length} records`);
    } catch (error) {
      logger.error('Error sending batch:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.isConnected = false;
      logger.info('Producer disconnected');
    } catch (error) {
      logger.error('Error disconnecting producer:', error);
      throw error;
    }
  }
}

// Start the producer
async function main() {
  const producer = new EcommerceProducer();
  
  try {
    await producer.connect();
    await producer.streamData();
  } catch (error) {
    logger.error('Producer failed:', error);
    process.exit(1);
  } finally {
    await producer.disconnect();
  }
}

if (require.main === module) {
  main();
}

export default EcommerceProducer;