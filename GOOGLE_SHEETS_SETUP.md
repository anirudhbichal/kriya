# Google Sheets Setup Guide

This guide explains how to set up your Google Sheet to power your Kriya store.

## 📋 Sheet Structure

Your Google Sheet needs **3 tabs** (sheets):

### 1. `Products` Tab

| Column | Field | Required | Example |
|--------|-------|----------|---------|
| A | id | ✅ | `prod-001` |
| B | name | ✅ | `Oversized Graphic Tee` |
| C | description | | `Premium cotton oversized tee with exclusive print` |
| D | price | ✅ | `45` |
| E | compareAtPrice | | `60` (for showing discounts) |
| F | images | ✅ | `https://example.com/img1.jpg, https://example.com/img2.jpg` |
| G | category | ✅ | `apparel` (must match category slug) |
| H | tags | | `new, bestseller, trending` (comma-separated) |
| I | inStock | | `true` or `false` (default: true) |

**Example Row:**
```
prod-001 | Oversized Graphic Tee | Premium cotton tee | 45 | 60 | https://images.unsplash.com/photo-xxx | apparel | new, bestseller | true
```

### 2. `Categories` Tab

| Column | Field | Required | Example |
|--------|-------|----------|---------|
| A | id | ✅ | `cat-001` |
| B | name | ✅ | `Apparel` |
| C | slug | ✅ | `apparel` (URL-friendly, lowercase) |
| D | image | | `https://example.com/category-img.jpg` |

**Example Row:**
```
cat-001 | Apparel | apparel | https://images.unsplash.com/photo-xxx
```

### 3. `Config` Tab

This tab uses key-value pairs (2 columns):

| Key | Value | Description |
|-----|-------|-------------|
| name | `My Store` | Store name shown in header |
| tagline | `Curated for you` | Tagline shown in footer |
| theme | `neon` | Theme: `neon`, `soft`, or `brutal` |
| currency | `USD` | Currency code |
| currencySymbol | `$` | Currency symbol |
| announcement | `🔥 Free shipping over $50` | Top banner text |
| instagram | `https://instagram.com/mystore` | Social link |
| twitter | `https://twitter.com/mystore` | Social link |
| tiktok | `https://tiktok.com/@mystore` | Social link |

---

## 🔧 Setup Steps

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Create 3 tabs: `Products`, `Categories`, `Config`
4. Add headers in row 1, data starting from row 2

### Step 2: Make Sheet Public

1. Click **Share** button (top-right)
2. Click **Change to anyone with the link**
3. Set permission to **Viewer**
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID_HERE]/edit
   ```

### Step 3: Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Library**
4. Search for "Google Sheets API" and enable it
5. Go to **APIs & Services** → **Credentials**
6. Click **Create Credentials** → **API Key**
7. Copy your API key

### Step 4: Configure Your Store

Create a `.env.local` file in your project root:

```env
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEET_ID=your_sheet_id_here
CACHE_DURATION=60
```

### Step 5: Restart Your Server

```bash
npm run dev
```

---

## 📝 Tips

### Images
- Use direct image URLs (ending in .jpg, .png, etc.)
- For multiple images, separate with commas
- Recommended: Use Unsplash, Cloudinary, or your own CDN
- Image aspect ratio: 3:4 for products, 1:1 for categories

### Tags
- `new` - Shows "New" badge
- `bestseller` - Featured in "Featured Picks"
- `trending` - Shows in "Trending Now" section

### Refreshing Data
- Data is cached for 60 seconds by default
- To force refresh, call: `POST /api/refresh`
- Or restart the server

---

## 🚀 Sample Sheet Template

Copy this template to get started quickly:
[Google Sheet Template](https://docs.google.com/spreadsheets/d/YOUR_TEMPLATE_ID/copy)

---

## ❓ Troubleshooting

### Products not showing?
1. Check Sheet is public
2. Verify Sheet ID is correct
3. Check API key is valid
4. Ensure tab names match exactly: `Products`, `Categories`, `Config`

### Images not loading?
1. Add the image domain to `next.config.ts`:
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'your-image-domain.com' },
  ],
}
```

### Data not updating?
- Wait for cache to expire (60 seconds)
- Or call `POST /api/refresh` to force refresh
