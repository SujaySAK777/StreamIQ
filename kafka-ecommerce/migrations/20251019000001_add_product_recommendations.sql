-- Create product views tracking table
CREATE TABLE IF NOT EXISTS product_views (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for product views
CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product_name ON product_views(product_name);
CREATE INDEX IF NOT EXISTS idx_product_views_timestamp ON product_views(timestamp);

-- Create view for user preferences
CREATE MATERIALIZED VIEW IF NOT EXISTS user_product_preferences AS
WITH user_interactions AS (
    -- Combine views and purchases with different weights
    SELECT user_id, product_name, category, 1 as weight, timestamp
    FROM product_views
    UNION ALL
    SELECT 
        data->>'user_id' as user_id,
        data->>'product_name' as product_name,
        data->>'category' as category,
        3 as weight,
        processed_at as timestamp
    FROM transactions
    WHERE data->>'user_id' IS NOT NULL
)
SELECT 
    user_id,
    category,
    COUNT(*) * AVG(weight) as category_score,
    array_agg(DISTINCT product_name) as viewed_products
FROM user_interactions
GROUP BY user_id, category
WITH DATA;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_product_preferences_user_category 
ON user_product_preferences(user_id, category);

-- Create function to refresh user preferences view
CREATE OR REPLACE FUNCTION refresh_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_product_preferences;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh user preferences
DROP TRIGGER IF EXISTS refresh_user_preferences_on_view ON product_views;
CREATE TRIGGER refresh_user_preferences_on_view
    AFTER INSERT ON product_views
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_user_preferences();

DROP TRIGGER IF EXISTS refresh_user_preferences_on_purchase ON transactions;
CREATE TRIGGER refresh_user_preferences_on_purchase
    AFTER INSERT ON transactions
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_user_preferences();