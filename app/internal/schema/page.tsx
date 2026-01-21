'use client';

import { useState } from 'react';
import { Database, Key, Link as LinkIcon, Hash, Calendar, Check, X } from 'lucide-react';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  description: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
}

interface Table {
  name: string;
  description: string;
  columns: Column[];
}

const schema: Table[] = [
  {
    name: 'stores',
    description: 'Primary tenant table - one row per merchant store',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, default: 'uuid_generate_v4()', description: 'Primary key', isPrimary: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Last update timestamp' },
      { name: 'owner_id', type: 'UUID', nullable: false, description: 'References auth.users', isForeign: true, references: 'auth.users(id)' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Store display name' },
      { name: 'slug', type: 'VARCHAR(100)', nullable: false, description: 'Unique subdomain identifier' },
      { name: 'custom_domain', type: 'VARCHAR(255)', nullable: true, description: 'Optional custom domain' },
      { name: 'tagline', type: 'TEXT', nullable: true, description: 'Store tagline/description' },
      { name: 'logo_url', type: 'TEXT', nullable: true, description: 'Logo image URL' },
      { name: 'theme', type: 'ENUM', nullable: false, default: "'neon'", description: "Theme: 'neon' | 'soft' | 'brutal'" },
      { name: 'currency', type: 'VARCHAR(3)', nullable: false, default: "'USD'", description: 'Currency code' },
      { name: 'currency_symbol', type: 'VARCHAR(5)', nullable: false, default: "'$'", description: 'Currency symbol' },
      { name: 'announcement', type: 'TEXT', nullable: true, description: 'Top banner announcement' },
      { name: 'instagram_url', type: 'TEXT', nullable: true, description: 'Instagram link' },
      { name: 'twitter_url', type: 'TEXT', nullable: true, description: 'Twitter/X link' },
      { name: 'tiktok_url', type: 'TEXT', nullable: true, description: 'TikTok link' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'true', description: 'Store active status' },
      { name: 'plan', type: 'ENUM', nullable: false, default: "'free'", description: "Plan: 'free' | 'starter' | 'pro' | 'enterprise'" },
      { name: 'settings', type: 'JSONB', nullable: false, default: "'{}'", description: 'Additional settings JSON' },
    ],
  },
  {
    name: 'categories',
    description: 'Product categories for each store',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, default: 'uuid_generate_v4()', description: 'Primary key', isPrimary: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Last update timestamp' },
      { name: 'store_id', type: 'UUID', nullable: false, description: 'References stores table', isForeign: true, references: 'stores(id)' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Category name' },
      { name: 'slug', type: 'VARCHAR(100)', nullable: false, description: 'URL-friendly identifier' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Category description' },
      { name: 'image_url', type: 'TEXT', nullable: true, description: 'Category image URL' },
      { name: 'sort_order', type: 'INTEGER', nullable: false, default: '0', description: 'Display order' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'true', description: 'Category active status' },
    ],
  },
  {
    name: 'products',
    description: 'Products for each store with full details',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, default: 'uuid_generate_v4()', description: 'Primary key', isPrimary: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Last update timestamp' },
      { name: 'store_id', type: 'UUID', nullable: false, description: 'References stores table', isForeign: true, references: 'stores(id)' },
      { name: 'external_id', type: 'VARCHAR(255)', nullable: true, description: 'External reference ID' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Product name' },
      { name: 'slug', type: 'VARCHAR(255)', nullable: false, description: 'URL-friendly identifier' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Product description' },
      { name: 'price', type: 'DECIMAL(10,2)', nullable: false, description: 'Current price' },
      { name: 'compare_at_price', type: 'DECIMAL(10,2)', nullable: true, description: 'Original price (for discounts)' },
      { name: 'images', type: 'TEXT[]', nullable: false, default: "'{}'", description: 'Array of image URLs' },
      { name: 'category_id', type: 'UUID', nullable: true, description: 'References categories table', isForeign: true, references: 'categories(id)' },
      { name: 'tags', type: 'TEXT[]', nullable: false, default: "'{}'", description: 'Product tags array' },
      { name: 'in_stock', type: 'BOOLEAN', nullable: false, default: 'true', description: 'Stock availability' },
      { name: 'stock_quantity', type: 'INTEGER', nullable: true, description: 'Stock count (if tracked)' },
      { name: 'variants', type: 'JSONB', nullable: true, description: 'Product variants (size, color, etc.)' },
      { name: 'metadata', type: 'JSONB', nullable: true, description: 'Additional metadata' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'true', description: 'Product active status' },
      { name: 'sort_order', type: 'INTEGER', nullable: false, default: '0', description: 'Display order' },
    ],
  },
  {
    name: 'orders',
    description: 'Customer orders for each store',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, default: 'uuid_generate_v4()', description: 'Primary key', isPrimary: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Order timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Last update timestamp' },
      { name: 'store_id', type: 'UUID', nullable: false, description: 'References stores table', isForeign: true, references: 'stores(id)' },
      { name: 'order_number', type: 'VARCHAR(50)', nullable: false, description: 'Human-readable order number' },
      { name: 'status', type: 'ENUM', nullable: false, default: "'pending'", description: "Order status: 'pending' | 'confirmed' | 'shipped' | etc." },
      { name: 'customer_email', type: 'VARCHAR(255)', nullable: false, description: 'Customer email' },
      { name: 'customer_name', type: 'VARCHAR(255)', nullable: false, description: 'Customer name' },
      { name: 'customer_phone', type: 'VARCHAR(50)', nullable: true, description: 'Customer phone' },
      { name: 'shipping_address', type: 'JSONB', nullable: false, description: 'Shipping address JSON' },
      { name: 'billing_address', type: 'JSONB', nullable: true, description: 'Billing address JSON' },
      { name: 'items', type: 'JSONB', nullable: false, description: 'Order items snapshot' },
      { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: false, description: 'Items subtotal' },
      { name: 'shipping_cost', type: 'DECIMAL(10,2)', nullable: false, default: '0', description: 'Shipping cost' },
      { name: 'tax', type: 'DECIMAL(10,2)', nullable: false, default: '0', description: 'Tax amount' },
      { name: 'total', type: 'DECIMAL(10,2)', nullable: false, description: 'Order total' },
      { name: 'currency', type: 'VARCHAR(3)', nullable: false, description: 'Currency code' },
      { name: 'payment_status', type: 'ENUM', nullable: false, default: "'pending'", description: "Payment: 'pending' | 'paid' | 'failed' | 'refunded'" },
      { name: 'payment_method', type: 'VARCHAR(50)', nullable: true, description: 'Payment method used' },
      { name: 'payment_id', type: 'VARCHAR(255)', nullable: true, description: 'External payment ID' },
      { name: 'notes', type: 'TEXT', nullable: true, description: 'Order notes' },
    ],
  },
  {
    name: 'sync_logs',
    description: 'Logs for data sync operations',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, default: 'uuid_generate_v4()', description: 'Primary key', isPrimary: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, default: 'NOW()', description: 'Sync timestamp' },
      { name: 'store_id', type: 'UUID', nullable: false, description: 'References stores table', isForeign: true, references: 'stores(id)' },
      { name: 'status', type: 'ENUM', nullable: false, default: "'pending'", description: "Status: 'pending' | 'running' | 'completed' | 'failed'" },
      { name: 'products_synced', type: 'INTEGER', nullable: false, default: '0', description: 'Number of products synced' },
      { name: 'categories_synced', type: 'INTEGER', nullable: false, default: '0', description: 'Number of categories synced' },
      { name: 'error_message', type: 'TEXT', nullable: true, description: 'Error message if failed' },
      { name: 'duration_ms', type: 'INTEGER', nullable: true, description: 'Sync duration in milliseconds' },
    ],
  },
];

