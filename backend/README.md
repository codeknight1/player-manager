# PPM Backend

Express + Prisma + PostgreSQL backend service.

Getting started:
1. Install deps: `npm install`
2. Ensure a local PostgreSQL instance is running (default port 5432)
3. Set env: `DATABASE_URL=postgresql://<user>:<password>@localhost:5432/ppm?schema=public`
4. Generate client: `npm run db:generate`
5. Push schema: `npm run db:push`
6. Seed: `npm run db:seed`
7. Run dev server: `npm run dev` (http://localhost:4000)

Routes are mounted under `/api/*` and mirror the frontend's previous Next.js API routes.


