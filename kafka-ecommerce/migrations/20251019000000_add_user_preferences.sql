-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(255) PRIMARY KEY,
    preferences JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster preference lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_updated_at ON user_preferences(updated_at);

-- Create product categories materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS product_categories AS
SELECT 
    data->>'product_name' as product_name,
    data->>'category' as category,
    AVG((data->>'retail_price')::numeric) as avg_price,
    AVG((data->>'rating')::numeric) as avg_rating,
    COUNT(*) as purchase_count
FROM transactions
GROUP BY data->>'product_name', data->>'category'
WITH DATA;

-- Create indices for product categories view
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_categories_product 
ON product_categories(product_name, category);

CREATE INDEX IF NOT EXISTS idx_product_categories_category 
ON product_categories(category);

-- Create function to update product categories
CREATE OR REPLACE FUNCTION refresh_product_categories()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_categories;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update product categories
DROP TRIGGER IF EXISTS refresh_product_categories_trigger ON transactions;
CREATE TRIGGER refresh_product_categories_trigger
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_product_categories();