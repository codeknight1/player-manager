# Xata Database Setup ✅

Your application is now configured to use **Xata PostgreSQL** database.

## Environment Variables Setup

Create or update your `.env.local` file with:

```env
# Xata Database
DATABASE_URL="postgresql://nrkp53:xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1@us-east-1.sql.xata.sh:5432/ppm:main?sslmode=require"
DIRECT_URL="postgresql://nrkp53:xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1@us-east-1.sql.xata.sh:5432/ppm:main?sslmode=require"

# Xata API (optional, for future Xata REST API features)
XATA_API_KEY="xau_9kZQqifpREevDbvUHoIw6D2G5GIAmDVh1"
XATA_REST_URL="https://Codeknight-s-workspace-nrkp53.us-east-1.xata.sh/db/ppm:main"
XATA_BRANCH="main"

# NextAuth.js
NEXTAUTH_SECRET="GENERATE_A_NEW_32_CHARACTER_SECRET_HERE"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (optional, leave empty if not using)
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

## ⚠️ Important Changes

1. **Removed `NEXT_PUBLIC_API_BASE`** - No longer needed since we removed the Express backend
2. **Removed `DATABASE_URL_POSTGRES`** - Use `DATABASE_URL` only
3. **Generate new `NEXTAUTH_SECRET`** - Your current one needs to be changed

## Generate NEXTAUTH_SECRET

**Windows PowerShell:**
```powershell
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host $secret
```

**Or use OpenSSL:**
```bash
openssl rand -base64 32
```

**Or use Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**⚠️ Important:** Generate a NEW secret for production. Don't use the default `"change-this-to-any-random-32-character-string"`!

## Setup Steps

### 1. Update .env.local

Remove these lines (no longer needed):
```env
DATABASE_URL_POSTGRES="..."  ❌ REMOVE
NEXT_PUBLIC_API_BASE="..."   ❌ REMOVE
```

Keep only `DATABASE_URL` for Prisma.

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Push Schema to Xata

```bash
npm run db:push
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

## Deployment to Vercel

When deploying to Vercel, set these environment variables:

### Required
- `DATABASE_URL` - Your Xata PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate a new secure secret
- `NEXTAUTH_URL` - Your production domain (e.g., `https://your-app.vercel.app`)

### Optional
- `DIRECT_URL` - Same as DATABASE_URL for Xata
- `XATA_API_KEY` - For future Xata REST API features
- `XATA_REST_URL` - For future Xata REST API features
- `XATA_BRANCH` - Usually "main"

### Don't Set These
- ❌ `DATABASE_URL_POSTGRES` - Not needed
- ❌ `NEXT_PUBLIC_API_BASE` - Not needed (no Express backend)

## Xata Connection Notes

- ✅ SSL is required (`sslmode=require`)
- ✅ Connection string includes branch (`:main`)
- ✅ Works with Prisma out of the box
- ✅ Direct PostgreSQL connection

## Troubleshooting

**Connection refused?**
- Verify your Xata database is active in the Xata dashboard
- Check that SSL mode is set correctly

**Schema push fails?**
- Make sure you have write permissions on the Xata branch
- Try using the Xata dashboard to verify connection

**Prisma generate fails?**
- Ensure DATABASE_URL is correct
- Check that you can connect to the database manually

---

**Your Xata database is ready to use! 🚀**

