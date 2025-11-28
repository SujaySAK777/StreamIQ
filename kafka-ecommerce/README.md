# Real-time E-commerce Data Streaming with Apache Kafka

This project implements a real-time data streaming pipeline for e-commerce transactions using Apache Kafka, Node.js, PostgreSQL, and WebSocket for live updates.

## Features

- Real-time transaction streaming from CSV dataset
- Live dashboard with auto-refresh capabilities
- WebSocket integration for instant updates
- PostgreSQL database for data persistence
- Comprehensive error handling and logging
- Docker-based setup for Kafka and PostgreSQL
- Scalable architecture with producer/consumer pattern

## Prerequisites

- Docker and Docker Compose
- Node.js 16+ and npm
- PostgreSQL client (for running migrations)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kafka-ecommerce
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies (in root directory)
   cd ../
   npm install
   ```

3. Start the infrastructure:
   ```bash
   cd kafka-ecommerce
   docker-compose up -d
   ```

4. Run database migrations:
   ```bash
   # Copy migrations to Postgres container
   docker exec postgres mkdir -p /app/migrations
   docker cp migrations/init.sql postgres:/app/migrations/
   docker cp migrations/20251019000000_add_user_preferences.sql postgres:/app/migrations/
   docker cp migrations/20251019000001_add_product_recommendations.sql postgres:/app/migrations/
   docker cp migrations/20251126120000_add_promotion_decisions.sql postgres:/app/migrations/
   
   # Run migrations
   docker exec postgres psql -U postgres -d ecommerce -f /app/migrations/init.sql -f /app/migrations/20251019000000_add_user_preferences.sql -f /app/migrations/20251019000001_add_product_recommendations.sql
   docker exec postgres psql -U postgres -d ecommerce -f /app/migrations/20251126120000_add_promotion_decisions.sql
   ```

5. Create Kafka topics:
   ```bash
   # Create topics with proper partitions and retention
   docker exec kafka /opt/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 6 --topic ecommerce-transactions
   docker exec kafka /opt/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic product-views
   docker exec kafka /opt/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic user-activity
   docker exec kafka /opt/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic actions.promotion_exposure
   docker exec kafka /opt/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic actions.explanations
   docker exec kafka /opt/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic actions.review_queue
   ```

6. Start the services:
   ```bash
   # Start the backend services
   npm run start:producer  # Terminal 1
   npm run start:consumer  # Terminal 2
   npm run start:refresh   # Terminal 3

   # Start the frontend (from root directory)
   cd ../
   npm run dev            # Terminal 4
   ```

7. Verify setup:
   ```bash
   # Check if data is being processed
   docker exec postgres psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM transactions;"
   docker exec postgres psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM product_views;"
   
   # Check materialized views
   docker exec postgres psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM product_categories;"
   docker exec postgres psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM user_product_preferences;"
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend/WebSocket: http://localhost:3001
   ```

5. Initialize the database:
   ```bash
   # Apply database migrations
   docker exec postgres psql -U postgres -d ecommerce -f /tmp/init.sql
   ```

6. Start the services:
   ```bash
   # Start backend services (in kafka-ecommerce directory)
   npm run start:producer   # Terminal 1 - Data producer
   npm run start:consumer   # Terminal 2 - Data consumer
   npm run start:server     # Terminal 3 - WebSocket server
  npm run run:agent        # Optional: Execute a test promotion agent runner

   # Start frontend (in root directory)
   cd ../
   npm run dev             # Terminal 4 - React development server
   ```

7. Access the application:
   - Frontend: http://localhost:5173 - Live dashboard
   - API endpoints:
     - http://localhost:3000/api/transactions - Recent transactions
     - http://localhost:3000/api/stats - Analytics data

## Architecture

- `producer.ts`: Reads CSV data and streams to Kafka topics
- `consumer.ts`: Consumes Kafka messages and stores in PostgreSQL
- `promotionAgent.ts`: Agent that inspects products classified as 'needs promotion', computes uplift score, creates candidate promos, and publishes promotion decisions and explanations to Kafka topics (uses optional CrewAI for UI card generation)
- `server.ts`: WebSocket server for real-time updates and REST API
- Frontend integration with existing React application

## API Endpoints

- `GET /api/transactions`: Get recent transactions
- `GET /api/stats`: Get analytics and statistics

## WebSocket Events

- `connection`: Client connected
- `newTransaction`: New transaction received
- `disconnect`: Client disconnected

## Monitoring

- Check logs in `error.log` and `combined.log`
- Monitor Kafka using Kafka Manager UI
- PostgreSQL monitoring through pgAdmin

## Development

1. Build TypeScript:
   ```bash
   npm run build
   ```

2. Run tests:
   ```bash
   npm test
   ```

## Environment Variables

See `.env` file for available configuration options:
- Kafka settings
- PostgreSQL connection
- WebSocket/API ports
- Producer configuration

## Production Deployment

1. Update environment variables for production
2. Build the TypeScript code
3. Use process manager (PM2) for Node.js services
4. Set up monitoring and alerting
5. Configure security groups and firewalls

## Troubleshooting

1. Kafka Connection Issues:
   - Check if Kafka containers are running
   - Verify broker configuration
   - Check network connectivity

2. Database Issues:
   - Verify PostgreSQL connection
   - Check database logs
   - Run migrations manually

3. WebSocket Connection:
   - Check client-side connection
   - Verify CORS settings
   - Check server logs

## License

MIT