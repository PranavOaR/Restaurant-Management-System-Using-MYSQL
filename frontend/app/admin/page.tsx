'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  OrderID: number;
  ItemName: string;
  Price: number;
  Quantity: number;
  TotalPrice: number;
  OrderTime: string;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const adminPassword = 'admin123';

  const handleLogin = () => {
    if (password === adminPassword) {
      setAuthenticated(true);
      fetchData();
    } else {
      alert('Invalid password');
      setPassword('');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      const ordersData = await ordersResponse.json();
      if (ordersData.success) {
        setOrders(ordersData.data);
      }

      // Fetch statistics
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics`);
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="input"
              autoFocus
            />
            <button onClick={handleLogin} className="w-full btn-secondary text-lg py-2">
              Login
            </button>
            <Link href="/" className="block text-center btn" style={{ backgroundColor: '#757575', color: 'white' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">👨‍💼 Admin Panel</h1>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </header>

      <main className="container py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{stats.totalOrders}</div>
              <p className="text-gray-600 mt-2">Total Orders</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">Rs. {stats.totalRevenue}</div>
              <p className="text-gray-600 mt-2">Total Revenue</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : 0}
              </div>
              <p className="text-gray-600 mt-2">Average Order Value</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">📋 Orders</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Item Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Total Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Order Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.OrderID}
                      className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                    >
                      <td className="px-6 py-3 text-sm text-gray-800 font-semibold">#{order.OrderID}</td>
                      <td className="px-6 py-3 text-sm text-gray-800">{order.ItemName}</td>
                      <td className="px-6 py-3 text-sm text-gray-800">Rs. {order.Price}</td>
                      <td className="px-6 py-3 text-sm text-gray-800">{order.Quantity}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-green-600">Rs. {order.TotalPrice}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(order.OrderTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
