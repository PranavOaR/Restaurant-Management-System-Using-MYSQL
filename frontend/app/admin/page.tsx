'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Edit2, BarChart3, ShoppingCart, Search, Calendar } from 'lucide-react';

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
  const [menuSearch, setMenuSearch] = useState('');
  
  // Order filter states
  const [dateFilter, setDateFilter] = useState('');

  const adminPassword = 'admin123';

  // Filter orders by date
  const filteredOrders = useMemo(() => {
    if (!dateFilter) return orders;
    const filterDate = new Date(dateFilter).toDateString();
    return orders.filter(order => new Date(order.OrderTime).toDateString() === filterDate);
  }, [orders, dateFilter]);

  // Filter menu items by search across all categories
  const filteredMenuItems = useMemo(() => {
    if (!menuSearch) return menuItems;
    return menuItems.filter(item => 
      item.ItemName.toLowerCase().includes(menuSearch.toLowerCase())
    );
  }, [menuItems, menuSearch]);

  const handleLogin = () => {
    if (password === adminPassword) {
      setAuthenticated(true);
      fetchData();
    } else {
      alert('Invalid password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
    setActiveTab('orders');
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
        if (categoriesData.data.length > 0) {
          setSelectedCategory(categoriesData.data[0]);
        }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-dm-sans font-bold text-gray-800 mb-6 text-center">Admin Portal</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              autoFocus
            />
            <button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-dm-sans font-semibold py-2.5 rounded-xl transition duration-200"
            >
              Login
            </button>
            <Link 
              href="/" 
              className="block text-center bg-gray-600 hover:bg-gray-700 text-white font-dm-sans font-semibold py-2.5 rounded-xl transition duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-dm-sans font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 font-inter">Manage your restaurant operations and menu</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-dm-sans font-semibold px-6 py-2.5 rounded-xl transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-dm-sans font-semibold rounded-t-xl transition duration-200 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Orders & Stats
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 font-dm-sans font-semibold rounded-t-xl transition duration-200 flex items-center gap-2 ${
              activeTab === 'menu'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Menu Management
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Orders & Stats Tab */}
        {activeTab === 'orders' && !loading && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-inter text-sm">Total Orders</p>
                    <p className="text-4xl font-dm-sans font-bold text-green-700 mt-2">
                      {stats.totalOrders || 0}
                    </p>
                  </div>
                  <ShoppingCart className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-inter text-sm">Total Revenue</p>
                    <p className="text-4xl font-dm-sans font-bold text-blue-700 mt-2">
                      Rs. {stats.totalRevenue || 0}
                    </p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-inter text-sm">Avg Order Value</p>
                    <p className="text-4xl font-dm-sans font-bold text-purple-700 mt-2">
                      Rs. {stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0}
                    </p>
                  </div>
                  <Trash2 className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Date Filter for Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <label className="font-dm-sans font-semibold text-gray-700">Filter by Date:</label>
                </div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-dm-sans font-semibold rounded-xl transition duration-200"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              {dateFilter && (
                <p className="mt-3 text-sm font-inter text-gray-600">
                  Showing {filteredOrders.length} order(s) from {new Date(dateFilter).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-dm-sans font-bold text-gray-800">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Order ID</th>
                      <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Item Name</th>
                      <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Price</th>
                      <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Quantity</th>
                      <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Total Price</th>
                      <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Order Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-3 font-inter text-gray-800 font-semibold">#{order.OrderID}</td>
                        <td className="px-6 py-3 font-inter text-gray-800">{order.ItemName}</td>
                        <td className="px-6 py-3 font-inter text-gray-800">Rs. {order.Price}</td>
                        <td className="px-6 py-3 font-inter text-gray-800">{order.Quantity}</td>
                        <td className="px-6 py-3 font-inter text-gray-800 font-semibold text-green-600">Rs. {order.TotalPrice}</td>
                        <td className="px-6 py-3 font-inter text-gray-600 text-sm">{new Date(order.OrderTime).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && !loading && (
          <div className="space-y-8">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <label className="block font-dm-sans font-semibold text-gray-700 mb-3">Select Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
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
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-dm-sans font-bold text-gray-800 mb-6 flex items-center gap-2">
                  {editingItem ? (
                    <>
                      <Edit2 className="w-6 h-6" />
                      Edit Item
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Add New Item
                    </>
                  )}
                </h2>
                <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
                  <div>
                    <label className="block font-dm-sans font-semibold text-gray-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      placeholder="Enter item name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                    />
                  </div>
                  <div>
                    <label className="block font-dm-sans font-semibold text-gray-700 mb-2">Price (Rs.)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-dm-sans font-semibold py-2.5 rounded-xl transition duration-200"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button
                      type="button"
                      onClick={editingItem ? cancelEdit : () => setShowAddForm(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-dm-sans font-semibold py-2.5 rounded-xl transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Add Item Button */}
            {!showAddForm && !editingItem && (
              <div className="mb-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-dm-sans font-semibold px-6 py-2.5 rounded-xl transition duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add New Item
                </button>
              </div>
            )}

            {/* Menu Items List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-xl font-dm-sans font-bold text-gray-800">
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items
                  </h2>
                  <div className="flex items-center gap-2 flex-1 md:flex-none md:w-80">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter text-sm"
                    />
                  </div>
                </div>
                {menuSearch && (
                  <p className="text-sm font-inter text-gray-600 mt-2">
                    Found {filteredMenuItems.length} item(s) matching "{menuSearch}"
                  </p>
                )}
              </div>

              {menuLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredMenuItems.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600 font-inter">
                    {menuSearch ? `No items matching "${menuSearch}"` : 'No items in this category'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Item ID</th>
                        <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Price</th>
                        <th className="px-6 py-3 text-left font-dm-sans font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMenuItems.map((item, index) => (
                        <tr
                          key={item.SL}
                          className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                        >
                          <td className="px-6 py-3 font-inter text-gray-800 font-semibold">#{item.SL}</td>
                          <td className="px-6 py-3 font-inter text-gray-800">{item.ItemName}</td>
                          <td className="px-6 py-3 font-inter text-gray-800 font-semibold text-blue-600">Rs. {item.Price}</td>
                          <td className="px-6 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditItem(item)}
                                className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white font-dm-sans font-semibold px-3 py-1.5 rounded-lg transition duration-200"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.SL)}
                                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-dm-sans font-semibold px-3 py-1.5 rounded-lg transition duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>
        )}
      </div>
    </div>
  );
}
