'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Settings, Pizza, Zap, DollarSign } from 'lucide-react';
import CardNav from './components/CardNav';
import BlurText from './components/BlurText';
import Silk from './components/Silk';
import { Button as MovingBorderButton } from './components/ui/moving-border';

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Mesh Background */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400 via-pink-300 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 via-purple-300 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-green-400 via-cyan-300 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Card Nav */}
        <CardNav
          items={navItems}
          baseColor="#FFFFFF"
          menuColor="#1F2937"
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
              className="text-6xl md:text-7xl font-playfair font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6"
            />
            <p className="text-2xl md:text-3xl font-montserrat font-semibold text-orange-600 mb-2">
              Fast, Fresh, Delicious!
            </p>
            <p className="text-lg text-gray-600 font-poppins">
              Order your favorite dishes now and enjoy premium quality food
            </p>
          </motion.div>

            {/* Main CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/menu">
                  <MovingBorderButton
                    borderRadius="1.75rem"
                    duration={3000}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 transition-all flex items-center gap-2"
                    borderClassName="bg-[radial-gradient(var(--orange-500)_40%,transparent_60%)]"
                  >
                    <ShoppingCart size={18} />
                    Order Food
                  </MovingBorderButton>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/admin">
                  <MovingBorderButton
                    borderRadius="1.75rem"
                    duration={3000}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2"
                    borderClassName="bg-[radial-gradient(var(--blue-500)_40%,transparent_60%)]"
                  >
                    <Settings size={18} />
                    Admin Panel
                  </MovingBorderButton>
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
                <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold font-poppins mb-2">Total Orders</p>
                        <div className="text-4xl font-bold font-playfair text-orange-600">{stats.totalOrders}</div>
                      </div>
                      <div className="bg-orange-100 rounded-full p-4 backdrop-blur-md">
                        <ShoppingCart size={32} className="text-orange-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold font-poppins mb-2">Total Revenue</p>
                        <div className="text-4xl font-bold font-playfair text-blue-600">Rs. {stats.totalRevenue}</div>
                      </div>
                      <div className="bg-blue-100 rounded-full p-4 backdrop-blur-md">
                        <DollarSign size={32} className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          {/* Features Grid */}
          <div className="mb-16" id="features">
            <h3 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 text-center mb-12">Why Choose OrderXpress?</h3>
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
                    className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-30 hover:border-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                      <IconComponent size={32} className="text-white" />
                    </div>
                    <h4 className="text-2xl font-playfair font-bold text-gray-800 mb-3">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed font-poppins">{feature.desc}</p>
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
            className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 rounded-3xl p-12 text-center backdrop-blur-sm border border-orange-300 border-opacity-50 shadow-2xl"
          >
            <h3 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">Ready to Order?</h3>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto font-poppins">
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
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-95 text-white py-8 mt-16 relative z-20">
        <div className="container text-center font-poppins">
          <p>&copy; 2025 OrderXpress. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
