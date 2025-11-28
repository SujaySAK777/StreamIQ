import { Pool } from 'pg';
import { config } from '../config';
import logger from './logger';

interface UserPreference {
    userId: string;
    categories: { [key: string]: number };
    priceRange: {
        min: number;
        max: number;
        avg: number;
    };
    viewedProducts: string[];
}

export class RecommendationEngine {
    private db: Pool;
    private userPreferences: Map<string, UserPreference> = new Map();

    constructor() {
        this.db = new Pool(config.postgres);
    }

    async updateUserPreference(userId: string, product: any, action: 'view' | 'purchase') {
        let preference = this.userPreferences.get(userId) || {
            userId,
            categories: {},
            priceRange: { min: Infinity, max: -Infinity, avg: 0 },
            viewedProducts: []
        };

        // Update category preference
        if (product.category) {
            preference.categories[product.category] = (preference.categories[product.category] || 0) + 
                (action === 'purchase' ? 2 : 1); // Purchases weight more than views
        }

        // Update price range preference
        const price = parseFloat(product.retail_price);
        if (!isNaN(price)) {
            preference.priceRange.min = Math.min(preference.priceRange.min, price);
            preference.priceRange.max = Math.max(preference.priceRange.max, price);
            const totalPrices = preference.viewedProducts.length * preference.priceRange.avg + price;
            preference.priceRange.avg = totalPrices / (preference.viewedProducts.length + 1);
        }

        // Track viewed products
        if (!preference.viewedProducts.includes(product.product_name)) {
            preference.viewedProducts.push(product.product_name);
        }

        this.userPreferences.set(userId, preference);
        await this.savePreferences(userId, preference);
    }

    async getRecommendations(userId: string, limit: number = 10): Promise<any[]> {
        const preference = this.userPreferences.get(userId);
        if (!preference) {
            return this.getDefaultRecommendations(limit);
        }

        // Get preferred categories
        const categories = Object.entries(preference.categories)
            .sort(([,a], [,b]) => b - a)
            .map(([category]) => category)
            .slice(0, 3);

        // Get products in similar price range and categories
        const query = `
            SELECT DISTINCT ON (t.product_name) t.*
            FROM transactions t
            WHERE t.retail_price BETWEEN $1 AND $2
            AND t.category = ANY($3)
            AND t.product_name != ALL($4)
            ORDER BY t.product_name, t.timestamp DESC
            LIMIT $5
        `;

        const priceRange = preference.priceRange;
        const minPrice = Math.max(0, priceRange.avg * 0.7);
        const maxPrice = priceRange.avg * 1.3;

        try {
            const result = await this.db.query(query, [
                minPrice,
                maxPrice,
                categories,
                preference.viewedProducts,
                limit
            ]);
            return result.rows;
        } catch (error) {
            logger.error('Error getting recommendations:', error);
            return this.getDefaultRecommendations(limit);
        }
    }

    private async getDefaultRecommendations(limit: number): Promise<any[]> {
        try {
            const result = await this.db.query(`
                SELECT DISTINCT ON (product_name) *
                FROM transactions
                ORDER BY product_name, rating DESC
                LIMIT $1
            `, [limit]);
            return result.rows;
        } catch (error) {
            logger.error('Error getting default recommendations:', error);
            return [];
        }
    }

    private async savePreferences(userId: string, preference: UserPreference): Promise<void> {
        try {
            await this.db.query(`
                INSERT INTO user_preferences (user_id, preferences)
                VALUES ($1, $2)
                ON CONFLICT (user_id)
                DO UPDATE SET preferences = $2, updated_at = NOW()
            `, [userId, JSON.stringify(preference)]);
        } catch (error) {
            logger.error('Error saving user preferences:', error);
        }
    }
}