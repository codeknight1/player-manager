# Deployment Guide

## Production Deployment Options

### Option 1: Vercel (Recommended for Next.js)

#### Steps:

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Set Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   NEXTAUTH_SECRET=your-secure-32-char-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

4. **Database Setup (PostgreSQL)**
   - Use Vercel Postgres, or
   - Use external provider (Neon, Supabase, Railway)
   - Get connection string and add to `DATABASE_URL`

5. **Deploy**
   - Vercel will auto-deploy on push
   - Or click "Deploy" in dashboard

6. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

---

### Option 2: Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway creates database automatically

4. **Configure Environment Variables**
   Railway will auto-detect `DATABASE_URL` from PostgreSQL service.
   Add manually:
   ```
   NEXTAUTH_SECRET=your-secure-secret
   NEXTAUTH_URL=https://your-app.up.railway.app
   ```

5. **Set Build Command**
   In Railway settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`

6. **Deploy & Migrate**
   Railway will auto-deploy. Then run:
   ```bash
   railway run npx prisma migrate deploy
   railway run npm run db:seed
   ```

---

### Option 3: Render

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect GitHub repo

2. **Configure**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Add PostgreSQL Database**
   - Create new PostgreSQL database
   - Copy connection string

4. **Environment Variables**
   ```
   DATABASE_URL=<postgres-connection-string>
   NEXTAUTH_SECRET=<your-secret>
   NEXTAUTH_URL=https://your-app.onrender.com
   ```

5. **Deploy**
   - Render auto-deploys on git push
   - Run migrations via SSH or Render shell

---

## Database Migration to Production

### From SQLite to PostgreSQL

1. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Get PostgreSQL Connection String**
   - Vercel Postgres: Auto-provided
   - Neon: Copy from dashboard
   - Supabase: Copy from settings
   - Railway: Auto-provided in service

3. **Update .env**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

4. **Run Migration**
   ```bash
   npx prisma migrate deploy
   # or for first time:
   npx prisma migrate dev --name init
   ```

5. **Seed Production Data** (Optional)
   ```bash
   npm run db:seed
   ```

---

## Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - 32+ character random string
- `NEXTAUTH_URL` - Your production domain (e.g., `https://ppm.example.com`)

### Optional (Future)
- `STRIPE_SECRET_KEY` - For payments
- `STRIPE_PUBLISHABLE_KEY` - For payments
- `S3_BUCKET_NAME` - For file uploads
- `S3_REGION` - AWS region
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `UPSTASH_REDIS_URL` - For rate limiting
- `RESEND_API_KEY` - For email notifications

---

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables set correctly
- [ ] Test login with demo accounts
- [ ] Test API endpoints
- [ ] Verify real-time updates work
- [ ] Check error handling
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS (auto on Vercel/Railway)
- [ ] Set up monitoring (optional)
- [ ] Configure backups for database
- [ ] Test all user flows

---

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors

### Database Connection Errors
- Verify `DATABASE_URL` format
- Check database is accessible
- Ensure IP allowlist includes your provider

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches domain
- Clear browser cookies

### 404 Errors on Routes
- Verify Next.js build completed
- Check middleware configuration
- Verify route files exist in `app/` directory

---

## Production Optimizations

### Enable Caching
```typescript
// In API routes
export const revalidate = 3600; // 1 hour
```

### Enable Compression
Vercel/Railway handle this automatically.

### Image Optimization
Use Next.js Image component (already implemented).

### Database Connection Pooling
Most providers handle this, but configure in Prisma:
```prisma
// In datasource
directUrl = env("DIRECT_URL")
```

---

## Monitoring & Logging

### Recommended Services
- **Vercel Analytics** - Built-in
- **Sentry** - Error tracking
- **Logtail** - Log aggregation
- **Uptime Robot** - Uptime monitoring

### Add Error Tracking
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Backup Strategy

### Database Backups
- **Vercel Postgres**: Automatic daily backups
- **Neon**: Automatic backups with point-in-time recovery
- **Railway**: Manual backups via dashboard
- **Custom**: Use `pg_dump` scheduled via cron

### Backup Command
```bash
pg_dump $DATABASE_URL > backup.sql
```

---

## Security Best Practices

1. ✅ Use HTTPS (automatic on most platforms)
2. ✅ Set strong `NEXTAUTH_SECRET`
3. ✅ Enable database SSL connections
4. ✅ Use environment variables (never commit secrets)
5. ✅ Regular dependency updates
6. ✅ Rate limiting (implement Redis-based)
7. ✅ Input validation on all API routes
8. ✅ SQL injection protection (Prisma handles this)
9. ✅ XSS protection (Next.js handles this)
10. ✅ CORS configuration (if needed)

---

**Need Help?** Open an issue on GitHub.






