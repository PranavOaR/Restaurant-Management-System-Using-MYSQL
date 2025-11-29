'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Edit2 } from 'lucide-react';

interface Order {
  OrderID: number;
  ItemName: string;
  Price: number;
  Quantity: number;
  TotalPrice: number;
  OrderTime: string;
}

interface MenuItem {
  SL: number;
  ItemName: string;
  Price: number;
}

interface FormData {
  itemName: string;
  price: string;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  
  // Menu management states
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<FormData>({ itemName: '', price: '' });
  const [menuLoading, setMenuLoading] = useState(false);

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

      // Fetch categories
      const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const categoriesData = await categoriesResponse.json();
      if (categoriesData.success) {
        setCategories(categoriesData.data);
        setSelectedCategory(categoriesData.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (category: string) => {
    setMenuLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${category}`);
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchMenuItems(selectedCategory);
    }
  }, [selectedCategory]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.price) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          itemName: formData.itemName,
          price: parseInt(formData.price)
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Item added successfully!');
        setFormData({ itemName: '', price: '' });
        setShowAddForm(false);
        fetchMenuItems(selectedCategory);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingItem || !formData.itemName || !formData.price) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          itemId: editingItem.SL,
          itemName: formData.itemName,
          price: parseInt(formData.price)
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Item updated successfully!');
        setFormData({ itemName: '', price: '' });
        setEditingItem(null);
        fetchMenuItems(selectedCategory);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          itemId: itemId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Item deleted successfully!');
        fetchMenuItems(selectedCategory);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const startEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ itemName: item.ItemName, price: item.Price.toString() });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({ itemName: '', price: '' });
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

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container flex gap-4 py-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 font-semibold rounded-lg transition ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Orders & Stats
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 font-semibold rounded-lg transition ${
              activeTab === 'menu'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🍽️ Menu Management
          </button>
        </div>
      </div>

      <main className="container py-8">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
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
          </>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <>
            {/* Category Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Category</h2>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingItem) && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingItem ? '✏️ Edit Item' : '➕ Add New Item'}
                </h2>
                <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Item Name</label>
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      placeholder="Enter item name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Price (Rs.)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button
                      type="button"
                      onClick={editingItem ? cancelEdit : () => setShowAddForm(false)}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Add Item Button */}
            {!showAddForm && !editingItem && (
              <div className="mb-8">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <Plus size={20} />
                  Add New Item
                </button>
              </div>
            )}

            {/* Menu Items List */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items
                </h2>
              </div>

              {menuLoading ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600">Loading items...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600">No items in this category</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Item ID</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item, index) => (
                        <tr
                          key={item.SL}
                          className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                        >
                          <td className="px-6 py-3 text-sm text-gray-800 font-semibold">#{item.SL}</td>
                          <td className="px-6 py-3 text-sm text-gray-800">{item.ItemName}</td>
                          <td className="px-6 py-3 text-sm text-gray-800">Rs. {item.Price}</td>
                          <td className="px-6 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditItem(item)}
                                className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                              >
                                <Edit2 size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.SL)}
                                className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
