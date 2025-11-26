'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { InteractiveMenu, type MenuItem, type CartItem } from '../components/InteractiveMenu';

export default function MenuPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('beverages');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          setSelectedCategory(data.data[0] || 'beverages');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!selectedCategory) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menu/${selectedCategory}`
        );
        const data = await response.json();
        if (data.success) {
          setMenuItems(data.data);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('🛒 Your cart is empty! Add items before checkout.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        itemName: item.ItemName,
        price: item.Price,
        quantity: item.quantity,
        totalPrice: item.Price * item.quantity,
      }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: orderItems,
            totalAmount:
              cart.reduce((sum, item) => sum + item.Price * item.quantity, 0) * 1.05,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('✅ Order placed successfully! Your food is being prepared.');
        setCart([]);
      } else {
        alert(`❌ Failed to place order: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('❌ Error placing order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-20">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            🚀 OrderXpress
          </Link>
          <nav className="flex gap-4">
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium">
              Order Food
            </Link>
            <Link href="/admin" className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium">
              Admin Panel
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Select Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-orange-500'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Interactive Menu */}
        {loading ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-400">Loading menu items...</p>
          </motion.div>
        ) : (
          <InteractiveMenu
            items={menuItems}
            cart={cart}
            setCart={setCart}
            onCheckout={placeOrder}
            checkoutLoading={checkoutLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container text-center">
          <p>&copy; 2025 OrderXpress Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
