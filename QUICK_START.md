# Quick Start Guide

Get PPM running in 5 minutes!

## 🚀 Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env.local`
Create a file named `.env.local` in the root directory:

```env
NEXTAUTH_SECRET="change-this-to-any-random-32-character-string"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE="http://localhost:4000"
```

**Quick secret generator:**
```bash
# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 3. Start Backend (PostgreSQL + Express)
```
cd backend
npm install
$env:DATABASE_URL="postgresql://<user>:<password>@localhost:5432/ppm?schema=public"
npm run db:generate
npm run db:push
npm run db:seed
npm run dev  # http://localhost:4000
```

### 4. Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000**

## 🧪 Test the Application

### Login as Player
- Email: `player@demo.com`
- Password: `demo123`
- Go to: `/player/dashboard`

### Login as Agent
- Email: `agent@demo.com`
- Password: `demo123`
- Go to: `/agent/dashboard`

### Login as Academy
- Email: `academy@demo.com`
- Password: `demo123`
- Go to: `/academy/dashboard`

## ✅ What's Pre-loaded

After seeding, you'll have:
- ✅ 3 demo users (Player, Agent, Academy)
- ✅ 3 trials/tournaments
- ✅ 2 applications
- ✅ 2 messages (conversation between player and agent)
- ✅ 3 notifications
- ✅ Player profiles with stats

## 🎯 Try These Features

1. **Player Flow:**
   - View profile at `/player/profile`
   - Browse opportunities at `/explore-opportunities`
   - Check messages at `/player/messages`
   - View notifications at `/notifications`

2. **Agent Flow:**
   - Search players at `/agent/players`
   - View messages at `/agent/messages`
   - Check trials at `/agent/trials`

3. **Academy Flow:**
   - Manage players at `/academy/players`
   - Create tournaments at `/academy/tournaments`
   - View analytics at `/academy/analytics`

## 🐛 Troubleshooting

**Can't login?**
- Make sure `.env.local` exists with `NEXTAUTH_SECRET` set
- Restart dev server after creating `.env.local`

**Database errors?**
- Run: `npm run db:push` to sync schema
- Run: `npm run db:seed` to populate data

**Port already in use?**
- Change port: `npm run dev -- -p 3001`

**Module not found?**
- Delete `node_modules` and `.next`
- Run: `npm install`
- Run: `npm run dev`

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Explore the codebase in `app/` directory

---

**Ready to build! 🎉**



