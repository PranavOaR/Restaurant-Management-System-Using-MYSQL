'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SilkBackground } from './components/SilkBackground';

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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Silk Background Animation */}
      <SilkBackground />

      {/* Content Overlay */}
      <div className="relative z-10">
      {/* Header */}
      <header className="bg-white bg-opacity-95 shadow-sm relative z-20">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            🚀 OrderXpress
          </h1>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white bg-opacity-95 rounded-lg shadow-2xl p-12 mb-8 text-center backdrop-blur-sm"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to OrderXpress</h2>
            <p className="text-lg text-gray-600 mb-8">
              Fast, Fresh, Delicious! Order your favorite dishes now!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/menu" className="block">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-8 text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-5xl mb-4">🛒</div>
                    <h3 className="text-2xl font-bold mb-2">Order Food</h3>
                    <p className="text-lg">Browse menu and place your order</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/admin" className="block">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-5xl mb-4">👨‍💼</div>
                    <h3 className="text-2xl font-bold mb-2">Admin Panel</h3>
                    <p className="text-lg">View orders and statistics</p>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Statistics */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-8"
              >
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">{stats.totalOrders}</div>
                  <div className="text-gray-600">Total Orders</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">Rs. {stats.totalRevenue}</div>
                  <div className="text-gray-600">Total Revenue</div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🍕', title: 'Fresh Food', desc: 'Made with fresh ingredients' },
              { icon: '⚡', title: 'Quick Service', desc: 'Fast preparation' },
              { icon: '💰', title: 'Affordable', desc: 'Best prices in town' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="card bg-white bg-opacity-90 backdrop-blur-sm"
              >
                <div className="text-4xl mb-2">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 bg-opacity-95 text-white py-8 mt-16 relative z-20">
        <div className="container text-center">
          <p>&copy; 2025 Restaurant Management System. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
