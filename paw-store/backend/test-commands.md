# 🧪 PawStore API Test Commands

API'nizi production ortamında test etmek için hazır curl komutları.

## 🔧 Setup

```bash
# API URL'ini değişkene atayın
export API_URL="http://localhost:5000"
# Production için:
# export API_URL="https://your-api-domain.com"
```

## 🏥 Health Check

```bash
# Basic health check
curl -X GET $API_URL/api/health

# Welcome message
curl -X GET $API_URL/

# Pretty print JSON
curl -X GET $API_URL/api/health | json_pp
```

## 🛍️ Products API

```bash
# Get all products
curl -X GET $API_URL/api/products

# Get all products with pagination
curl -X GET "$API_URL/api/products?page=1&limit=5"

# Search products
curl -X GET "$API_URL/api/products?q=köpek&category=1"

# Get single product
curl -X GET $API_URL/api/products/1

# Get single product (should return 404)
curl -X GET $API_URL/api/products/999
```

## 📦 Categories API

```bash
# Get all categories
curl -X GET $API_URL/api/categories
```

## 👤 User Authentication

```bash
# User registration
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@pawstore.com",
    "password": "Test123",
    "firstName": "Test",
    "lastName": "User"
  }'

# User login
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@pawstore.com",
    "password": "Test123"
  }'

# Save user token for authenticated requests
export USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🔧 Admin Authentication

```bash
# Admin login
curl -X POST $API_URL/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pawstore.com",
    "password": "admin123"
  }'

# Save admin token for authenticated requests
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🔐 Protected Endpoints (with Authentication)

```bash
# Get user profile (requires user token)
curl -X GET $API_URL/api/users/profile \
  -H "Authorization: Bearer $USER_TOKEN"

# Get user addresses (requires user token)
curl -X GET $API_URL/api/users/addresses \
  -H "Authorization: Bearer $USER_TOKEN"

# Add new address (requires user token)
curl -X POST $API_URL/api/users/addresses \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ev",
    "fullName": "Test User",
    "phone": "+90 555 123 4567",
    "address": "Test Mahallesi, Test Sokak No:1",
    "city": "İstanbul",
    "district": "Test",
    "postalCode": "34000",
    "isDefault": true
  }'
```

## 🛒 Orders API

```bash
# Get user orders (requires user token)
curl -X GET $API_URL/api/orders \
  -H "Authorization: Bearer $USER_TOKEN"

# Create new order (requires user token)
curl -X POST $API_URL/api/orders \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2
      },
      {
        "productId": 2,
        "quantity": 1
      }
    ],
    "shippingAddressId": 1,
    "paymentMethod": "card",
    "notes": "Test order"
  }'
```

## 🔧 Admin Endpoints (requires admin token)

```bash
# Get admin dashboard stats
curl -X GET $API_URL/api/admin/dashboard \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Get all orders (admin)
curl -X GET $API_URL/api/admin/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Update order status (admin)
curl -X PUT $API_URL/api/admin/orders/1/status \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'

# Create new product (admin)
curl -X POST $API_URL/api/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test açıklama",
    "price": 99.99,
    "stockQuantity": 50,
    "categoryId": 1,
    "imageUrl": "🧪"
  }'

# Create new category (admin)
curl -X POST $API_URL/api/categories \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Kategori",
    "description": "Test kategori açıklaması",
    "imageUrl": "🧪"
  }'
```

## ⚙️ Settings API

```bash
# Get site settings (public)
curl -X GET $API_URL/api/settings

# Update settings (admin only)
curl -X PUT $API_URL/api/settings \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "PawStore",
    "contactEmail": "info@pawstore.com",
    "contactPhone": "+90 555 123 4567"
  }'
```

## 🔒 Password Reset Flow

```bash
# Request password reset
curl -X POST $API_URL/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@pawstore.com"
  }'

# Reset password with token
curl -X POST $API_URL/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@pawstore.com",
    "newPassword": "NewPassword123",
    "resetToken": "reset-token-from-email"
  }'
```

## ❌ Error Testing

```bash
# Test validation errors
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'

# Test authentication errors
curl -X GET $API_URL/api/users/profile \
  -H "Authorization: Bearer invalid-token"

# Test not found errors
curl -X GET $API_URL/api/products/99999

# Test method not allowed
curl -X DELETE $API_URL/api/categories
```

## 📊 Performance Testing

```bash
# Multiple concurrent requests
for i in {1..10}; do
  curl -X GET $API_URL/api/products &
done
wait

# Stress test health endpoint
ab -n 100 -c 10 $API_URL/api/health
```

## 🔍 Debug Modes

```bash
# Verbose output
curl -v -X GET $API_URL/api/health

# Include response headers
curl -i -X GET $API_URL/api/health

# Follow redirects
curl -L -X GET $API_URL/api/health

# Save response to file
curl -X GET $API_URL/api/products -o products.json
```

---

## 🎯 Quick Test Script

Tüm endpoint'leri hızlıca test etmek için:

```bash
#!/bin/bash
API_URL="http://localhost:5000"

echo "🧪 Testing PawStore API..."

echo "✅ Health Check:"
curl -s $API_URL/api/health | head -50

echo -e "\n✅ Products:"
curl -s $API_URL/api/products | head -50

echo -e "\n✅ Categories:"  
curl -s $API_URL/api/categories | head -50

echo -e "\n🎉 Basic API tests completed!"
```