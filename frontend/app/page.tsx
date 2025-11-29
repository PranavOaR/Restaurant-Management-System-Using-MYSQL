'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Settings, Pizza, Zap, DollarSign } from 'lucide-react';
import CardNav from './components/CardNav';
import BlurText from './components/BlurText';
import Silk from './components/Silk';
import { GradientButton } from './components/ui/gradient-button';

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

  const navItems = [
    {
      label: "Menu",
      bgColor: "#10B981",
      textColor: "#fff",
      links: [
        { label: "Browse Items", href: "/menu", ariaLabel: "Browse Menu Items" },
        { label: "Categories", href: "/menu", ariaLabel: "Food Categories" }
      ]
    },
    {
      label: "Admin",
      bgColor: "#3B82F6",
      textColor: "#fff",
      links: [
        { label: "Dashboard", href: "/admin", ariaLabel: "Admin Dashboard" },
        { label: "Manage Menu", href: "/admin", ariaLabel: "Manage Menu Items" }
      ]
    },
    {
      label: "Info",
      bgColor: "#F59E0B",
      textColor: "#fff",
      links: [
        { label: "About Us", href: "#about", ariaLabel: "About OrderXpress" },
        { label: "Contact", href: "#contact", ariaLabel: "Contact Us" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Silk Background Animation */}
      <div className="absolute inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Card Nav */}
        <CardNav
          items={navItems}
          baseColor="#1F2937"
          menuColor="#fff"
          buttonBgColor="#FF6B35"
          buttonTextColor="#fff"
          ease="power3.out"
        />

      {/* Main Content */}
      <main className="container py-20 pt-40">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <BlurText
              text="Welcome to OrderXpress"
              delay={80}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            />
            <p className="text-xl md:text-2xl text-gray-300 mb-2">
              Fast, Fresh, Delicious!
            </p>
            <p className="text-lg text-gray-400">
              Order your favorite dishes now and enjoy premium quality food
            </p>
          </motion.div>

            {/* Main CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/menu" className="block">
                  <GradientButton asChild className="w-full h-auto flex flex-col items-center justify-center px-12 py-12 rounded-3xl">
                    <div className="w-full flex flex-col items-center justify-center">
                      <div className="bg-white bg-opacity-20 rounded-full p-6 backdrop-blur-md mb-6">
                        <ShoppingCart size={64} className="text-white" />
                      </div>
                      <h3 className="text-3xl font-bold mb-3 text-white">Order Food</h3>
                      <p className="text-lg text-white leading-relaxed">Browse our delicious menu and place your order in seconds. Fast checkout, fresher meals.</p>
                    </div>
                  </GradientButton>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/admin" className="block">
                  <GradientButton variant="variant" asChild className="w-full h-auto flex flex-col items-center justify-center px-12 py-12 rounded-3xl">
                    <div className="w-full flex flex-col items-center justify-center">
                      <div className="bg-white bg-opacity-20 rounded-full p-6 backdrop-blur-md mb-6">
                        <Settings size={64} className="text-white" />
                      </div>
                      <h3 className="text-3xl font-bold mb-3 text-white">Admin Panel</h3>
                      <p className="text-lg text-white leading-relaxed">Manage menu items, view orders, and track real-time statistics. Full control in one place.</p>
                    </div>
                  </GradientButton>
                </Link>
              </motion.div>
            </div>

            {/* Statistics Section */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-20"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-2">Total Orders</p>
                        <div className="text-4xl font-bold text-green-400">{stats.totalOrders}</div>
                      </div>
                      <div className="bg-green-500 bg-opacity-20 rounded-full p-4 backdrop-blur-md">
                        <ShoppingCart size={32} className="text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-2">Total Revenue</p>
                        <div className="text-4xl font-bold text-blue-400">Rs. {stats.totalRevenue}</div>
                      </div>
                      <div className="bg-blue-500 bg-opacity-20 rounded-full p-4 backdrop-blur-md">
                        <DollarSign size={32} className="text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          {/* Features Grid */}
          <div className="mb-16" id="features">
            <h3 className="text-3xl font-bold text-white text-center mb-12">Why Choose OrderXpress?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Pizza, title: 'Premium Quality', desc: 'Handpicked ingredients sourced fresh daily for the best taste and nutrition' },
                { icon: Zap, title: 'Lightning Fast', desc: 'Get your order prepared and delivered in record time without compromising quality' },
                { icon: DollarSign, title: 'Best Prices', desc: 'Competitive pricing with regular offers and loyalty rewards for our valued customers' }
              ].map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ y: -8 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm hover:shadow-xl"
                  >
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                      <IconComponent size={32} className="text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-12 text-center backdrop-blur-sm border border-orange-300 border-opacity-30 shadow-2xl"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Order?</h3>
            <p className="text-lg text-orange-50 mb-8 max-w-2xl mx-auto">
              Start exploring our delicious menu and enjoy premium food delivery right to your doorstep.
            </p>
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 px-10 py-3 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300 hover:bg-orange-50"
              >
                Start Ordering Now
              </motion.button>
            </Link>
          </motion.div>
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
