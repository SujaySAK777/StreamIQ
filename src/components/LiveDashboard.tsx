import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TransactionData {
  timestamp: string;
  amount: number;
  product_name: string;
}

interface ChartData {
  time: string;
  amount: number;
}

export function LiveDashboard() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const WS_URL = (import.meta as any).env?.VITE_WS_URL || 'http://localhost:3001';
    const socket = io(WS_URL as string);

    // Buffer incoming transactions to avoid overwhelming React with very
    // high-frequency updates coming from the producer/consumer pipeline.
    const queue: TransactionData[] = [];
    const flushIntervalMs = 500;
    const maxPerFlush = 20;

    const flush = () => {
      if (queue.length === 0) return;
      const batch: TransactionData[] = [];
      for (let i = 0; i < maxPerFlush && queue.length > 0; i++) {
        batch.push(queue.shift()!);
      }

      setTransactions(prev => {
        const newTransactions = [...prev, ...batch].slice(-50);

        // Update chart data (coerce amounts to numbers)
        const newChartData = newTransactions.reduce((acc: ChartData[], curr) => {
          const time = new Date(curr.timestamp).toLocaleTimeString();
          const existing = acc.find(item => item.time === time);
          const amt = Number((curr as any).amount) || 0;

          if (existing) {
            existing.amount += amt;
          } else {
            acc.push({ time, amount: amt });
          }

          return acc;
        }, [] as ChartData[]);

        setChartData(newChartData.slice(-20));
        return newTransactions;
      });
    };

    const timer = setInterval(flush, flushIntervalMs);

    socket.on('transaction', (transaction: any) => {
      try {
        // Normalize amount field from multiple possible names and coerce to number
        const amt = Number(transaction.amount ?? transaction.retail_price ?? transaction.price ?? transaction.retailPrice ?? 0) || 0;

        const normalized: TransactionData = {
          product_name: transaction.product_name || transaction.productName || 'Unknown',
          timestamp: transaction.timestamp || new Date().toISOString(),
          amount: amt,
        };

        queue.push(normalized);
        if (queue.length > 1000) queue.splice(0, queue.length - 1000);
      } catch (e) {
        // ignore malformed payloads
      }
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      clearInterval(timer);
      try { socket.disconnect(); } catch (e) { /* ignore */ }
    };
  }, []);

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary-content">Live Transaction Dashboard</h2>
      
      <div className="h-[400px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-content">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.slice(-5).reverse().map((transaction, index) => {
              const amt = Number((transaction as any).amount) || 0;
              return (
              <div 
                key={index} 
                className="bg-base-100 p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-primary-content">{transaction.product_name}</p>
                  <p className="text-sm text-base-content">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="text-lg font-bold text-accent">
                  ${amt.toFixed(2)}
                </p>
              </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}