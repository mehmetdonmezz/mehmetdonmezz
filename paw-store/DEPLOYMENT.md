# 🚀 PawStore Frontend Deployment Guide

## 🔥 Vercel Deployment (Recommended)

### 1. Preparation
```bash
# Make sure you're in the frontend directory
cd paw-store

# Install dependencies
npm install

# Test build
npm run build

# Test locally
npm run dev
```

### 2. Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect it's a Next.js project

### 3. Environment Variables
Add these in Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
```

### 4. Build Settings (Auto-detected)
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 5. Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Get your URL: `https://your-app-name.vercel.app`

### 6. Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## 🌐 Alternative: Netlify Deployment

### 1. Build for Production
```bash
npm run build
npm run export  # if using static export
```

### 2. Netlify Setup
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `out` folder (for static export)
3. Or connect GitHub repository

### 3. Build Settings
- **Build Command:** `npm run build`
- **Publish Directory:** `.next` or `out`

---

## 🔧 Environment Configuration

### Update API URLs
After backend deployment, update the API URL:

1. In Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Set `NEXT_PUBLIC_API_URL` to your Railway backend URL

2. Or update `vercel.json`:
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-actual-backend.railway.app"
  }
}
```

### Production Environment Variables
```env
# Required
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app

# Optional
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
```

---

## ✅ Deployment Checklist

### Before Deployment:
- [ ] All pages loading without errors
- [ ] API integration working
- [ ] Authentication flows tested
- [ ] Payment system tested
- [ ] Admin panel accessible
- [ ] Mobile responsive checked

### After Deployment:
- [ ] Production site accessible
- [ ] API calls working
- [ ] User registration/login working
- [ ] Admin login working (admin@pawstore.com / admin123)
- [ ] Product catalog loading
- [ ] Shopping cart functional
- [ ] Checkout process working

---

## 🔍 Troubleshooting

### Common Issues:

1. **Build Errors**
   ```bash
   # Fix TypeScript errors
   npm run build
   
   # Check for unused imports
   npm run lint
   ```

2. **API Connection Issues**
   - Check NEXT_PUBLIC_API_URL is correct
   - Verify CORS settings in backend
   - Check network requests in browser dev tools

3. **Static Assets Not Loading**
   - Ensure all imports use relative paths
   - Check public folder structure

4. **Environment Variables Not Working**
   - Must start with NEXT_PUBLIC_ for client-side
   - Rebuild after adding new env vars

---

## 🚀 Performance Optimization

### Vercel automatically handles:
- CDN distribution
- Image optimization
- Code splitting
- Caching headers

### Manual optimizations:
1. Optimize images in `public` folder
2. Use Next.js `Image` component
3. Implement lazy loading
4. Minimize bundle size

---

## 📊 Monitoring

### Vercel provides:
- Analytics dashboard
- Performance metrics
- Error tracking
- Usage statistics

### Additional monitoring:
- Google Analytics (optional)
- User feedback collection
- Error reporting (Sentry)

---

## 🔗 Final URLs

After successful deployment:
- **Frontend:** `https://your-app-name.vercel.app`
- **Backend API:** `https://your-api-name.railway.app`
- **Admin Panel:** `https://your-app-name.vercel.app/admin/login`

**Admin Login:**
- Email: admin@pawstore.com
- Password: admin123

**Test the full system:**
1. Browse products: `https://your-app-name.vercel.app/products`
2. Register user: `https://your-app-name.vercel.app/auth/register`
3. Add to cart and checkout
4. Access admin panel