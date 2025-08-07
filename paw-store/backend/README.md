# PawStore Backend API

Professional Pet Shop E-commerce Backend API built with Node.js, Express.js, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**
  - JWT token-based authentication
  - User registration and login
  - Admin authentication
  - Password reset functionality

- **User Management**
  - User profiles
  - Address management
  - Order history

- **Product Management**
  - CRUD operations for products
  - Category management
  - Search and filtering
  - Stock management

- **Order Management**
  - Order creation and tracking
  - Status updates
  - Payment processing

- **Admin Panel**
  - Dashboard statistics
  - Order management
  - User management

- **Security Features**
  - Helmet.js for security headers
  - Rate limiting
  - Input validation
  - CORS protection

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
4. Update environment variables in `.env`
5. Start PostgreSQL service
6. Run the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add new address

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings (Admin only)

## 🧪 Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/categories

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Admin login
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pawstore.com",
    "password": "admin123"
  }'
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js         # Database configuration
├── controllers/            # Route controllers (future expansion)
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── validation.js      # Input validation
├── models/                # Database models (future expansion)
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── products.js       # Product routes
│   ├── categories.js     # Category routes
│   ├── orders.js         # Order routes
│   ├── users.js          # User routes
│   ├── admin.js          # Admin routes
│   └── settings.js       # Settings routes
├── utils/                # Utility functions
├── uploads/              # File upload directory
├── .env                  # Environment variables
├── .env.example          # Environment template
├── server.js             # Main server file
└── package.json          # Dependencies
```

## 🔐 Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pawstore
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Admin Configuration
ADMIN_EMAIL=admin@pawstore.com
ADMIN_PASSWORD=admin123

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Database Schema

The API automatically creates the following tables:
- `users` - User accounts
- `admin_users` - Admin accounts
- `categories` - Product categories
- `products` - Product catalog
- `addresses` - User addresses
- `orders` - Customer orders
- `order_items` - Order line items
- `settings` - Site configuration

## 🔄 Auto-Setup

The API includes automatic database setup:
1. **Database Creation**: Creates the database if it doesn't exist
2. **Table Creation**: Creates all required tables with proper relationships
3. **Default Data**: Inserts sample categories, products, and admin user
4. **Indexes**: Creates performance indexes

## 🌟 Default Admin Account

- **Email**: admin@pawstore.com
- **Password**: admin123

Change these credentials in production!

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure production database
4. Enable SSL for database connections
5. Set up proper CORS origins
6. Use environment-specific configuration

## 📊 Monitoring

The API includes:
- Request logging with Morgan
- Error tracking
- Health check endpoint
- Database connection monitoring

## 🔧 Development

- Use `npm run dev` for development with auto-restart
- API will auto-reload on file changes
- Detailed error messages in development mode
- Database query logging enabled