-- Create tables for e-commerce data streaming
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_topic ON transactions(topic);
CREATE INDEX IF NOT EXISTS idx_transactions_processed_at ON transactions(processed_at);
CREATE INDEX IF NOT EXISTS idx_transactions_data_category ON transactions((data->>'category'));

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS transaction_stats AS
SELECT
    date_trunc('hour', processed_at) as hour,
    topic,
    COUNT(*) as total_count,
    SUM((data->>'amount')::float) as total_amount,
    data->>'category' as category
FROM transactions
GROUP BY 1, 2, 5
WITH DATA;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_transaction_stats_hour ON transaction_stats(hour);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_transaction_stats()
RETURNS trigger AS $$
BEGIN
    -- NOTE: Do not call REFRESH MATERIALIZED VIEW from inside a trigger.
    -- Triggers should not perform long-running DDL operations. Instead,
    -- a background worker/process will refresh the materialized view.
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_transaction_stats_trigger
AFTER INSERT ON transactions
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_transaction_stats();