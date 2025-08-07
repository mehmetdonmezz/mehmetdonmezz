const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'pawstore',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

const pool = new Pool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('🕒 Database time:', result.rows[0].now);
    
    // Initialize database on first connection
    await initDatabase();
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // If database doesn't exist, try to create it
    if (error.message.includes('does not exist')) {
      console.log('🔧 Database does not exist, trying to create it...');
      try {
        const { Pool } = require('pg');
        const adminPool = new Pool({
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          database: 'postgres', // Connect to default database
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || '',
        });
        
        const adminClient = await adminPool.connect();
        await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME || 'pawstore'}`);
        console.log('✅ Database created successfully');
        adminClient.release();
        await adminPool.end();
        
        // Now try connecting to the new database
        const client = await pool.connect();
        await initDatabase();
        client.release();
        return true;
      } catch (createError) {
        console.error('❌ Failed to create database:', createError.message);
        throw createError;
      }
    }
    throw error;
  }
};

// Generic query function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Executed query:', { text, duration: `${duration}ms`, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Database query error:', {
      query: text,
      params,
      error: error.message
    });
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Database initialization
const initDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');
    
    // Create tables if they don't exist
    await createTables();
    await createIndexes();
    await insertDefaultData();
    
    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Create all tables
const createTables = async () => {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      date_of_birth DATE,
      gender VARCHAR(10),
      is_active BOOLEAN DEFAULT true,
      email_verified BOOLEAN DEFAULT false,
      email_verification_token VARCHAR(255),
      password_reset_token VARCHAR(255),
      password_reset_expires TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      image_url VARCHAR(500),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock_quantity INTEGER DEFAULT 0,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      image_url VARCHAR(500),
      images JSONB DEFAULT '[]',
      features JSONB DEFAULT '[]',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Addresses table
    `CREATE TABLE IF NOT EXISTS addresses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL,
      full_name VARCHAR(200) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      district VARCHAR(100) NOT NULL,
      postal_code VARCHAR(10) NOT NULL,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Orders table
    `CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status VARCHAR(20) DEFAULT 'pending',
      total_amount DECIMAL(10,2) NOT NULL,
      shipping_address JSONB NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      payment_status VARCHAR(20) DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Order items table
    `CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name VARCHAR(255) NOT NULL,
      product_image VARCHAR(500),
      product_category VARCHAR(100),
      quantity INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Settings table
    `CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(100) UNIQUE NOT NULL,
      value JSONB NOT NULL,
      description TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Admin users table
    `CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(200) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const table of tables) {
    await query(table);
  }

  console.log('✅ All tables created successfully');
};

// Create indexes for better performance
const createIndexes = async () => {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)',
    'CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)',
    'CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
    'CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)',
    'CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)',
    'CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key)'
  ];

  for (const index of indexes) {
    await query(index);
  }

  console.log('✅ All indexes created successfully');
};

// Insert default data
const insertDefaultData = async () => {
  try {
    // Check if categories already exist
    const categoriesResult = await query('SELECT COUNT(*) FROM categories');
    const categoriesCount = parseInt(categoriesResult.rows[0].count);

    if (categoriesCount === 0) {
      console.log('📦 Inserting default categories...');
      
      const defaultCategories = [
        { name: 'Köpek Maması', description: 'Köpekler için besleyici mamalar', image_url: '🐕' },
        { name: 'Kedi Maması', description: 'Kediler için besleyici mamalar', image_url: '🐱' },
        { name: 'Köpek Oyuncağı', description: 'Köpekler için eğlenceli oyuncaklar', image_url: '🎾' },
        { name: 'Kedi Oyuncağı', description: 'Kediler için eğlenceli oyuncaklar', image_url: '🪀' },
        { name: 'Köpek Aksesuarı', description: 'Köpekler için aksesuarlar', image_url: '🎀' },
        { name: 'Kedi Bakımı', description: 'Kediler için bakım ürünleri', image_url: '🏺' },
        { name: 'Bakım', description: 'Genel bakım ürünleri', image_url: '🧴' }
      ];

      for (const category of defaultCategories) {
        await query(
          'INSERT INTO categories (name, description, image_url) VALUES ($1, $2, $3)',
          [category.name, category.description, category.image_url]
        );
      }
    }

    // Check if products already exist
    const productsResult = await query('SELECT COUNT(*) FROM products');
    const productsCount = parseInt(productsResult.rows[0].count);

    if (productsCount === 0) {
      console.log('🛍️ Inserting default products...');
      
      const defaultProducts = [
        {
          name: 'Royal Canin Köpek Maması',
          description: 'Yetişkin köpekler için besleyici mama',
          price: 199.99,
          stock_quantity: 50,
          category_id: 1,
          image_url: '🐕'
        },
        {
          name: 'Whiskas Kedi Maması',
          description: 'Yetişkin kediler için besleyici mama',
          price: 89.99,
          stock_quantity: 75,
          category_id: 2,
          image_url: '🐱'
        },
        {
          name: 'Kong Köpek Oyuncağı',
          description: 'Dayanıklı köpek oyuncağı',
          price: 45.00,
          stock_quantity: 30,
          category_id: 3,
          image_url: '🎾'
        },
        {
          name: 'Kedi Kumu',
          description: 'Topaklanan kedi kumu',
          price: 79.99,
          stock_quantity: 40,
          category_id: 6,
          image_url: '🏺'
        },
        {
          name: 'Köpek Tasması',
          description: 'Ayarlanabilir köpek tasması',
          price: 39.98,
          stock_quantity: 25,
          category_id: 5,
          image_url: '🎀'
        },
        {
          name: 'Kedi Oyuncağı',
          description: 'İnteraktif kedi oyuncağı',
          price: 25.50,
          stock_quantity: 60,
          category_id: 4,
          image_url: '🪀'
        },
        {
          name: 'Pet Shampoo',
          description: 'Evcil hayvanlar için şampuan',
          price: 50.00,
          stock_quantity: 35,
          category_id: 7,
          image_url: '🧴'
        },
        {
          name: 'Premium Kedi Maması',
          description: 'Premium kalite kedi maması',
          price: 149.99,
          stock_quantity: 20,
          category_id: 2,
          image_url: '🐱'
        }
      ];

      for (const product of defaultProducts) {
        await query(
          `INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [product.name, product.description, product.price, product.stock_quantity, product.category_id, product.image_url]
        );
      }
    }

    // Check if admin user exists
    const adminResult = await query('SELECT COUNT(*) FROM admin_users');
    const adminCount = parseInt(adminResult.rows[0].count);

    if (adminCount === 0) {
      console.log('👤 Creating default admin user...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      
      await query(
        'INSERT INTO admin_users (email, password, name) VALUES ($1, $2, $3)',
        [process.env.ADMIN_EMAIL || 'admin@pawstore.com', hashedPassword, 'Admin User']
      );
    }

    console.log('✅ Default data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting default data:', error.message);
    throw error;
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('🛑 Closing database connections...');
  await pool.end();
  console.log('✅ Database connections closed');
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  initDatabase
};