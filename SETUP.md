# Backend Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# Or use any random string generator (minimum 32 characters)
```

## Database Setup

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Push schema to database:**
   ```bash
   npm run db:push
   ```

3. **Seed demo users:**
   ```bash
   npm run db:seed
   ```

## Demo Credentials

All demo users have password: `demo123`

- **Player:** `player@demo.com` → `/player/dashboard`
- **Agent:** `agent@demo.com` → `/agent/dashboard`
- **Academy:** `academy@demo.com` → `/academy/dashboard`

## API Endpoints

- `GET/POST /api/profile` - User profiles
- `GET/POST /api/trials` - Trial management
- `POST/PATCH /api/applications` - Trial applications
- `GET/POST /api/messages` - Messaging
- `GET/POST/PATCH /api/notifications` - Notifications
- `GET/POST /api/auth/[...nextauth]` - Authentication

## Next Steps

1. Set up `.env.local` with `NEXTAUTH_SECRET`
2. Restart the dev server: `npm run dev`
3. Test login with demo credentials













