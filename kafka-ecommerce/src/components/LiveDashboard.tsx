import React, { useEffect, useState } from 'react';
import io, { Socket as IOSocket } from 'socket.io-client';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Transaction {
  topic: string;
  data: any;
  timestamp: string;
}

interface Stats {
  totalSales: {
    count: number;
    total: number;
  };
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
  hourlyTrends: Array<{
    hour: string;
    count: number;
  }>;
}

const LiveDashboard: React.FC = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socketClient = io('http://localhost:3001');
    setSocket(socketClient);

    // Fetch initial data
    fetchTransactions();
    fetchStats();

    // Clean up on unmount
    return () => {
      socketClient.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for new transactions
    socket.on('newTransaction', (transaction: Transaction) => {
      setTransactions(prev => [transaction, ...prev].slice(0, 100));
      // Refresh stats after new transaction
      fetchStats();
    });
  }, [socket]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Live E-commerce Dashboard</h1>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Sales</h2>
          <p className="text-2xl">${stats.totalSales.total.toFixed(2)}</p>
          <p className="text-gray-600">{stats.totalSales.count} transactions</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Hourly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.hourlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Live Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className={index === 0 ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.data.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${transaction.data.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.data.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;