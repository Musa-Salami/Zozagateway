# 🍿 ZozaGateway - Snacks Ordering & Sales Platform

A modern, full-stack web application for a snack production business. Features a beautiful customer storefront for ordering snacks and a powerful admin dashboard for managing products, orders, and sales analytics.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)

---

## Features

### Customer Portal
- Browse snack catalog with filters, search, and categories
- Product detail pages with image galleries and reviews
- Shopping cart with persistent state
- Multi-step checkout flow
- Order tracking and history
- Dark/Light mode toggle
- Fully responsive (mobile-first)

### Admin Dashboard
- Real-time dashboard with revenue charts and statistics
- Product management (CRUD with image upload)
- Order management with status tracking
- Customer management
- Sales analytics with exportable reports
- Category management
- Store settings

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Animations | Framer Motion 12 |
| State | Zustand 5 (cart) + TanStack Query (server) |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL via Prisma 6 |
| Auth | NextAuth.js v5 |
| Charts | Recharts |
| Icons | Lucide React |
| Payments | Stripe |
| Media | Cloudinary |
| Email | Resend + React Email |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 22 LTS)
- **PostgreSQL** database (or use [Supabase](https://supabase.com) free tier)
- **npm** or **pnpm** package manager

### 1. Install Dependencies

```bash
cd app
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/zozagateway"
NEXTAUTH_SECRET="generate-a-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the customer portal.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@zozagateway.com | Admin@123 |
| Customer | customer@example.com | Customer@123 |

---

## Project Structure

```
app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── (storefront)/      # Customer-facing pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui base components
│   │   ├── storefront/        # Customer components
│   │   ├── admin/             # Admin components
│   │   └── shared/            # Shared components
│   ├── lib/                   # Utilities & config
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   └── types/                 # TypeScript types
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed database |

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Docker

```bash
docker-compose up -d
```

---

## License

This project is proprietary to ZozaGateway.

---

Built with ❤️ by the ZozaGateway Team
