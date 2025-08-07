# 🚀 PawStore Backend Deployment Guide

## 🛤️ Railway Deployment (Recommended)

### 1. Preparation
```bash
# Make sure you're in the backend directory
cd paw-store/backend

# Install dependencies
npm install

# Test locally
npm run dev
```

### 2. Railway Setup
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. Choose the `backend` folder

### 3. Environment Variables
Add these in Railway dashboard:

```env
NODE_ENV=production
PORT=5000

# Database (Railway will auto-generate these)
DATABASE_URL=postgresql://username:password@host:port/dbname

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Admin Configuration
ADMIN_EMAIL=admin@pawstore.com
ADMIN_PASSWORD=admin123

# CORS Configuration (will be your frontend URL)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 4. Database Setup
1. In Railway dashboard, click "New" > "Database" > "PostgreSQL"
2. Railway will automatically provide DATABASE_URL
3. Your app will auto-create tables on first run

### 5. Deploy
1. Push your code to GitHub
2. Railway will automatically deploy
3. Get your API URL: `https://your-app-name.railway.app`

### 6. Test Deployment
```bash
# Test your deployed API
curl https://your-app-name.railway.app/api/health

# Should return:
# {
#   "success": true,
#   "message": "API is healthy! ✅",
#   "timestamp": "2024-01-XX...",
#   "uptime": 123.45
# }
```

---

## 🌐 Alternative: Heroku Deployment

### 1. Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

### 2. Create Heroku App
```bash
heroku create pawstore-api
heroku addons:create heroku-postgresql:hobby-dev
```

### 3. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set ADMIN_EMAIL=admin@pawstore.com
heroku config:set ADMIN_PASSWORD=admin123
heroku config:set FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 4. Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

---

## 🔧 Alternative: Render Deployment

### 1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Choose "Web Service"
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 18+

### 5. Add Environment Variables (same as Railway)

---

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connected
- [ ] CORS origins set correctly
- [ ] Health check working
- [ ] Admin login working
- [ ] API endpoints responding
- [ ] Logs showing no errors

---

## 🔍 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure database is created
   - Check network access

2. **CORS Errors**
   - Add frontend URL to FRONTEND_URL env var
   - Check origins in server.js

3. **404 Errors**
   - Ensure all route files exist
   - Check server.js route imports

4. **Memory/Timeout Issues**
   - Increase timeout in railway.json
   - Check for memory leaks
   - Monitor performance

---

## 📊 Monitoring

- Railway provides built-in logs and metrics
- Monitor API response times
- Check database performance
- Set up alerts for errors

Your API will be available at:
`https://your-app-name.railway.app`