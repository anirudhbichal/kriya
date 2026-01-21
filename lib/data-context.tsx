'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, StoreConfig } from './types';
import { mockProducts, mockCategories, mockStoreConfig } from './mock-data';

interface DataContextType {
  products: Product[];
  categories: Category[];
  storeConfig: StoreConfig;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(mockStoreConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsRes, categoriesRes, configRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/config'),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.length > 0) setProducts(productsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        if (categoriesData.length > 0) setCategories(categoriesData);
      }

      if (configRes.ok) {
        const configData = await configRes.json();
        if (configData.name) setStoreConfig(configData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      // Keep using mock data on error
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      await fetch('/api/refresh', { method: 'POST' });
      await fetchAllData();
    } catch (err) {
      console.error('Error refreshing:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        storeConfig,
        loading,
        error,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
