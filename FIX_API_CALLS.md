# Fix: API Calls Still Going to localhost:4000

## Problem

Your application is still calling `http://localhost:4000/api/profile` instead of using the Next.js API routes at `/api/profile`.

## Solution

The issue is that `NEXT_PUBLIC_API_BASE` is still set in your `.env.local` file. Since we removed the Express backend, you need to **remove** this variable.

## Fix Steps

### 1. Open `.env.local` file

Open `.env.local` in the root of your project.

### 2. Remove or Comment Out This Line

**Remove this line:**
```env
NEXT_PUBLIC_API_BASE="http://localhost:4000"  ❌ REMOVE THIS
```

**Or set it to empty:**
```env
NEXT_PUBLIC_API_BASE=""  ✅ Set to empty
```

### 3. Restart Your Dev Server

After updating `.env.local`, you MUST restart your dev server:

1. **Stop the dev server** (Ctrl+C in the terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```

**Important:** Environment variables starting with `NEXT_PUBLIC_` are embedded at build time, so you need to restart the dev server for changes to take effect.

### 4. Verify

After restarting, check the Network tab again. The requests should now go to:
- ✅ `http://localhost:3000/api/profile` (relative path)
- ❌ NOT `http://localhost:4000/api/profile` (old backend)

## Your `.env.local` Should Look Like This

```env
# Xata Database
DATABASE_URL="postgresql://nrkp53:xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1@us-east-1.sql.xata.sh:5432/ppm:main?sslmode=require"
DIRECT_URL="postgresql://nrkp53:xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1@us-east-1.sql.xata.sh:5432/ppm:main?sslmode=require"

# Xata API (optional)
XATA_API_KEY="xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1"
XATA_REST_URL="https://Codeknight-s-workspace-nrkp53.us-east-1.xata.sh/db/ppm:main"
XATA_BRANCH="main"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# DO NOT SET THIS - Removed backend!
# NEXT_PUBLIC_API_BASE - REMOVED ✅
```

## Why This Happens

The `app/lib/api.ts` file checks for `NEXT_PUBLIC_API_BASE`:

```typescript
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

function buildUrl(endpoint: string) {
  const normalized = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  if (API_BASE.length === 0) {
    return `/api/${normalized}`;  // ✅ Uses relative path
  }
  return `${API_BASE}/api/${normalized}`;  // ❌ Uses external backend
}
```

When `NEXT_PUBLIC_API_BASE` is set, it uses that base URL. When it's empty or not set, it uses relative paths which hit the Next.js API routes.

---

**After removing `NEXT_PUBLIC_API_BASE` and restarting the dev server, all API calls will use Next.js API routes! ✅**

