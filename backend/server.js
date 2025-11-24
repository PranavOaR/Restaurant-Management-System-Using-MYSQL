const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Welcomenav1#',
  database: process.env.DB_NAME || 'menu',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// Test database connection
pool.getConnection().then(connection => {
  console.log('✓ Connected to MySQL database');
  connection.release();
}).catch(err => {
  console.error('✗ Failed to connect to MySQL:', err);
});

// ROUTES

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = [
      'beverages', 'chatitem', 'chineseitems', 'curry', 'dosaitem',
      'fruitjuice', 'icecreams', 'indianbreads', 'mealcombo',
      'riceitem', 'soup', 'southindian', 'starters', 'sweets'
    ];
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get menu items by category
app.get('/api/menu/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      `SELECT SL, ItemName, Price FROM ${category} ORDER BY SL`
    );
    
    connection.release();
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single menu item
app.get('/api/menu/:category/:id', async (req, res) => {
  try {
    const { category, id } = req.params;
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      `SELECT SL, ItemName, Price FROM ${category} WHERE SL = ?`,
      [id]
    );
    
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Place order
app.post('/api/orders', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }
    
    const connection = await pool.getConnection();
    
    for (const item of items) {
      await connection.query(
        'INSERT INTO orders (ItemName, Price, Quantity, TotalPrice) VALUES (?, ?, ?, ?)',
        [item.itemName, item.price, item.quantity, item.totalPrice]
      );
    }
    
    connection.release();
    res.json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      'SELECT OrderID, ItemName, Price, Quantity, TotalPrice, OrderTime FROM orders ORDER BY OrderTime DESC LIMIT 50'
    );
    
    connection.release();
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [totalOrders] = await connection.query('SELECT COUNT(*) as count FROM orders');
    const [totalRevenue] = await connection.query('SELECT SUM(TotalPrice) as total FROM orders');
    
    connection.release();
    
    res.json({
      success: true,
      data: {
        totalOrders: totalOrders[0].count,
        totalRevenue: totalRevenue[0].total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Restaurant Backend API running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`${'='.repeat(60)}\n`);
});
