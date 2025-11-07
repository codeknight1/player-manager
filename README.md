# PPM - Professional Player Management

A comprehensive platform connecting players, agents, clubs, and academies for talent discovery and recruitment.

## 🚀 Features

### Player Dashboard
- **Profile Management** - Complete CV, bio, stats, and visibility settings
- **Content Upload** - Showcase videos, certificates, and achievements (YouTube integration)
- **Explore Opportunities** - Browse and apply for trials and tournaments
- **Messaging** - Secure communication with agents and clubs
- **Notifications** - Real-time alerts for messages, applications, and profile views
- **Payments** - Handle trial fees and registrations

### Agent/Club Dashboard
- **Player Search** - Advanced filtering by position, age, nationality, contract status
- **Shortlist Management** - Save and organize prospects
- **Recruitment Funnel** - Track players through discovery → contacted → invited → trial → signed
- **Trials & Tournaments** - Register, attend, and send invites
- **Verification** - Document upload for authenticity
- **Messaging** - Direct communication with players

### Academy/Partner Dashboard
- **Player Management** - Upload and manage academy squad profiles
- **Tournament Management** - Create, organize, and register teams
- **Analytics** - Track player exposure, scout views, and trial interest
- **Partnerships** - Network with clubs and agents
- **Verification** - Validate academy credentials

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** SQLite (dev) / PostgreSQL (production ready)
- **Authentication:** NextAuth.js v5
- **Real-time:** Polling-based updates (ready for WebSocket upgrade)
- **UI Components:** Custom components with Framer Motion animations
- **Notifications:** Sonner toast notifications

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🏃 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ppm
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-32-character-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 👤 Demo Accounts

All demo users have password: `demo123`

| Role | Email | Dashboard |
|------|-------|-----------|
| Player | `player@demo.com` | `/player/dashboard` |
| Agent | `agent@demo.com` | `/agent/dashboard` |
| Academy | `academy@demo.com` | `/academy/dashboard` |

## 📁 Project Structure

```
ppm/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth.js handlers
│   │   ├── profile/      # User profiles
│   │   ├── trials/       # Trials management
│   │   ├── applications/ # Applications
│   │   ├── messages/     # Messaging
│   │   └── notifications/# Notifications
│   ├── player/           # Player pages
│   ├── agent/            # Agent/Club pages
│   ├── academy/          # Academy/Partner pages
│   └── layout.tsx        # Root layout
├── components/
│   ├── layout/           # Header, Sidebar
│   ├── ui/               # Reusable UI components
│   └── ErrorBoundary.tsx # Error handling
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── app/lib/
│   ├── api.ts            # API utilities
│   ├── prisma.ts         # Prisma client
│   └── rateLimit.ts      # Rate limiting
└── middleware.ts         # Route protection
```

## 🔌 API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Profiles
- `GET /api/profile?userId=<id>` - Get user profile
- `POST /api/profile` - Create/update profile
- `GET /api/users?role=<role>` - List users by role

### Trials
- `GET /api/trials` - List all trials
- `POST /api/trials` - Create trial

### Applications
- `GET /api/applications?userId=<id>` - Get user applications
- `GET /api/applications?trialId=<id>` - Get trial applications
- `POST /api/applications` - Create application
- `PATCH /api/applications` - Update application status

### Messages
- `GET /api/messages?userId=<id>` - Get user messages
- `POST /api/messages` - Send message

### Notifications
- `GET /api/notifications?userId=<id>` - Get user notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications` - Mark as read

## 🗄️ Database Schema

### Models
- **User** - Users with roles (PLAYER, AGENT, ACADEMY, ADMIN)
- **Trial** - Trials and tournaments
- **Application** - Player applications to trials
- **Message** - Direct messages between users
- **Notification** - User notifications

See `prisma/schema.prisma` for full schema details.

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `NEXTAUTH_SECRET` (generate secure secret)
   - `NEXTAUTH_URL` (your domain)
4. Deploy

### Railway / Render

1. Connect GitHub repo
2. Add PostgreSQL database
3. Set environment variables
4. Run migrations: `npx prisma migrate deploy`
5. Seed database: `npm run db:seed`

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
CMD ["npm", "start"]
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database

## 🧪 Testing

1. Login with demo accounts
2. Create trials (as academy/agent)
3. Apply for trials (as player)
4. Send messages between users
5. Check notifications
6. Update profiles

## 🔒 Security Features

- Role-based access control (RBAC)
- Protected API routes via middleware
- Password hashing with bcryptjs
- JWT-based sessions
- Rate limiting utility (ready for Redis)

## 📝 Production Checklist

- [ ] Switch to PostgreSQL database
- [ ] Set secure `NEXTAUTH_SECRET`
- [ ] Configure S3/Cloudflare R2 for file uploads
- [ ] Set up Stripe for payments
- [ ] Add real-time WebSocket (Ably/Pusher)
- [ ] Implement email notifications
- [ ] Add rate limiting (Upstash Redis)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CDN for static assets
- [ ] Add analytics tracking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for the football community**







