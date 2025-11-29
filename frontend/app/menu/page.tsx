'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Sliders } from 'lucide-react';
import { InteractiveMenu, type MenuItem, type CartItem } from '../components/InteractiveMenu';

export default function MenuPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('beverages');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

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
          const itemsWithCategory = data.data.map((item: any) => ({
            ...item,
            category: selectedCategory,
          }));
          setMenuItems(itemsWithCategory);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  // Filter items based on search and price
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.ItemName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = item.Price >= priceRange[0] && item.Price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });
  }, [menuItems, searchQuery, priceRange]);

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Add items before checkout.');
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
        // Show success modal instead of alert
        setCart([]);
        // Dispatch custom event to show success modal
        window.dispatchEvent(new CustomEvent('orderSuccess'));
      } else {
        alert(`Failed to place order: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
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
            OrderXpress
          </Link>
          <nav className="flex gap-4">
            <Link href="/menu" className="px-4 py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition">
              Order Food
            </Link>
            <Link href="/admin" className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition">
              Admin Panel
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Filter Toggle and Price Range */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
            >
              <Sliders className="w-4 h-4" />
              Filters
            </button>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <span className="text-sm font-medium">Price:</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-24"
                />
                <span className="text-sm">Rs. {priceRange[0]}</span>
                <span className="text-sm">-</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-24"
                />
                <span className="text-sm">Rs. {priceRange[1]}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-dm-sans font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Select Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
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

        {/* Results Info */}
        {searchQuery || (priceRange[0] !== 0 || priceRange[1] !== 1000) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-sm text-gray-600 dark:text-gray-400"
          >
            Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          </motion.div>
        ) : null}

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
            items={filteredItems}
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

      {/* Order Success Modal */}
      <OrderSuccessModal />
    </div>
  );
}

// Success Modal Component
function OrderSuccessModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleSuccess = () => {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    };

    window.addEventListener('orderSuccess', handleSuccess);
    return () => window.removeEventListener('orderSuccess', handleSuccess);
  }, []);

  if (!showModal) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    >
      <motion.div
        className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center max-w-md shadow-2xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <motion.div
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-dm-sans font-bold text-gray-900 dark:text-white mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your delicious food is being prepared. Thank you for ordering!
        </p>
      </motion.div>
    </motion.div>
  );
}

