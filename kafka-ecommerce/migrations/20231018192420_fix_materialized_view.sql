-- Drop existing materialized view and its functions
DROP MATERIALIZED VIEW IF EXISTS transaction_stats;

-- Create a buffered transaction table for aggregation
CREATE TABLE IF NOT EXISTS transaction_buffer (
    product_name text,
    retail_price numeric,
    inserted_at timestamp DEFAULT current_timestamp
);

-- Create index on transaction_buffer
CREATE INDEX IF NOT EXISTS transaction_buffer_product_name_idx ON transaction_buffer(product_name);

-- Create the materialized view with proper indexing
CREATE MATERIALIZED VIEW transaction_stats AS
SELECT 
    product_name,
    COUNT(*) as sale_count,
    SUM(retail_price) as total_revenue,
    AVG(retail_price) as avg_price,
    MIN(retail_price) as min_price,
    MAX(retail_price) as max_price
FROM transaction_buffer
GROUP BY product_name;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX transaction_stats_product_name_unique ON transaction_stats(product_name);

-- Create function to update buffer
CREATE OR REPLACE FUNCTION update_transaction_buffer()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO transaction_buffer (product_name, retail_price)
    VALUES (NEW.data->>'product_name', (NEW.data->>'retail_price')::numeric);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update buffer
DROP TRIGGER IF EXISTS update_transaction_buffer_trigger ON transactions;
CREATE TRIGGER update_transaction_buffer_trigger
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_transaction_buffer();