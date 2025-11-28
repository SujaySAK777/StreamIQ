import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import { Pool } from 'pg';
import { config } from './config';
import logger from './utils/logger';
import EcommerceConsumer from './consumer';
import { startRefreshWorker } from './refreshWorker';
import { RecommendationEngine } from './utils/RecommendationEngine';

class WebSocketServer {
  private app: express.Application;
  private httpServer: any;
  private io: SocketServer;
  private db: Pool;
  private consumer: EcommerceConsumer;
  private stopRefreshWorker?: () => void;
  private recommendationEngine: RecommendationEngine;

  constructor() {
    this.app = express();
    this.setupExpress();
    this.httpServer = createServer(this.app);
    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.db = new Pool(config.postgres);
    this.consumer = new EcommerceConsumer();
    this.recommendationEngine = new RecommendationEngine();
    this.setupSocketHandlers();
  }

  private setupExpress(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.setupRoutes();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info('Client connected');

      socket.on('get_recommendations', async ({ userId }) => {
        try {
          const recommendations = await this.recommendationEngine.getRecommendations(userId);
          socket.emit('recommendations_update', recommendations);
        } catch (error) {
          logger.error('Error getting recommendations:', error);
        }
      });

      socket.on('product_view', async (data) => {
        try {
          await this.recommendationEngine.updateUserPreference(
            data.userId,
            data,
            'view'
          );
        } catch (error) {
          logger.error('Error tracking product view:', error);
        }
      });

      socket.on('purchase', async (data) => {
        try {
          await this.recommendationEngine.updateUserPreference(
            data.userId,
            data,
            'purchase'
          );
        } catch (error) {
          logger.error('Error tracking purchase:', error);
        }
      });

      socket.on('disconnect', () => {
        logger.info('Client disconnected');
      });
    });
  }

  private setupRoutes(): void {
    // Get recent transactions
    this.app.get('/api/transactions', async (req, res) => {
      try {
        const result = await this.db.query(
          'SELECT * FROM transactions ORDER BY processed_at DESC LIMIT 100'
        );
        res.json(result.rows);
      } catch (error) {
        logger.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Get statistics
    this.app.get('/api/stats', async (req, res) => {
      try {
        const stats = await this.getStats();
        res.json(stats);
      } catch (error) {
        logger.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  private async getStats() {
    const queries = {
      totalSales: `
        SELECT COUNT(*) as count, SUM((data->>'amount')::float) as total 
        FROM transactions 
        WHERE topic = $1
      `,
      categoryDistribution: `
        SELECT data->>'category' as category, COUNT(*) as count 
        FROM transactions 
        WHERE topic = $1 
        GROUP BY data->>'category'
      `,
      hourlyTrends: `
        SELECT date_trunc('hour', processed_at) as hour, COUNT(*) as count 
        FROM transactions 
        WHERE topic = $1 
        GROUP BY hour 
        ORDER BY hour DESC 
        LIMIT 24
      `
    };

    try {
      const [totalSales, categoryDist, hourlyTrends] = await Promise.all([
        this.db.query(queries.totalSales, [config.kafka.topics.transactions]),
        this.db.query(queries.categoryDistribution, [config.kafka.topics.transactions]),
        this.db.query(queries.hourlyTrends, [config.kafka.topics.transactions])
      ]);

      return {
        totalSales: totalSales.rows[0],
        categoryDistribution: categoryDist.rows,
        hourlyTrends: hourlyTrends.rows
      };
    } catch (err) {
      logger.error('Postgres unavailable when getting stats, returning defaults:', err);
      return {
        totalSales: { count: 0, total: 0 },
        categoryDistribution: [],
        hourlyTrends: []
      };
    }
  }

  private setupWebSocket(): void {
    this.io.on('connection', (socket) => {
      logger.info('Client connected');
      
      socket.on('disconnect', () => {
        logger.info('Client disconnected');
      });
    });

    // Connect consumer to WebSocket
    this.consumer.setSocketServer(this.io);
  }

  async start(): Promise<void> {
    try {
      // Start HTTP + WebSocket server (use configured wsPort so clients
      // connecting to the WS port succeed).
      this.httpServer.listen(config.server.wsPort, () => {
        logger.info(`API + WebSocket Server listening on port ${config.server.wsPort}`);
      });

      // Setup WebSocket
      this.setupWebSocket();

  // Connect and start consumer
  await this.consumer.connect();
  await this.consumer.startConsuming();

  // Start background refresh worker for materialized view
  this.stopRefreshWorker = startRefreshWorker(5000);

      logger.info('WebSocket server started successfully');
    } catch (error) {
      logger.error('Failed to start server:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await this.consumer.disconnect();
      await this.db.end();
      // Stop refresh worker if running
      if (this.stopRefreshWorker) this.stopRefreshWorker();
      this.httpServer.close();
      logger.info('Server stopped');
    } catch (error) {
      logger.error('Error stopping server:', error);
      throw error;
    }
  }
}

// Start the server
async function main() {
  const server = new WebSocketServer();
  
  try {
    await server.start();
  } catch (error) {
    logger.error('Server failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default WebSocketServer;