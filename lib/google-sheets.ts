import { google } from 'googleapis';
import { Product, StoreConfig, Category, ThemeType } from './types';

// Simple in-memory cache
let cache: {
  products?: { data: Product[]; timestamp: number };
  config?: { data: StoreConfig; timestamp: number };
  categories?: { data: Category[]; timestamp: number };
} = {};

const CACHE_DURATION = parseInt(process.env.CACHE_DURATION || '60') * 1000; // Convert to ms

function isCacheValid(timestamp: number | undefined): boolean {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
}

// Initialize Google Sheets API
function getSheets() {
  return google.sheets({
    version: 'v4',
    auth: process.env.GOOGLE_SHEETS_API_KEY,
  });
}

// Parse a row into a Product object
function parseProductRow(row: string[], index: number): Product | null {
  // Expected columns: id, name, description, price, compareAtPrice, images (comma-separated), category, tags (comma-separated), inStock
  if (!row[0] || !row[1]) return null;
  
  return {
    id: row[0] || `product-${index}`,
    name: row[1] || 'Untitled Product',
    description: row[2] || '',
    price: parseFloat(row[3]) || 0,
    compareAtPrice: row[4] ? parseFloat(row[4]) : undefined,
    images: row[5] ? row[5].split(',').map(url => url.trim()) : [],
    category: row[6] || 'uncategorized',
    tags: row[7] ? row[7].split(',').map(tag => tag.trim().toLowerCase()) : [],
    inStock: row[8]?.toLowerCase() !== 'false',
    // Variants would need a more complex structure - keeping simple for MVP
  };
}

// Parse a row into a Category object
function parseCategoryRow(row: string[]): Category | null {
  if (!row[0] || !row[1]) return null;
  
  return {
    id: row[0],
    name: row[1],
    slug: row[2] || row[1].toLowerCase().replace(/\s+/g, '-'),
    image: row[3] || undefined,
  };
}

// Parse store config from sheet
function parseStoreConfig(rows: string[][]): StoreConfig {
  const config: Record<string, string> = {};
  
  rows.forEach(row => {
    if (row[0] && row[1]) {
      config[row[0]] = row[1];
    }
  });
  
  return {
    name: config['name'] || 'My Store',
    tagline: config['tagline'] || 'Welcome to our store',
    theme: (config['theme'] as ThemeType) || 'neon',
    logo: config['logo'] || undefined,
    currency: config['currency'] || 'USD',
    currencySymbol: config['currencySymbol'] || '$',
    announcement: config['announcement'] || undefined,
    socialLinks: {
      instagram: config['instagram'] || undefined,
      twitter: config['twitter'] || undefined,
      tiktok: config['tiktok'] || undefined,
    },
    googleSheetId: process.env.GOOGLE_SHEET_ID,
  };
}

// Fetch products from Google Sheets
export async function fetchProducts(): Promise<Product[]> {
  // Check cache first
  if (isCacheValid(cache.products?.timestamp)) {
    return cache.products!.data;
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  if (!sheetId || !apiKey) {
    console.warn('Google Sheets not configured, using mock data');
    const { mockProducts } = await import('./mock-data');
    return mockProducts;
  }

  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Products!A2:I', // Skip header row
    });

    const rows = response.data.values || [];
    const products = rows
      .map((row, index) => parseProductRow(row, index))
      .filter((p): p is Product => p !== null);

    // Update cache
    cache.products = { data: products, timestamp: Date.now() };
    
    return products;
  } catch (error) {
    console.error('Error fetching products from Google Sheets:', error);
    // Fallback to mock data
    const { mockProducts } = await import('./mock-data');
    return mockProducts;
  }
}

// Fetch categories from Google Sheets
export async function fetchCategories(): Promise<Category[]> {
  // Check cache first
  if (isCacheValid(cache.categories?.timestamp)) {
    return cache.categories!.data;
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  if (!sheetId || !apiKey) {
    console.warn('Google Sheets not configured, using mock data');
    const { mockCategories } = await import('./mock-data');
    return mockCategories;
  }

  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Categories!A2:D', // Skip header row
    });

    const rows = response.data.values || [];
    const categories = rows
      .map(row => parseCategoryRow(row))
      .filter((c): c is Category => c !== null);

    // Update cache
    cache.categories = { data: categories, timestamp: Date.now() };
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories from Google Sheets:', error);
    // Fallback to mock data
    const { mockCategories } = await import('./mock-data');
    return mockCategories;
  }
}

// Fetch store config from Google Sheets
export async function fetchStoreConfig(): Promise<StoreConfig> {
  // Check cache first
  if (isCacheValid(cache.config?.timestamp)) {
    return cache.config!.data;
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  if (!sheetId || !apiKey) {
    console.warn('Google Sheets not configured, using mock data');
    const { mockStoreConfig } = await import('./mock-data');
    return mockStoreConfig;
  }

  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Config!A2:B', // Skip header row
    });

    const rows = response.data.values || [];
    const config = parseStoreConfig(rows);

    // Update cache
    cache.config = { data: config, timestamp: Date.now() };
    
    return config;
  } catch (error) {
    console.error('Error fetching config from Google Sheets:', error);
    // Fallback to mock data
    const { mockStoreConfig } = await import('./mock-data');
    return mockStoreConfig;
  }
}

// Clear cache (useful for forcing refresh)
export function clearCache() {
  cache = {};
}

// Fetch all data at once
export async function fetchAllSheetData() {
  const [products, categories, config] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchStoreConfig(),
  ]);

  return { products, categories, config };
}
