'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  SL: number;
  ItemName: string;
  Price: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          setSelectedCategory(data.data[0]);
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

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.SL === item.SL);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.SL === item.SL
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (sl: number) => {
    setCart(cart.filter((item) => item.SL !== sl));
  };

  const updateQuantity = (sl: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sl);
    } else {
      setCart(
        cart.map((item) =>
          item.SL === sl ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.Price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const orderItems = cart.map((item) => ({
      itemName: item.ItemName,
      price: item.Price,
      quantity: item.quantity,
      totalPrice: item.Price * item.quantity,
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: orderItems }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Order placed successfully!');
        setCart([]);
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };

  const subtotal = calculateTotal();
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const total = subtotal + cgst + sgst;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            🚀 OrderXpress
          </Link>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800">{cart.length} items</p>
            <p className="text-sm text-gray-600">Rs. {(subtotal + subtotal * 0.025 + subtotal * 0.025).toFixed(2)}</p>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Categories Sidebar */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow p-6 sticky top-20"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category, idx) => (
                  <motion.button
                    key={category}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </aside>

          {/* Main Content & Side Cart */}
          <main className="lg:col-span-4">
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="col-span-full text-center py-12"
                >
                  <p className="text-gray-600 text-lg">Loading menu items...</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.SL}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      className="card group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition">{item.ItemName}</h3>
                        <span className="text-green-600 font-bold text-lg">Rs. {item.Price}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item)}
                        className="w-full mt-4 btn-primary font-semibold"
                      >
                        + Add to Cart
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Right Side Cart Panel */}
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.aside
                initial={{ opacity: 0, x: 400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 400 }}
                transition={{ type: 'spring', damping: 25 }}
                className="lg:col-span-5 lg:fixed lg:right-8 lg:top-24 lg:w-80"
              >
                <motion.div
                  className="bg-white rounded-xl shadow-2xl p-6 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🛒</span>
                    <h2 className="text-2xl font-bold text-gray-800">Order Cart</h2>
                    <span className="ml-auto bg-red-500 text-white rounded-full px-3 py-1 font-bold text-sm">
                      {cart.length}
                    </span>
                  </div>

                  {/* Cart Items */}
                  <motion.div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <motion.div
                        key={item.SL}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{item.ItemName}</p>
                          <p className="text-xs text-gray-600">Rs. {item.Price}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.SL, item.quantity - 1)}
                            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded transition"
                          >
                            −
                          </motion.button>
                          <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.SL, item.quantity + 1)}
                            className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-600 font-bold rounded transition"
                          >
                            +
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.SL)}
                            className="ml-2 px-2 py-1 bg-gray-200 hover:bg-red-300 text-gray-700 hover:text-red-700 rounded font-bold transition"
                            title="Remove item"
                          >
                            ✕
                          </motion.button>
                        </div>
                        <div className="text-right ml-2 min-w-[60px]">
                          <p className="font-bold text-gray-800 text-sm">
                            Rs. {(item.Price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pricing Breakdown */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t-2 pt-4 space-y-2 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>CGST (2.5%):</span>
                      <span className="font-semibold">Rs. {(subtotal * 0.025).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>SGST (2.5%):</span>
                      <span className="font-semibold">Rs. {(subtotal * 0.025).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-green-600">Rs. {total.toFixed(2)}</span>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={placeOrder}
                    className="w-full btn-primary text-lg py-3 font-bold rounded-lg shadow-lg mb-2"
                  >
                    🎉 Place Order
                  </motion.button>
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition"
                    >
                      Back to Home
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
