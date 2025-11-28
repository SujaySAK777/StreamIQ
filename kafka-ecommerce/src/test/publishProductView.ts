import { Kafka } from 'kafkajs';
import { config } from '../config';

async function main() {
  const kafka = new Kafka({ clientId: 'test-producer', brokers: [config.kafka.broker] });
  const producer = kafka.producer();
  await producer.connect();

  const message = {
    product_id: '00000000-0000-0000-0000-000000000001',
    product_name: 'Test Product for Promo',
    price: 99.99,
    category: null,
    product_viewed_count: 300,
    views: 300,
    purchases_last_hour: 3,
    cart_abandonment: 0.7,
    time_on_product_page: 50,
    rating: 3.8,
    timestamp: new Date().toISOString()
  };

  await producer.send({
    topic: config.kafka.topics.productViews,
    messages: [{ value: JSON.stringify(message) }]
  });

  console.log('Published test product_view event');
  await producer.disconnect();
}

if (require.main === module) {
  main().catch(err => {
    console.error('Failed to publish test event', err);
    process.exit(1);
  });
}
