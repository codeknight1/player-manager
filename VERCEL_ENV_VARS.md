# 🔐 Vercel Environment Variables

Copy these EXACTLY into Vercel → Settings → Environment Variables:

## Required Variables

```env
DATABASE_URL=postgresql://nrkp53:xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1@us-east-1.sql.xata.sh:5432/ppm:main?sslmode=require

DIRECT_URL=postgresql://nrkp53:xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1@us-east-1.sql.xata.sh:5432/ppm:main?sslmode=require

NEXTAUTH_SECRET=hfL+imdZ2EaH2+dCJ2lNpxmCcMkuCvQPOR6F5svOu0Q=

NEXTAUTH_URL=https://your-app-name.vercel.app
```

**⚠️ IMPORTANT:**
- After first deployment, update `NEXTAUTH_URL` with your actual Vercel domain
- Then redeploy

## Optional Variables

```env
XATA_API_KEY=xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1

XATA_REST_URL=https://Codeknight-s-workspace-nrkp53.us-east-1.xata.sh/db/ppm:main

XATA_BRANCH=main
```

## ✅ DO NOT SET:

- ❌ `NEXT_PUBLIC_API_BASE` - Not needed (no Express backend)
- ❌ `DATABASE_URL_POSTGRES` - Use `DATABASE_URL` instead

---

**Copy these into Vercel dashboard now!** 📋

