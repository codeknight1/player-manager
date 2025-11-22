# Deployment Checklist - Tonight 🚀

## ✅ Pre-Deployment Fixes Completed

- [x] Fixed Prisma schema to use `DATABASE_URL` (standard)
- [x] Fixed image references in landing page
- [x] Updated middleware to allow `.jpg` and `.jpeg` files
- [x] Added `postinstall` script for Prisma generate
- [x] Updated build script to include Prisma generate

## 📋 Deployment Steps

### 1. Pre-Deployment Verification

```bash
# Test build locally
npm install
npm run build

# If build succeeds, you're ready!
```

### 2. Choose Your Platform

**Recommended: Vercel** (easiest for Next.js)

### 3. Environment Variables Required

Set these in your deployment platform:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=your-secure-32-character-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 4. Database Setup

**Option A: Vercel Postgres**
- Auto-provisioned in Vercel dashboard
- Automatically provides `DATABASE_URL`

**Option B: External PostgreSQL**
- Use Neon (neon.tech) - free tier available
- Use Supabase - free tier available
- Use Railway - free tier available

### 5. Deployment Commands

After deploying, run migrations:

```bash
# Via Vercel CLI (if using Vercel)
vercel env pull
npx prisma migrate deploy
npm run db:seed

# Or via platform's shell/SSH
npx prisma migrate deploy
npm run db:seed
```

### 6. Post-Deployment Verification

- [ ] Home page loads correctly
- [ ] Can login with demo accounts:
  - `player@demo.com` / `demo123`
  - `agent@demo.com` / `demo123`
  - `academy@demo.com` / `demo123`
- [ ] Images display correctly
- [ ] API endpoints respond
- [ ] Protected routes redirect properly

## 🔧 Quick Platform-Specific Guides

### Vercel (Recommended)

1. Push to GitHub
2. Go to vercel.com → Import Project
3. Connect GitHub repo
4. Add environment variables in dashboard
5. Add Vercel Postgres (or use external DB)
6. Deploy
7. Run migrations via Vercel CLI or dashboard shell

### Railway

1. Push to GitHub
2. Go to railway.app → New Project
3. Deploy from GitHub
4. Add PostgreSQL service
5. Set environment variables
6. Set build command: `npm run build`
7. Set start command: `npm start`
8. Run migrations via Railway CLI

### Render

1. Push to GitHub
2. Go to render.com → New Web Service
3. Connect GitHub repo
4. Set build: `npm install && npm run build`
5. Set start: `npm start`
6. Add PostgreSQL database
7. Set environment variables
8. Deploy
9. Run migrations via SSH

## ⚠️ Important Notes

1. **Database**: Production uses PostgreSQL, not SQLite
2. **Migrations**: Must run `npx prisma migrate deploy` after deployment
3. **Seeding**: Run `npm run db:seed` to populate demo users
4. **Images**: Ensure `1.jpg` exists in `public/` folder or update image paths
5. **Middleware**: Already configured to exclude static files

## 🐛 Common Issues

**Build fails:**
- Check Node.js version (requires 18+)
- Verify all dependencies in package.json
- Run `npm install` before build

**Database connection fails:**
- Verify `DATABASE_URL` format is correct
- Check database is accessible from deployment IP
- Ensure SSL is enabled (most cloud providers require it)

**Images not loading:**
- Check `1.jpg` exists in `public/` folder
- Verify middleware excludes `.jpg` files (already fixed)

**Authentication not working:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## 📝 Final Steps Before Deploy

1. [ ] Test local build: `npm run build`
2. [ ] Commit all changes: `git add . && git commit -m "Ready for deployment"`
3. [ ] Push to GitHub: `git push origin main`
4. [ ] Set up database (Vercel Postgres or external)
5. [ ] Configure environment variables
6. [ ] Deploy
7. [ ] Run migrations and seed
8. [ ] Test all features

---

**Ready to deploy! Good luck! 🎉**

