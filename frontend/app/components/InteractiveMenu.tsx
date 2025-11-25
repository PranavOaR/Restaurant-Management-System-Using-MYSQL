'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart, X, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';

interface MenuItem {
  SL: number;
  ItemName: string;
  Price: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface InteractiveMenuProps {
  items?: MenuItem[];
}

export function InteractiveMenu({ items = [] }: InteractiveMenuProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(!items.length);

  useEffect(() => {
    if (!items.length) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/beverages`);
          const data = await response.json();
          if (data.success) {
            // Format items to match MenuItem interface
            const formatted = data.data.map((item: any) => ({
              SL: item.SL,
              ItemName: item.ItemName,
              Price: item.Price,
            }));
            // Update state with items
          }
        } catch (error) {
          console.error('Error fetching menu items:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchItems();
    } else {
      setLoading(false);
    }
  }, [items]);

  const addToCart = (item: MenuItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.SL === item.SL);
      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.SL === item.SL
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.SL !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.SL === itemId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const totalPrice = subtotal + cgst + sgst;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading menu items...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex gap-6">
        {/* Menu Items */}
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.SL}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'group p-4 rounded-xl',
                'bg-white dark:bg-zinc-900',
                'border border-gray-200 dark:border-zinc-800',
                'hover:border-orange-300 dark:hover:border-orange-700',
                'hover:shadow-lg transition-all duration-200'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.ItemName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      Rs. {item.Price}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => addToCart(item)}
                  className="gap-1.5 ml-4"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'w-80 flex flex-col',
            'p-4 rounded-xl',
            'bg-white dark:bg-zinc-900',
            'border border-gray-200 dark:border-zinc-800',
            'sticky top-4',
            'max-h-[calc(100vh-100px)]'
          )}
        >
          {/* Cart Header */}
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              🛒 Order Summary ({totalItems})
            </h2>
          </div>

          {/* Cart Items */}
          <motion.div
            className={cn(
              'flex-1 overflow-y-auto',
              'min-h-0',
              '-mx-4 px-4',
              'space-y-2'
            )}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-40 text-gray-500 text-sm"
                >
                  Your cart is empty
                </motion.div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.SL}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ opacity: { duration: 0.2 }, layout: { duration: 0.2 } }}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg',
                      'bg-gray-50 dark:bg-zinc-800/50',
                      'hover:bg-gray-100 dark:hover:bg-zinc-800',
                      'transition-colors'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.ItemName}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeFromCart(item.SL)}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </motion.button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateQuantity(item.SL, -1)}
                            className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-zinc-700"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <motion.span layout className="text-xs text-gray-600 dark:text-gray-400 w-6 text-center font-medium">
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateQuantity(item.SL, 1)}
                            className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-zinc-700"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>
                        <motion.span layout className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                          Rs. {(item.Price * item.quantity).toFixed(2)}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Pricing Summary */}
          <motion.div
            layout
            className={cn(
              'pt-3 mt-3',
              'border-t border-gray-200 dark:border-zinc-800',
              'bg-white dark:bg-zinc-900',
              'space-y-2'
            )}
          >
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Subtotal:</span>
              <motion.span layout className="font-medium">
                Rs. {subtotal.toFixed(2)}
              </motion.span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>CGST (2.5%):</span>
              <motion.span layout className="font-medium">
                Rs. {cgst.toFixed(2)}
              </motion.span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>SGST (2.5%):</span>
              <motion.span layout className="font-medium">
                Rs. {sgst.toFixed(2)}
              </motion.span>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total:</span>
              <motion.span layout className="text-sm font-bold text-orange-600 dark:text-orange-400">
                <NumberFlow value={totalPrice} />
              </motion.span>
            </div>

            <Button size="sm" variant="default" className="w-full gap-2 mt-3">
              <CreditCard className="w-4 h-4" />
              Checkout
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export type { MenuItem, CartItem };
