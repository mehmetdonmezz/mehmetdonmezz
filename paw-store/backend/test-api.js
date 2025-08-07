const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PawStore API Test Working! 🐾',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy! ✅',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: 'postgres', // Test with default database first
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as time, version() as version');
    client.release();
    await pool.end();

    res.json({
      success: true,
      message: 'Database connection successful! 🎯',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed! ❌',
      error: error.message
    });
  }
});

// Mock products endpoint
app.get('/api/products', (req, res) => {
  const mockProducts = [
    {
      id: 1,
      name: 'Royal Canin Köpek Maması',
      price: 199.99,
      category: 'Köpek Maması',
      stock: 50,
      image: '🐕'
    },
    {
      id: 2,
      name: 'Whiskas Kedi Maması',
      price: 89.99,
      category: 'Kedi Maması',
      stock: 75,
      image: '🐱'
    },
    {
      id: 3,
      name: 'Kong Köpek Oyuncağı',
      price: 45.00,
      category: 'Köpek Oyuncağı',
      stock: 30,
      image: '🎾'
    }
  ];

  res.json({
    success: true,
    message: 'Products fetched successfully! 🛍️',
    data: {
      products: mockProducts,
      count: mockProducts.length
    }
  });
});

// Mock categories endpoint
app.get('/api/categories', (req, res) => {
  const mockCategories = [
    { id: 1, name: 'Köpek Maması', icon: '🐕' },
    { id: 2, name: 'Kedi Maması', icon: '🐱' },
    { id: 3, name: 'Köpek Oyuncağı', icon: '🎾' },
    { id: 4, name: 'Kedi Oyuncağı', icon: '🪀' }
  ];

  res.json({
    success: true,
    message: 'Categories fetched successfully! 📦',
    data: {
      categories: mockCategories,
      count: mockCategories.length
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 PawStore TEST API Server Running!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📝 Test endpoints:
   - GET  /                    (Welcome message)
   - GET  /api/health          (Health check)
   - GET  /api/test-db         (Database test)
   - GET  /api/products        (Mock products)
   - GET  /api/categories      (Mock categories)

🧪 Test in browser:
   http://localhost:${PORT}/api/health
  `);
});

module.exports = app;