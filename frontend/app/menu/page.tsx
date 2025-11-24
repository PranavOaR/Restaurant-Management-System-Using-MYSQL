'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
          <Link href="/" className="text-2xl font-bold text-gray-800">
            🍽️ Menu
          </Link>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800">{cart.length} items</p>
            <p className="text-sm text-gray-600">Rs. {total.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category
                        ? 'bg-green-500 text-white font-semibold'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">Loading...</p>
                </div>
              ) : (
                menuItems.map((item) => (
                  <div key={item.SL} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{item.ItemName}</h3>
                      <span className="text-green-600 font-bold">Rs. {item.Price}</span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full mt-4 btn-primary"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8 sticky bottom-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>

                <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.SL} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.ItemName}</p>
                        <p className="text-sm text-gray-600">Rs. {item.Price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.SL, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.SL, parseInt(e.target.value))}
                          className="w-12 text-center input"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item.SL, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.SL)}
                          className="ml-2 btn-danger"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-800">
                          Rs. {(item.Price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-800">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-800">
                    <span>CGST (2.5%):</span>
                    <span>Rs. {cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-800">
                    <span>SGST (2.5%):</span>
                    <span>Rs. {sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-green-600">Rs. {total.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={placeOrder} className="w-full btn-primary text-lg py-3">
                  Place Order
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
