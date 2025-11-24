'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🍽️ Restaurant Management</h1>
          <nav className="flex gap-4">
            <Link href="/menu" className="btn-primary">
              Place Order
            </Link>
            <Link href="/admin" className="btn-secondary">
              Admin Panel
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-lg p-12 mb-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Restaurant</h2>
            <p className="text-lg text-gray-600 mb-8">
              Delicious food delivered to your doorstep. Browse our menu and place your order now!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link href="/menu" className="block">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-8 text-white hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-2">🛒</div>
                  <h3 className="text-2xl font-bold mb-2">Place an Order</h3>
                  <p>Browse menu and order your favorite dishes</p>
                </div>
              </Link>

              <Link href="/admin" className="block">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-2">👨‍💼</div>
                  <h3 className="text-2xl font-bold mb-2">Admin Panel</h3>
                  <p>View orders and manage restaurant</p>
                </div>
              </Link>
            </div>

            {/* Statistics */}
            {!loading && (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">{stats.totalOrders}</div>
                  <div className="text-gray-600">Total Orders</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">Rs. {stats.totalRevenue}</div>
                  <div className="text-gray-600">Total Revenue</div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-4xl mb-2">🍕</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fresh Food</h3>
              <p className="text-gray-600">Made with fresh ingredients daily</p>
            </div>

            <div className="card">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quick Service</h3>
              <p className="text-gray-600">Fast preparation and delivery</p>
            </div>

            <div className="card">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Affordable</h3>
              <p className="text-gray-600">Best prices in town</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container text-center">
          <p>&copy; 2025 Restaurant Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
