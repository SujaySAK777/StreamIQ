import { Pool } from 'pg';
import logger from './utils/logger';
import { config } from './config';

const pool = new Pool(config.postgres);

async function refreshMaterializedView(retries = 3, backoffMs = 500) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Refresh all materialized views concurrently
    await Promise.all([
      client.query('REFRESH MATERIALIZED VIEW CONCURRENTLY transaction_stats'),
      client.query('REFRESH MATERIALIZED VIEW CONCURRENTLY product_categories'),
      client.query('REFRESH MATERIALIZED VIEW CONCURRENTLY user_product_preferences')
    ]);
    await client.query('COMMIT');
    logger.info('Refreshed all materialized views successfully');
  } catch (err: any) {
    await client.query('ROLLBACK');
    logger.error('Failed to refresh materialized views:', err.message || err);
    if (retries > 0) {
      const wait = backoffMs * 2;
      logger.info(`Retrying refresh in ${wait}ms (${retries - 1} retries left)`);
      await new Promise((res) => setTimeout(res, wait));
      return refreshMaterializedView(retries - 1, wait);
    }
  } finally {
    client.release();
  }
}

export function startRefreshWorker(intervalMs = 5000) {
  logger.info(`Starting materialized view refresh worker (interval=${intervalMs}ms)`);
  const handle = setInterval(async () => {
    try {
      await refreshMaterializedView();
    } catch (err) {
      // already logged in refreshMaterializedView
    }
  }, intervalMs);

  return () => clearInterval(handle);
}

// If invoked directly, start the worker
if (require.main === module) {
  startRefreshWorker(5000);
}
