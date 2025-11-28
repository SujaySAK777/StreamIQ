-- Drop existing materialized view and its functions
DROP MATERIALIZED VIEW IF EXISTS transaction_stats;

-- Create a new function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_transaction_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Try to refresh the view, if it's already being refreshed, skip this attempt
    BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY transaction_stats;
    EXCEPTION WHEN lock_not_available THEN
        -- If we hit a concurrent refresh, just skip it
        -- The next transaction will trigger another refresh attempt
        RAISE NOTICE 'Skipping materialized view refresh - lock not available';
    END;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the materialized view with proper indexing
CREATE MATERIALIZED VIEW transaction_stats AS
SELECT 
    (data->>'product_name') as product_name,
    COUNT(*) as sale_count,
    SUM((data->>'retail_price')::numeric) as total_revenue,
    AVG((data->>'retail_price')::numeric) as avg_price,
    MIN((data->>'retail_price')::numeric) as min_price,
    MAX((data->>'retail_price')::numeric) as max_price
FROM transactions
WHERE topic = 'ecommerce-transactions'
GROUP BY (data->>'product_name');

-- Create index on product_name for better performance
CREATE INDEX transaction_stats_product_name_idx ON transaction_stats(product_name);

-- Create a trigger to refresh the view
DROP TRIGGER IF EXISTS refresh_transaction_stats_trigger ON transactions;
CREATE TRIGGER refresh_transaction_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_transaction_stats();

-- Initial refresh
REFRESH MATERIALIZED VIEW transaction_stats;