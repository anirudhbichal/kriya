# Environment Setup Guide

This document explains how to set up the environment variables for Kriya.

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ================================
# SUPABASE (Required for database)
# ================================

# Get these from your Supabase project settings
# Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service role key (for admin operations like sync)
# Keep this secret! Never expose in client-side code
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ================================
# GOOGLE SHEETS (Required for sync)
# ================================

# Get from Google Cloud Console > APIs & Services > Credentials
GOOGLE_SHEETS_API_KEY=your-google-api-key-here

# ================================
# DOMAIN CONFIGURATION
# ================================

# Your base domain for the SaaS (subdomains will be: store.yourdomain.com)
NEXT_PUBLIC_BASE_DOMAIN=kriya.store

# ================================
# OPTIONAL
# ================================

# Cache duration in seconds (default: 60)
CACHE_DURATION=60
```

---

## Step-by-Step Setup

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Go to **Project Settings** > **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

5. Run the database migration:
   - Go to **SQL Editor** in Supabase
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Run the SQL

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Enable **Google Sheets API**:
   - Go to **APIs & Services** > **Library**
   - Search "Google Sheets API"
   - Click **Enable**
4. Create API Key:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **API Key**
   - Copy the key → `GOOGLE_SHEETS_API_KEY`
5. (Optional) Restrict the API key to Google Sheets API only

### 3. Domain Setup (Production)

For production deployment with custom domains:

1. Deploy to Vercel
2. Add your domain (e.g., `kriya.store`)
3. Add wildcard domain `*.kriya.store` for subdomains
4. Set `NEXT_PUBLIC_BASE_DOMAIN=kriya.store`

For local development, subdomains work via path-based routing:
- `localhost:3000` → Demo store
- `localhost:3000/store/mystore` → Specific store

---

## Database Schema

The database includes these tables:

| Table | Purpose |
|-------|---------|
| `stores` | Store/tenant configurations |
| `categories` | Product categories per store |
| `products` | Products with full details |
| `orders` | Customer orders |
| `sync_logs` | Google Sheets sync history |

### Row Level Security (RLS)

- **Public** can view active stores, categories, products
- **Store owners** can manage their own data
- **Orders** are only visible to store owners

---

## Plan Limits

| Plan | Stores | Products | Orders |
|------|--------|----------|--------|
| Free | 1 | 100 | Unlimited |
| Starter | 3 | 1,000 | Unlimited |
| Pro | 10 | 10,000 | Unlimited |
| Enterprise | Unlimited | Unlimited | Unlimited |

---

## Troubleshooting

### "Unauthorized" errors
- Check that your Supabase keys are correct
- Ensure RLS policies are applied (run migration SQL)

### Products not syncing
- Verify Google Sheets API key is valid
- Check that the Google Sheet is publicly readable
- Verify sheet tab names: `Products`, `Categories`, `Config`

### Custom domain not working
- Ensure wildcard DNS is configured
- Check `NEXT_PUBLIC_BASE_DOMAIN` matches your domain
- Verify HTTPS is configured on Vercel/hosting

---

## Next Steps

1. Create a Supabase project
2. Run the database migration
3. Set up environment variables
4. Deploy to Vercel
5. Add custom domain
6. Invite your first merchant!
