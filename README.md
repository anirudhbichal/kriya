# Kriya - E-commerce SaaS Platform

> **Configurable e-commerce websites for merchants, powered by a simple dashboard.**

Kriya lets merchants create beautiful, Gen-Z styled e-commerce stores with zero coding. Each merchant gets their own subdomain and can manage products, categories, and orders through an intuitive dashboard.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           KRIYA ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │    Merchant     │
                         │   Dashboard     │
                         │  /dashboard/*   │
                         └────────┬────────┘
                                  │ CRUD Operations
                                  ▼
┌──────────────┐         ┌─────────────────┐         ┌──────────────────┐
│   Customer   │ ◀─────▶ │   Next.js App   │ ◀─────▶ │    Supabase      │
│   Browser    │  HTTP   │   (Vercel)      │   SQL   │   PostgreSQL     │
└──────────────┘         └────────┬────────┘         └──────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              store1.kriya  store2.kriya  custom-domain.com
              (Subdomain)   (Subdomain)   (Custom Domain)
```

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Merchant   │────▶│  Dashboard  │────▶│   API       │────▶│  Database   │
│  (Browser)  │     │  (React)    │     │  (Next.js)  │     │  (Supabase) │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐            │
│  Customer   │◀────│  Storefront │◀────│  API        │◀───────────┘
│  (Browser)  │     │  (Next.js)  │     │  (Cached)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 📊 Database Schema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              STORES                                      │
│  Primary tenant table - one row per merchant store                       │
├─────────────────────────────────────────────────────────────────────────┤
│  id              UUID        Primary Key                                 │
│  owner_id        UUID        References auth.users (Supabase Auth)       │
│  name            VARCHAR     Store display name                          │
│  slug            VARCHAR     Unique subdomain (store-name.kriya.store)   │
│  custom_domain   VARCHAR     Optional custom domain                      │
│  theme           ENUM        'neon' | 'soft' | 'brutal'                  │
│  currency        VARCHAR     'USD', 'EUR', 'INR', etc.                   │
│  plan            ENUM        'free' | 'starter' | 'pro' | 'enterprise'   │
│  settings        JSONB       Additional configuration                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│      CATEGORIES       │ │       PRODUCTS        │ │        ORDERS         │
├───────────────────────┤ ├───────────────────────┤ ├───────────────────────┤
│ id          UUID      │ │ id           UUID     │ │ id           UUID     │
│ store_id    UUID  FK  │ │ store_id     UUID  FK │ │ store_id     UUID  FK │
│ name        VARCHAR   │ │ category_id  UUID  FK │ │ order_number VARCHAR  │
│ slug        VARCHAR   │ │ name         VARCHAR  │ │ status       ENUM     │
│ image_url   TEXT      │ │ price        DECIMAL  │ │ customer_*   VARCHAR  │
│ sort_order  INT       │ │ images       TEXT[]   │ │ items        JSONB    │
│ is_active   BOOLEAN   │ │ tags         TEXT[]   │ │ total        DECIMAL  │
└───────────────────────┘ │ in_stock     BOOLEAN  │ │ payment_*    VARCHAR  │
                          │ variants     JSONB    │ └───────────────────────┘
                          └───────────────────────┘
```

---

## 🔐 Security Model (Row Level Security)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ROW LEVEL SECURITY                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PUBLIC (Anonymous Users)                                                │
│  ├── Can READ active stores, products, categories                        │
│  └── Can CREATE orders (checkout)                                        │
│                                                                          │
│  AUTHENTICATED (Store Owners)                                            │
│  ├── Can READ/WRITE their own store data                                 │
│  ├── Can MANAGE products, categories in their store                      │
│  └── Can VIEW/UPDATE orders for their store                              │
│                                                                          │
│  SERVICE ROLE (Backend Only)                                             │
│  └── Full access for admin operations                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Multi-Tenant Routing

| Environment | URL Pattern | Resolution |
|-------------|-------------|------------|
| Development | `localhost:3000` | Demo store (mock data) |
| Development | `localhost:3000/store/[slug]` | Store by slug |
| Production | `[slug].kriya.store` | Subdomain → Store |
| Production | `www.kriya.store` | Marketing landing page |
| Production | `custom-domain.com` | Custom domain → Store |

---

## 🎨 Themes

| Theme | Style | Colors | Fonts |
|-------|-------|--------|-------|
| 🌙 **Neon** | Cyberpunk, dark | Black, neon green, magenta | Space Grotesk, Inter |
| 🌸 **Soft** | Minimal, airy | Cream, terracotta, sage | Fraunces, DM Sans |
| ⚡ **Brutal** | Bold, raw | White, orange, blue | Bebas Neue, Work Sans |

---

## 📁 Project Structure

```
kriya/
├── app/
│   ├── (storefront)/          # Public storefront pages
│   │   ├── page.tsx           # Homepage
│   │   ├── product/[id]/      # Product detail
│   │   ├── collections/       # Category pages
│   │   └── cart/              # Shopping cart
│   │
│   ├── dashboard/             # Merchant dashboard
│   │   ├── page.tsx           # Dashboard home
│   │   ├── products/          # Product management
│   │   ├── categories/        # Category management
│   │   ├── orders/            # Order management
│   │   └── settings/          # Store settings
│   │
│   ├── (auth)/                # Authentication
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── internal/              # Internal documentation
│   │   ├── schema/            # Database schema viewer
│   │   └── api-docs/          # API documentation
│   │
│   └── api/                   # API routes
│       ├── auth/              # Authentication endpoints
│       ├── stores/            # Store management
│       ├── products/          # Product CRUD
│       ├── categories/        # Category CRUD
│       └── orders/            # Order management
│
├── components/                # Reusable components
│   ├── ui/                    # Base UI components
│   ├── storefront/            # Storefront components
│   └── dashboard/             # Dashboard components
│
├── lib/
│   ├── supabase/              # Supabase clients
│   ├── types.ts               # TypeScript types
│   ├── themes.ts              # Theme configurations
│   └── utils.ts               # Utility functions
│
└── supabase/
    └── migrations/            # Database migrations
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone and install
git clone https://github.com/yourusername/kriya.git
cd kriya
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run migrations (in Supabase SQL Editor)
# Copy contents of supabase/migrations/001_initial_schema.sql

# Start development server
npm run dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Domain
NEXT_PUBLIC_BASE_DOMAIN=kriya.store

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📖 Internal Documentation

- **Schema Viewer**: `/internal/schema` - Visual database schema
- **API Documentation**: `/internal/api-docs` - All API endpoints

---

## 📈 Scaling Considerations

| Component | Strategy |
|-----------|----------|
| Database | Supabase auto-scales, add read replicas for high traffic |
| API | Vercel Edge Functions, 60s cache |
| Images | External CDN (Cloudinary, Uploadcare) |
| Search | PostgreSQL full-text search, upgrade to Algolia if needed |

### Capacity Estimates

| Metric | Free Tier | With Optimization |
|--------|-----------|-------------------|
| Stores | 10,000+ | 100,000+ |
| Products/Store | 10,000+ | Unlimited |
| Requests/Month | 500K | 10M+ |

---

## 🛣️ Roadmap

- [x] Multi-tenant architecture
- [x] 3 Gen-Z themes
- [x] Product & category management
- [x] Shopping cart
- [x] Merchant dashboard
- [ ] Payment integration (Stripe)
- [ ] Order notifications (email/SMS)
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Discount codes
- [ ] Custom domain SSL

---

## 📄 License

MIT License - see LICENSE file for details.
