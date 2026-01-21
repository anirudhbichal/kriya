// Core types for the e-commerce platform

export type ThemeType = 'neon' | 'soft' | 'brutal';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  image?: string; // Single image for simplified dashboard
  category: string;
  tags: string[];
  inStock: boolean;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
  priceModifier?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface StoreConfig {
  name: string;
  tagline: string;
  theme: ThemeType;
  logo?: string;
  currency: string;
  currencySymbol: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  announcement?: string;
  googleSheetId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}
