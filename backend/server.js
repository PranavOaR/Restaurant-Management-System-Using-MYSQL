const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('📊 DB Configuration:');
console.log('  Host:', process.env.DB_HOST || 'localhost');
console.log('  User:', process.env.DB_USER || 'root');
console.log('  Database:', process.env.DB_NAME || 'menu');

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Welcomenav1#',
  database: 'menu',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('✗ Failed to connect to MySQL:', err.message);
  } else {
    console.log('✓ Connected to MySQL database');
    connection.release();
  }
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
app.get('/api/menu/:category', (req, res) => {
  const { category } = req.params;
  pool.query(
    `SELECT SL, ItemName, Price FROM ${category} ORDER BY SL`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: rows });
    }
  );
});

// Get single menu item
app.get('/api/menu/:category/:id', (req, res) => {
  const { category, id } = req.params;
  pool.query(
    `SELECT SL, ItemName, Price FROM ${category} WHERE SL = ?`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }
      res.json({ success: true, data: rows[0] });
    }
  );
});

// Place order
app.post('/api/orders', (req, res) => {
  const { items } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, error: 'No items in order' });
  }
  
  let completed = 0;
  let hasError = false;
  
  items.forEach((item) => {
    pool.query(
      'INSERT INTO orders (ItemName, Price, Quantity, TotalPrice) VALUES (?, ?, ?, ?)',
      [item.itemName, item.price, item.quantity, item.totalPrice],
      (err) => {
        if (err && !hasError) {
          hasError = true;
          return res.status(500).json({ success: false, error: err.message });
        }
        completed++;
        if (completed === items.length && !hasError) {
          res.json({ success: true, message: 'Order placed successfully' });
        }
      }
    );
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  pool.query(
    'SELECT OrderID, ItemName, Price, Quantity, TotalPrice, OrderTime FROM orders ORDER BY OrderTime DESC LIMIT 50',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: rows });
    }
  );
});

// Get order statistics
app.get('/api/statistics', (req, res) => {
  pool.query('SELECT COUNT(*) as count FROM orders', (err, result1) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    pool.query('SELECT SUM(TotalPrice) as total FROM orders', (err, result2) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      
      res.json({
        success: true,
        data: {
          totalOrders: result1[0].count,
          totalRevenue: result2[0].total || 0
        }
      });
    });
  });
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
