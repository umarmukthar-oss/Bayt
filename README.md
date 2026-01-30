# Bayt Shawarma's — Halal 🌯

A full-stack shawarma ordering web application built with **Next.js 14+**, **Supabase**, and **Razorpay**.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=flat&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)

## Features

### Customer Features
- 📱 Mobile-first responsive design
- 🍖 Browse menu with real-time stock status
- 🛒 Add to cart with quantity selection
- 💰 Automatic offer/discount application
- 💳 Secure Razorpay payment integration
- 📦 Order tracking with status updates
- 🔐 Phone OTP authentication

### Admin Features
- 📊 Dashboard with real-time stats
- 📦 Inventory management (stock, prices)
- 🏷️ Offer/promotion management
- 📋 Orders list with status updates
- 📥 CSV export for orders
- ⚡ Real-time updates via Supabase

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router), React, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes (Serverless) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Phone OTP |
| Payments | Razorpay |
| Realtime | Supabase Subscriptions |
| Deployment | Vercel |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Razorpay account (test mode)

### 1. Clone and Install

```bash
cd Bayt
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema:
   ```sql
   -- Copy contents of supabase/schema.sql
   ```
3. Run the seed data:
   ```sql
   -- Copy contents of supabase/seed.sql
   ```
4. Enable **Phone Auth** in Authentication → Providers
5. Get your credentials from Settings → API

### 3. Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Generate **Test** API keys
4. Note your Key ID and Key Secret

### 4. Environment Variables

Create `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Phone OTP login
│   ├── checkout/             # Cart & payment
│   ├── track-order/          # Order tracking
│   ├── order/[id]/           # Order confirmation
│   ├── admin/                # Admin dashboard
│   │   ├── inventory/        # Stock management
│   │   ├── offers/           # Offer management
│   │   └── orders/           # Order management
│   └── api/
│       ├── create-order/     # Create Razorpay order
│       └── verify-payment/   # Verify & process payment
├── components/               # Reusable UI components
├── contexts/                 # Auth & Cart contexts
└── lib/
    ├── supabase/             # Supabase clients
    └── types.ts              # TypeScript types
```

## Deployment to Vercel

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Environment Variables on Vercel
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `NEXT_PUBLIC_APP_URL` (your Vercel URL)

## Admin Access

To make a user an admin:

1. User must first log in via phone OTP
2. In Supabase dashboard, go to Table Editor → users
3. Find the user and change `role` from `customer` to `admin`
4. User can now access `/admin`

## Testing Payments

Use Razorpay test cards:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **OTP**: 1234

## Support

Contact: **+91 9080480773**

## License

MIT © Bayt Shawarma's
