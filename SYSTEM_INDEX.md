# PPM System Index

**Last Updated:** Generated System Index  
**Overall Status:** 70% Complete (Core features implemented, critical security/mediation features missing)

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Frontend Pages](#frontend-pages)
5. [Components](#components)
6. [Feature Status](#feature-status)
7. [Implementation Checklist](#implementation-checklist)
8. [Missing Features](#missing-features)

---

## 🏗️ System Architecture

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (full-stack Next.js)
- **Database:** Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Authentication:** NextAuth.js v4
- **Real-time:** Polling-based (5s messages, 30s notifications)
- **File Storage:** Supabase (configured but not fully integrated)

### Project Structure
```
ppm/
├── app/                    # Next.js App Router
│   ├── api/               # Next.js API Routes
│   │   ├── auth/          # NextAuth.js handlers
│   │   ├── profile/       # User profiles
│   │   ├── trials/        # Trials management
│   │   ├── applications/  # Applications
│   │   ├── messages/      # Messaging
│   │   ├── notifications/ # Notifications
│   │   ├── payments/      # Payments
│   │   └── users/         # User management
│   ├── player/            # Player dashboard pages
│   ├── agent/             # Agent dashboard pages
│   ├── academy/           # Academy dashboard pages
│   ├── admin/             # Admin dashboard pages
│   └── lib/               # Utilities (api.ts, prisma.ts)
├── components/            # React components
│   ├── layout/            # Sidebar, Header
│   ├── ui/                # UI components
│   └── auth/              # Auth components
└── prisma/                # Prisma schema & migrations
    └── schema.prisma      # Database schema
```

---

## 🗄️ Database Schema

### Models

#### User
- `id` (String, cuid)
- `email` (String, unique)
- `name` (String?)
- `password` (String?, hashed)
- `profileData` (String?, JSON)
- `role` (Role enum: PLAYER, AGENT, ACADEMY, ADMIN)
- `isActive` (Boolean, default: true)
- `createdAt`, `updatedAt`

**Relations:**
- messagesFrom, messagesTo
- applications
- notifications
- verifications
- uploads
- payments
- trialsCreated

#### Trial
- `id`, `title`, `city`, `date`, `fee`
- `createdById` (User relation)
- `createdAt`

**Relations:**
- apps (Application[])
- payments (Payment[])
- createdBy (User)

#### Application
- `id`, `userId`, `trialId`
- `status` (AppStatus: PENDING, ACCEPTED, REJECTED)
- `createdAt`

**Relations:**
- user (User)
- trial (Trial)

#### Message
- `id`, `fromId`, `toId`, `content`
- `createdAt`

**Relations:**
- from (User)
- to (User)

#### Notification
- `id`, `userId`, `title`, `body`
- `read` (Boolean, default: false)
- `createdAt`

**Relations:**
- user (User)

#### Payment
- `id`, `userId`, `trialId`
- `amount`, `currency` (default: "USD")
- `status` (String, default: "DUE")
- `createdAt`, `updatedAt`

**Relations:**
- user (User)
- trial (Trial)

#### Verification
- `id`, `userId`
- `documentType`, `documentName`
- `status` (VerificationStatus: PENDING, APPROVED, REJECTED)
- `createdAt`, `reviewedAt`, `reviewedBy`

**Relations:**
- user (User)

#### Upload
- `id`, `userId`, `name`
- `type` (UploadType: VIDEO, CERTIFICATE, ACHIEVEMENT)
- `url`, `thumbnail`
- `createdAt`

**Relations:**
- user (User)

---

## 🔌 API Endpoints

### Express Backend (`backend/src/routes/`)

#### Authentication (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- NextAuth.js routes: `/api/auth/[...nextauth]`

#### Users (`/api/users`)
- `GET /api/users` - List users (with role filter)
- Status: ✅ Implemented

#### Profile (`/api/profile`)
- `GET /api/profile?userId=<id>` - Get user profile
- `POST /api/profile` - Create/update profile
- Status: ✅ Implemented

#### Trials (`/api/trials`)
- `GET /api/trials?creatorId=<id>` - List trials
- `POST /api/trials` - Create trial
- Status: ✅ Implemented

#### Applications (`/api/applications`)
- `GET /api/applications?userId=<id>&trialId=<id>` - List applications
- `POST /api/applications` - Create application (requires payment)
- `PATCH /api/applications` - Update application status
- Status: ✅ Implemented

#### Messages (`/api/messages`)
- `GET /api/messages?userId=<id>` - Get user messages
- `POST /api/messages` - Send message
- Status: ✅ Implemented

#### Notifications (`/api/notifications`)
- `GET /api/notifications?userId=<id>` - Get user notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications` - Mark as read
- Status: ✅ Implemented

#### Uploads (`/api/uploads`)
- `POST /api/uploads` - Upload file
- Status: ⚠️ Structure exists, needs S3/R2 integration

#### Payments (`/api/payments`)
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- Status: ⚠️ Structure exists, needs Stripe integration

#### Admin (`/api/admin`)
- Routes exist in backend
- Status: ⚠️ Partially implemented (needs verification)

#### Connections (`/api/connections`)
- `GET /api/connections` - Get connections
- Status: ⚠️ Needs verification

### Next.js API Routes (`app/api/`)

Some routes exist in Next.js app directory but may be unused if Express backend is primary:
- `/app/api/auth/[...nextauth]/route.ts` ✅
- `/app/api/auth/login/route.ts` ✅
- `/app/api/auth/register/route.ts` ✅
- `/app/api/profile/route.ts` ✅
- `/app/api/messages/route.ts` ✅
- `/app/api/notifications/route.ts` ✅
- `/app/api/uploads/route.ts` ✅
- `/app/api/connections/route.ts` ⚠️

**All Next.js Routes:**
- `/app/api/trials/route.ts` ✅
- `/app/api/applications/route.ts` ✅
- `/app/api/users/route.ts` ✅
- `/app/api/payments/route.ts` ✅

---

## 📄 Frontend Pages

### Public Pages
- `/` - Landing page ✅
- `/for-players` - Player marketing page ✅
- `/for-clubs` - Club marketing page ✅
- `/for-partners` - Partner marketing page ✅
- `/password-reset-request` - Password reset request ✅
- `/password-reset-new-password` - New password form ✅

### Player Pages (`/player/`)
- `/player/login` - Player login ✅
- `/player/register` - Player registration ✅
- `/player/dashboard` - Dashboard with widgets ✅
- `/player/profile` - Profile management ✅
- `/player/messages` - Messaging interface ✅
- `/player/network` - Network/connections page ✅
- `/player/payments` - Payment management ⚠️ (mock)
- `/explore-opportunities` - Browse trials ✅

### Agent Pages (`/agent/`)
- `/agent/login` - Agent login ✅
- `/agent/register` - Agent registration ✅
- `/agent/dashboard` - Dashboard with quick search ✅
- `/agent/players` - Player search & filtering ⚠️ (missing nationality filter)
- `/agent/messages` - Messaging interface ✅
- `/agent/trials` - Trial management ✅
- `/agent/recruitment` - Recruitment funnel ⚠️ (localStorage only)
- `/agent/scouts` - Scouts management ⚠️ (needs verification)
- `/agent/settings` - Settings page ✅
- `/agent/verification` - Verification upload ⚠️ (UI only, no backend)

### Academy Pages (`/academy/`)
- `/academy/login` - Academy login ✅
- `/academy/register` - Academy registration ✅
- `/academy/dashboard` - Dashboard ✅
- `/academy/players` - Player/squad management ✅
- `/academy/tournaments` - Tournament management ✅
- `/academy/analytics` - Analytics dashboard ⚠️ (mock data)
- `/academy/partnerships` - Partnerships page ✅
- `/academy/squads` - Squad management ✅
- `/academy/verification` - Verification upload ⚠️ (UI only, no backend)

### Admin Pages (`/admin/`)
- `/admin/login` - Admin login ⚠️ (page exists, needs auth)
- `/admin/dashboard` - Admin dashboard ⚠️ (UI only, no functionality)
- `/admin/users` - User management ⚠️ (UI only, no API)
- `/admin/verifications` - Verification management ⚠️ (UI only)
- `/admin/analytics` - Analytics ⚠️ (UI only)
- `/admin/agency-dashboard` - Agency dashboard ⚠️ (UI only)

### Shared Pages
- `/messaging` - Global messaging page ✅
- `/notifications` - Notifications page ✅
- `/portfolio/[userId]` - Public portfolio view ✅

---

## 🧩 Components

### Layout Components (`components/layout/`)
- `sidebar.tsx` - Collapsible sidebar navigation ✅
- `header.tsx` - Top header with user info ✅
- `collapsible-sidebar.tsx` - Sidebar wrapper ✅

### UI Components (`components/ui/`)
- `button.tsx` - Button component ✅
- `input.tsx` - Input component ✅
- `modal.tsx` - Modal component ✅

### Other Components
- `ErrorBoundary.tsx` - Error boundary ✅
- `LoadingSkeleton.tsx` - Loading skeleton ✅
- `providers.tsx` - React providers ✅
- `icons.tsx` - Icon components ✅
- `auth/logout-button.tsx` - Logout button ✅

---

## ✅ Feature Status

### Fully Implemented (✅)

1. **Authentication System**
   - Login/Register for all roles
   - NextAuth.js integration
   - Session management
   - Password hashing (bcryptjs)

2. **User Profiles**
   - Profile creation/editing
   - Profile data storage (JSON)
   - Profile strength meter
   - Public portfolio view

3. **Trials & Applications**
   - Trial creation (Academy)
   - Trial browsing (Player)
   - Application submission
   - Application status tracking
   - Payment requirement check

4. **Messaging**
   - Direct messaging between users
   - Real-time polling (5s)
   - Message history
   - Conversation view

5. **Notifications**
   - Notification creation
   - Real-time polling (30s)
   - Mark as read
   - Unread count

6. **Player Search**
   - Search by name
   - Filter by position
   - Filter by age
   - Filter by contract status
   - Database-backed results

7. **Academy Features**
   - Player/squad management
   - Tournament creation
   - Basic analytics

8. **UI/UX**
   - Responsive design
   - Loading states
   - Error boundaries
   - Toast notifications

### Partially Implemented (⚠️)

1. **Content Upload**
   - YouTube integration ✅
   - Video URL parsing ✅
   - Certificates/Achievements UI ✅
   - Backend storage ❌

2. **Payments**
   - Payment structure ✅
   - Invoice display ✅
   - Payment tracking ✅
   - Stripe integration ❌

3. **Player Search**
   - Missing nationality filter ❌

4. **Shortlist**
   - Frontend UI ✅
   - localStorage persistence ✅
   - Backend API ❌

5. **Recruitment Funnel**
   - UI exists ✅
   - localStorage persistence ✅
   - Backend API ❌

6. **Verification**
   - Upload UI ✅
   - Backend processing ❌
   - Document storage ❌

7. **Analytics**
   - Basic structure ✅
   - Mock data ⚠️
   - Real tracking ❌

8. **Admin System**
   - Pages exist ✅
   - Authentication ❌
   - API endpoints ❌
   - Functionality ❌

### Not Implemented (❌)

1. **Agency Mediation Layer**
   - No moderation system
   - No connection facilitation
   - Direct messaging only
   - No agency approval workflow

2. **Security Features**
   - Email verification ❌
   - Phone verification ❌
   - Role-based access control (partial) ❌

3. **Analytics & Tracking**
   - Scout view tracking ❌
   - Profile view analytics ❌
   - Connection tracking ❌

4. **File Upload Backend**
   - Document upload processing ❌
   - S3/R2 integration ❌
   - Certificate storage ❌

5. **Payment Processing**
   - Stripe integration ❌
   - Payment gateway ❌

---

## 📝 Implementation Checklist

### Critical (Priority 1)

- [ ] **Admin Authentication**
  - [ ] Admin login functionality
  - [ ] Admin route protection
  - [ ] Admin API endpoints
  - [ ] Role-based middleware

- [ ] **Agency Mediation Layer**
  - [ ] Agency moderation system
  - [ ] Connection facilitation workflow
  - [ ] Message moderation
  - [ ] Agency approval system

- [ ] **Email/Phone Verification**
  - [ ] Email verification on registration
  - [ ] Phone verification
  - [ ] Verification status tracking
  - [ ] Resend verification

- [ ] **Backend Persistence**
  - [ ] Shortlist API (GET, POST, DELETE)
  - [ ] Recruitment funnel API
  - [ ] Move from localStorage to database

- [ ] **Document Upload Backend**
  - [ ] File upload processing
  - [ ] S3/R2 integration
  - [ ] Document verification workflow
  - [ ] Certificate/achievement storage

### Important (Priority 2)

- [ ] **Player Search Enhancement**
  - [ ] Add nationality filter
  - [ ] Improve search performance
  - [ ] Add more filter options

- [ ] **Payment Processing**
  - [ ] Stripe integration
  - [ ] Payment webhooks
  - [ ] Payment status updates
  - [ ] Refund handling

- [ ] **Analytics & Tracking**
  - [ ] Scout view tracking
  - [ ] Profile view analytics
  - [ ] Connection tracking
  - [ ] Real-time analytics updates

- [ ] **Content Upload Backend**
  - [ ] Certificate upload storage
  - [ ] Achievement upload storage
  - [ ] File validation
  - [ ] Thumbnail generation

### Enhancement (Priority 3)

- [ ] **Real-time Improvements**
  - [ ] WebSocket implementation
  - [ ] Replace polling with WebSocket
  - [ ] Real-time notifications

- [ ] **Advanced Analytics**
  - [ ] Detailed analytics dashboard
  - [ ] Export functionality
  - [ ] Custom date ranges

- [ ] **Performance Optimization**
  - [ ] Database indexing
  - [ ] Query optimization
  - [ ] Caching strategy
  - [ ] Image optimization

- [ ] **Testing**
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] E2E tests
  - [ ] Test coverage

---

## ❌ Missing Features

### Security & Access Control

1. **Email Verification**
   - No email verification on registration
   - No verification status check
   - No resend verification

2. **Phone Verification**
   - No phone verification system
   - No SMS integration

3. **Role-based Access Control**
   - Players can directly see contacts
   - No agency mediation required
   - Admin routes not protected

4. **Admin System**
   - Admin login page exists but no functionality
   - No admin authentication
   - No admin API endpoints
   - No role-based protection

### Agency Features

1. **Agency Mediation**
   - No moderation layer
   - No connection facilitation
   - Direct messaging without mediation
   - No agency approval workflow

2. **Connection Management**
   - No connection tracking
   - No agency-facilitated connections
   - No connection history

### Backend Persistence

1. **Shortlist**
   - Stored in localStorage only
   - No backend API
   - Not synced across devices

2. **Recruitment Funnel**
   - Stored in localStorage only
   - No backend API
   - No persistence

### File Uploads

1. **Document Upload**
   - UI exists but no backend processing
   - No file storage integration
   - No document verification workflow

2. **Certificate/Achievement Upload**
   - UI exists but no backend storage
   - No file validation
   - No thumbnail generation

### Payment Processing

1. **Stripe Integration**
   - Payment structure exists
   - No Stripe integration
   - No payment webhooks
   - Mock payment system only

### Analytics & Tracking

1. **Scout View Tracking**
   - No profile view tracking
   - No analytics for players
   - No view history

2. **Connection Analytics**
   - No connection tracking
   - No relationship analytics

### Search & Filtering

1. **Nationality Filter**
   - Missing from agent player search
   - Other filters work

---

## 📊 Completion Summary

| Category | Status | Completion |
|----------|--------|------------|
| Authentication | ✅ Complete | 100% |
| User Profiles | ✅ Complete | 100% |
| Trials & Applications | ✅ Complete | 100% |
| Messaging | ✅ Complete | 100% |
| Notifications | ✅ Complete | 100% |
| Player Search | ⚠️ Partial | 80% |
| Academy Features | ✅ Complete | 100% |
| Admin System | ❌ Missing | 10% |
| Agency Mediation | ❌ Missing | 0% |
| File Uploads | ⚠️ Partial | 30% |
| Payments | ⚠️ Partial | 40% |
| Analytics | ⚠️ Partial | 50% |
| Security | ⚠️ Partial | 40% |

**Overall System Completion: ~70%**

---

## 🔄 Next Steps

1. **Immediate Actions:**
   - Review and verify all API endpoints
   - Test all user flows
   - Complete testing checklist

2. **Priority 1 Implementation:**
   - Admin authentication system
   - Agency mediation layer
   - Email verification
   - Backend persistence for shortlist/funnel

3. **Priority 2 Implementation:**
   - Stripe payment integration
   - Document upload backend
   - Scout view tracking
   - Nationality filter

4. **Priority 3 Enhancements:**
   - WebSocket for real-time
   - Advanced analytics
   - Performance optimization
   - Comprehensive testing

---

**Document Generated:** System Index  
**Status:** Ready for review and implementation planning


