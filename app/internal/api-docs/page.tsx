'use client';

import { useState } from 'react';
import { FileCode, ChevronRight, Lock, Globe, Zap } from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  auth: 'none' | 'required' | 'optional';
  category: string;
  requestBody?: object;
  responseExample?: object;
  queryParams?: { name: string; type: string; description: string }[];
}

const apiEndpoints: ApiEndpoint[] = [
  // Store Public APIs
  {
    method: 'GET',
    path: '/api/store/products',
    description: 'Get all products for the current store (multi-tenant aware)',
    auth: 'none',
    category: 'Storefront',
    queryParams: [
      { name: 'category', type: 'string', description: 'Filter by category slug' },
      { name: 'search', type: 'string', description: 'Search products by name/description' },
    ],
    responseExample: {
      products: [
        { id: 'uuid', name: 'Product Name', price: 99.99, images: ['url1', 'url2'] }
      ]
    },
  },
  {
    method: 'GET',
    path: '/api/store/categories',
    description: 'Get all categories for the current store',
    auth: 'none',
    category: 'Storefront',
    responseExample: {
      categories: [
        { id: 'uuid', name: 'Category', slug: 'category', image_url: 'url' }
      ]
    },
  },
  {
    method: 'GET',
    path: '/api/store/config',
    description: 'Get store configuration (theme, currency, etc.)',
    auth: 'none',
    category: 'Storefront',
    responseExample: {
      name: 'Store Name',
      theme: 'neon',
      currency: 'USD',
      currencySymbol: '$',
    },
  },
  // Store Management APIs
  {
    method: 'GET',
    path: '/api/stores',
    description: 'Get all stores owned by the authenticated user',
    auth: 'required',
    category: 'Store Management',
    responseExample: {
      stores: [{ id: 'uuid', name: 'My Store', slug: 'my-store' }]
    },
  },
  {
    method: 'POST',
    path: '/api/stores',
    description: 'Create a new store',
    auth: 'required',
    category: 'Store Management',
    requestBody: {
      name: 'My New Store',
      slug: 'my-new-store',
      tagline: 'Optional tagline',
      theme: 'neon',
      currency: 'USD',
      currencySymbol: '$',
    },
    responseExample: {
      id: 'uuid',
      name: 'My New Store',
      slug: 'my-new-store',
      created_at: '2024-01-01T00:00:00Z',
    },
  },
  // Dashboard APIs
  {
    method: 'GET',
    path: '/api/dashboard/products',
    description: 'Get all products for the merchant dashboard (with edit permissions)',
    auth: 'required',
    category: 'Dashboard',
    responseExample: {
      products: [
        { id: 'uuid', name: 'Product', price: 99.99, in_stock: true, is_active: true }
      ]
    },
  },
  {
    method: 'POST',
    path: '/api/dashboard/products',
    description: 'Create a new product',
    auth: 'required',
    category: 'Dashboard',
    requestBody: {
      name: 'New Product',
      description: 'Product description',
      price: 99.99,
      compare_at_price: 129.99,
      images: ['url1', 'url2'],
      category_id: 'uuid',
      tags: ['new', 'featured'],
      in_stock: true,
    },
  },
  {
    method: 'PUT',
    path: '/api/dashboard/products/[id]',
    description: 'Update an existing product',
    auth: 'required',
    category: 'Dashboard',
    requestBody: {
      name: 'Updated Name',
      price: 89.99,
    },
  },
  {
    method: 'DELETE',
    path: '/api/dashboard/products/[id]',
    description: 'Delete a product',
    auth: 'required',
    category: 'Dashboard',
  },
  {
    method: 'GET',
    path: '/api/dashboard/categories',
    description: 'Get all categories for the merchant dashboard',
    auth: 'required',
    category: 'Dashboard',
  },
  {
    method: 'POST',
    path: '/api/dashboard/categories',
    description: 'Create a new category',
    auth: 'required',
    category: 'Dashboard',
    requestBody: {
      name: 'New Category',
      slug: 'new-category',
      description: 'Category description',
      image_url: 'https://...',
    },
  },
  {
    method: 'GET',
    path: '/api/dashboard/orders',
    description: 'Get all orders for the store',
    auth: 'required',
    category: 'Dashboard',
    queryParams: [
      { name: 'status', type: 'string', description: 'Filter by order status' },
      { name: 'limit', type: 'number', description: 'Number of orders to return' },
      { name: 'offset', type: 'number', description: 'Pagination offset' },
    ],
  },
  {
    method: 'PATCH',
    path: '/api/dashboard/orders/[id]',
    description: 'Update order status',
    auth: 'required',
    category: 'Dashboard',
    requestBody: {
      status: 'shipped',
      notes: 'Shipped via FedEx',
    },
  },
  {
    method: 'GET',
    path: '/api/dashboard/settings',
    description: 'Get store settings',
    auth: 'required',
    category: 'Dashboard',
  },
  {
    method: 'PUT',
    path: '/api/dashboard/settings',
    description: 'Update store settings',
    auth: 'required',
    category: 'Dashboard',
    requestBody: {
      name: 'Updated Store Name',
      theme: 'soft',
      announcement: 'New announcement!',
    },
  },
  // Legacy APIs
  {
    method: 'POST',
    path: '/api/stores/[storeId]/sync',
    description: 'Trigger Google Sheets sync (legacy)',
    auth: 'required',
    category: 'Legacy',
  },
  {
    method: 'POST',
    path: '/api/refresh',
    description: 'Clear cache and refresh data',
    auth: 'none',
    category: 'Utility',
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/20 text-green-400 border-green-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PATCH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(apiEndpoints.map(e => e.category))];
  
  const filteredEndpoints = selectedCategory === 'all' 
    ? apiEndpoints 
    : apiEndpoints.filter(e => e.category === selectedCategory);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FileCode className="w-8 h-8" />
          API Documentation
        </h1>
        <p className="text-zinc-400">
          Complete REST API reference for Kriya platform.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Endpoints List */}
      <div className="space-y-2">
        {filteredEndpoints.map((endpoint, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden"
          >
            {/* Endpoint Header */}
            <button
              onClick={() => setSelectedEndpoint(
                selectedEndpoint?.path === endpoint.path ? null : endpoint
              )}
              className="w-full px-4 py-3 flex items-center gap-4 hover:bg-zinc-800/50 transition-colors"
            >
              {/* Method Badge */}
              <span className={`px-2 py-1 rounded text-xs font-mono font-bold border ${methodColors[endpoint.method]}`}>
                {endpoint.method}
              </span>
              
              {/* Path */}
              <span className="font-mono text-sm text-white flex-1 text-left">
                {endpoint.path}
              </span>

              {/* Auth Badge */}
              {endpoint.auth === 'required' ? (
                <span className="flex items-center gap-1 text-xs text-yellow-400">
                  <Lock size={12} />
                  Auth
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <Globe size={12} />
                  Public
                </span>
              )}

              {/* Expand Icon */}
              <ChevronRight 
                className={`w-4 h-4 text-zinc-500 transition-transform ${
                  selectedEndpoint?.path === endpoint.path ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Expanded Details */}
            {selectedEndpoint?.path === endpoint.path && (
              <div className="px-4 py-4 border-t border-zinc-800 bg-zinc-950/50">
                <p className="text-zinc-300 mb-4">{endpoint.description}</p>

                {/* Query Parameters */}
                {endpoint.queryParams && endpoint.queryParams.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Query Parameters</h4>
                    <div className="bg-zinc-900 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-zinc-800/50">
                            <th className="px-3 py-2 text-left text-zinc-400">Name</th>
                            <th className="px-3 py-2 text-left text-zinc-400">Type</th>
                            <th className="px-3 py-2 text-left text-zinc-400">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.queryParams.map((param) => (
                            <tr key={param.name} className="border-t border-zinc-800">
                              <td className="px-3 py-2 font-mono text-cyan-400">{param.name}</td>
                              <td className="px-3 py-2 text-zinc-400">{param.type}</td>
                              <td className="px-3 py-2 text-zinc-300">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {endpoint.requestBody && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Request Body</h4>
                    <pre className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-300 font-mono overflow-x-auto">
                      {JSON.stringify(endpoint.requestBody, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Response Example */}
                {endpoint.responseExample && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Response Example</h4>
                    <pre className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-300 font-mono overflow-x-auto">
                      {JSON.stringify(endpoint.responseExample, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Try it section */}
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Zap size={12} />
                    <span>Base URL: <code className="text-zinc-400">https://your-domain.com</code></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Authentication Info */}
      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Authentication</h2>
        <div className="space-y-4 text-sm text-zinc-300">
          <p>
            <strong className="text-white">Public endpoints</strong> (marked with <Globe className="inline w-3 h-3 text-green-400" />) 
            can be accessed without authentication.
          </p>
          <p>
            <strong className="text-white">Protected endpoints</strong> (marked with <Lock className="inline w-3 h-3 text-yellow-400" />) 
            require a valid Supabase session. The user must be authenticated and own the store being accessed.
          </p>
          <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs">
            <p className="text-zinc-500"># Authentication is handled via Supabase cookies</p>
            <p className="text-zinc-500"># No explicit Authorization header needed for browser requests</p>
            <p className="text-zinc-500"># For API access, use Supabase client SDK</p>
          </div>
        </div>
      </div>
    </div>
  );
}