export default function SchemaPage() {
  const [selectedTable, setSelectedTable] = useState<string>('stores');
  const currentTable = schema.find(t => t.name === selectedTable);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Database className="w-8 h-8" />
          Database Schema
        </h1>
        <p className="text-zinc-400">
          Complete database schema with tables, columns, and relationships.
        </p>
      </div>

      {/* Table Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {schema.map((table) => (
          <button
            key={table.name}
            onClick={() => setSelectedTable(table.name)}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
              selectedTable === table.name
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {table.name}
          </button>
        ))}
      </div>

      {/* Table Details */}
      {currentTable && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white font-mono">
              {currentTable.name}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              {currentTable.description}
            </p>
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Column
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Nullable
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Default
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {currentTable.columns.map((column) => (
                  <tr key={column.name} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {column.isPrimary && (
                          <span title="Primary Key">
                            <Key size={14} className="text-yellow-500" />
                          </span>
                        )}
                        {column.isForeign && (
                          <span title="Foreign Key">
                            <LinkIcon size={14} className="text-blue-500" />
                          </span>
                        )}
                        <span className="font-mono text-sm text-white">
                          {column.name}
                        </span>
                      </div>
                      {column.references && (
                        <span className="text-xs text-blue-400 font-mono">
                          → {column.references}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-cyan-400">
                        {column.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {column.nullable ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <X size={16} className="text-red-400" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {column.default ? (
                        <span className="font-mono text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                          {column.default}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">
                      {column.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Entity Relationship Diagram */}
      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Entity Relationships</h2>
        <pre className="text-sm text-zinc-400 font-mono overflow-x-auto">
{`
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    stores    │       │  categories  │       │   products   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id        PK │◀──┐   │ id        PK │◀──┐   │ id        PK │
│ owner_id  FK │   │   │ store_id  FK │───┘   │ store_id  FK │───┐
│ name         │   │   │ name         │       │ category_id  │───┤
│ slug      UQ │   │   │ slug         │       │ name         │   │
│ theme        │   └───│──────────────│───────│──────────────│   │
│ ...          │       │ ...          │       │ ...          │   │
└──────────────┘       └──────────────┘       └──────────────┘   │
        ▲                                                        │
        │              ┌──────────────┐       ┌──────────────┐   │
        │              │    orders    │       │  sync_logs   │   │
        │              ├──────────────┤       ├──────────────┤   │
        │              │ id        PK │       │ id        PK │   │
        └──────────────│ store_id  FK │───────│ store_id  FK │───┘
                       │ order_number │       │ status       │
                       │ customer_*   │       │ products_*   │
                       │ ...          │       │ ...          │
                       └──────────────┘       └──────────────┘

Legend: PK = Primary Key, FK = Foreign Key, UQ = Unique
`}
        </pre>
      </div>
    </div>
  );
}
