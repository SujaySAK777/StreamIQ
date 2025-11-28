import io from 'socket.io-client';

// Use a Vite environment variable for the WebSocket URL so the frontend
// doesn't try to import server-side config (which pulls in Node-only
// packages like dotenv/path). Falls back to localhost:3001 for local dev.
const WS_URL = (import.meta as any).env?.VITE_WS_URL || 'http://localhost:3001';
const socket = io(WS_URL as string);

export interface Product {
    id: string;
    product_name: string;
    retail_price: number;
    category?: string;
    rating?: number;
}

export function trackProductView(product: Product) {
    socket.emit('product_view', {
        productId: product.id,
        productName: product.product_name,
        timestamp: new Date().toISOString(),
        userId: getCurrentUserId(),
        category: product.category
    });
}

export function trackPurchase(product: Product) {
    socket.emit('purchase', {
        productId: product.id,
        productName: product.product_name,
        price: product.retail_price,
        timestamp: new Date().toISOString(),
        userId: getCurrentUserId(),
        category: product.category
    });
}

// For demo purposes, generate a persistent user ID
function getCurrentUserId(): string {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = `user_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('user_id', userId);
    }
    return userId;
}