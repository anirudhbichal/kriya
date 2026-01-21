// Mock data - will be replaced with Google Sheets integration
import { Product, StoreConfig, Category } from './types';

export const mockStoreConfig: StoreConfig = {
  name: 'KRIYA',
  tagline: 'Curated for the culture',
  theme: 'neon',
  currency: 'USD',
  currencySymbol: '$',
  announcement: '🔥 FREE SHIPPING ON ORDERS OVER $50',
  socialLinks: {
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    tiktok: 'https://tiktok.com',
  },
};

export const mockCategories: Category[] = [
  { id: '1', name: 'Apparel', slug: 'apparel', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop' },
  { id: '2', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop' },
  { id: '3', name: 'Tech', slug: 'tech', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
  { id: '4', name: 'Home', slug: 'home', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Oversized Graphic Tee',
    description: 'Premium cotton oversized tee with exclusive print. Made for comfort and style.',
    price: 45,
    compareAtPrice: 60,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
    ],
    category: 'apparel',
    tags: ['new', 'bestseller'],
    inStock: true,
    variants: [
      { id: 'size', name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { id: 'color', name: 'Color', options: ['Black', 'White', 'Sage'] },
    ],
  },
  {
    id: '2',
    name: 'Retro Sneakers',
    description: 'Y2K-inspired chunky sneakers. The perfect blend of comfort and street style.',
    price: 129,
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=800&fit=crop',
    ],
    category: 'accessories',
    tags: ['trending'],
    inStock: true,
    variants: [
      { id: 'size', name: 'Size', options: ['7', '8', '9', '10', '11', '12'] },
    ],
  },
  {
    id: '3',
    name: 'Minimal Watch',
    description: 'Clean design meets precision. Japanese movement with genuine leather strap.',
    price: 189,
    compareAtPrice: 220,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop',
    ],
    category: 'accessories',
    tags: ['premium'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Wireless Earbuds Pro',
    description: 'Immersive sound. Active noise cancellation. 24hr battery life.',
    price: 149,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=800&fit=crop',
    ],
    category: 'tech',
    tags: ['bestseller'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Ceramic Vase Set',
    description: 'Handcrafted ceramic vases. Set of 3 with unique organic shapes.',
    price: 78,
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&h=800&fit=crop',
    ],
    category: 'home',
    tags: ['new'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Cargo Pants',
    description: 'Utilitarian vibes. Multiple pockets. Relaxed fit for all-day comfort.',
    price: 89,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
    ],
    category: 'apparel',
    tags: ['trending'],
    inStock: true,
    variants: [
      { id: 'size', name: 'Size', options: ['28', '30', '32', '34', '36'] },
      { id: 'color', name: 'Color', options: ['Black', 'Khaki', 'Olive'] },
    ],
  },
  {
    id: '7',
    name: 'LED Desk Lamp',
    description: 'Ambient lighting for your space. Touch control with color temperature adjustment.',
    price: 65,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=800&fit=crop',
    ],
    category: 'home',
    tags: [],
    inStock: true,
  },
  {
    id: '8',
    name: 'Canvas Tote Bag',
    description: 'Heavy-duty canvas tote. Perfect for everyday carry.',
    price: 35,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop',
    ],
    category: 'accessories',
    tags: ['bestseller'],
    inStock: false,
  },
];
