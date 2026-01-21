'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, Category } from './types';

// Mock initial data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Neon Dreams Hoodie',
    description: 'Oversized hoodie with neon accents',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
    category: 'hoodies',
    inStock: true,
    tags: ['streetwear', 'oversized'],
  },
  {
    id: '2',
    name: 'Cyber Punk Tee',
    description: 'Graphic tee with cyberpunk vibes',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    category: 'tees',
    inStock: true,
    tags: ['graphic', 'limited'],
  },
  {
    id: '3',
    name: 'Vapor Wave Jacket',
    description: 'Retro-futuristic bomber jacket',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    category: 'jackets',
    inStock: true,
    tags: ['retro', 'premium'],
  },
];

const initialCategories: Category[] = [
  {
    id: 'hoodies',
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Cozy oversized hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
  },
  {
    id: 'tees',
    name: 'T-Shirts',
    slug: 'tees',
    description: 'Statement graphic tees',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
  },
  {
    id: 'jackets',
    name: 'Jackets',
    slug: 'jackets',
    description: 'Bold outerwear pieces',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
  },
];

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      { productId: '1', productName: 'Neon Dreams Hoodie', quantity: 1, price: 89.99 },
    ],
    total: 89.99,
    status: 'delivered',
    createdAt: '2026-01-20T10:30:00Z',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [
      { productId: '2', productName: 'Cyber Punk Tee', quantity: 2, price: 90.00 },
      { productId: '3', productName: 'Vapor Wave Jacket', quantity: 1, price: 150.00 },
    ],
    total: 240.00,
    status: 'processing',
    createdAt: '2026-01-21T14:15:00Z',
  },
  {
    id: 'ORD-003',
    customerName: 'Alex Chen',
    customerEmail: 'alex@example.com',
    items: [
      { productId: '1', productName: 'Neon Dreams Hoodie', quantity: 1, price: 89.99 },
    ],
    total: 89.99,
    status: 'pending',
    createdAt: '2026-01-22T09:00:00Z',
  },
];

interface StoreSettings {
  name: string;
  description: string;
  currency: string;
  theme: 'neon' | 'soft' | 'brutal';
  logo?: string;
}

const initialSettings: StoreSettings = {
  name: 'My Store',
  description: 'A Gen-Z fashion destination',
  currency: 'USD',
  theme: 'neon',
};

interface DashboardContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate API delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const addProduct = useCallback(async (product: Omit<Product, 'id'>): Promise<Product> => {
    setIsLoading(true);
    await delay(500); // Simulate network delay
    
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    
    setProducts(prev => [...prev, newProduct]);
    setIsLoading(false);
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    setIsLoading(true);
    await delay(500);
    
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    setIsLoading(false);
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    await delay(300);
    
    setProducts(prev => prev.filter(p => p.id !== id));
    setIsLoading(false);
  }, []);

  const addCategory = useCallback(async (category: Omit<Category, 'id'>): Promise<Category> => {
    setIsLoading(true);
    await delay(500);
    
    const newCategory: Category = {
      ...category,
      id: category.slug,
    };
    
    setCategories(prev => [...prev, newCategory]);
    setIsLoading(false);
    return newCategory;
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    setIsLoading(true);
    await delay(500);
    
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    setIsLoading(false);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    await delay(300);
    
    setCategories(prev => prev.filter(c => c.id !== id));
    setIsLoading(false);
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    setIsLoading(true);
    await delay(500);
    
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setIsLoading(false);
  }, []);

  const updateSettings = useCallback(async (updates: Partial<StoreSettings>) => {
    setIsLoading(true);
    await delay(500);
    
    setSettings(prev => ({ ...prev, ...updates }));
    setIsLoading(false);
  }, []);

  return (
    <DashboardContext.Provider value={{
      products,
      categories,
      orders,
      settings,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      updateOrderStatus,
      updateSettings,
      isLoading,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
