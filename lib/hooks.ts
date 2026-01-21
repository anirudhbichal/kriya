'use client';

import { useState, useEffect } from 'react';
import { Product, Category, StoreConfig } from './types';
import { mockProducts, mockCategories, mockStoreConfig } from './mock-data';

// Hook to fetch products
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Keep using mock data on error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { products, loading, error };
}

// Hook to fetch categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { categories, loading, error };
}

// Hook to fetch store config
export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig>(mockStoreConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error('Failed to fetch config');
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.error('Error fetching config:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { config, loading, error };
}

// Hook to refresh data
export function useRefreshData() {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/refresh', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to refresh');
      // Reload the page to get fresh data
      window.location.reload();
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return { refresh, refreshing };
}

// Hook to fetch a single product by ID
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await res.json();
        const found = data.find(p => p.id === id);
        setProduct(found || null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Try mock data
        const mock = mockProducts.find(p => p.id === id);
        setProduct(mock || null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return { product, loading, error };
}

// Hook to fetch products by category
export function useProductsByCategory(categorySlug: string) {
  const { products, loading, error } = useProducts();
  const filtered = products.filter(p => p.category === categorySlug);
  return { products: filtered, loading, error };
}
