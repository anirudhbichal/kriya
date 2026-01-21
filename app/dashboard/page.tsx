'use client';

import { Package, FolderTree, ShoppingCart, TrendingUp, DollarSign, Eye } from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from '@/lib/dashboard-store';

export default function DashboardPage() {
  const { products, categories, orders } = useDashboard();

  // Calculate stats from real data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  const stats = [
    { label: 'Total Products', value: products.length.toString(), icon: Package, change: '+3', color: 'from-blue-500 to-cyan-500' },
    { label: 'Categories', value: categories.length.toString(), icon: FolderTree, change: '+1', color: 'from-purple-500 to-pink-500' },
    { label: 'Orders', value: orders.length.toString(), icon: ShoppingCart, change: '+12', color: 'from-green-500 to-emerald-500' },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, change: '+8%', color: 'from-orange-500 to-amber-500' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-cyan-500/20 text-cyan-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  // Show last 3 orders
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-green-400">{stat.change}</span>
              <span className="text-zinc-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/products/new"
          className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-xl p-6 hover:border-violet-500/50 transition-colors group"
        >
          <Package size={24} className="text-violet-400 mb-3" />
          <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">Add New Product</h3>
          <p className="text-sm text-zinc-400 mt-1">Create a new product listing</p>
        </Link>
        <Link
          href="/dashboard/categories/new"
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-colors group"
        >
          <FolderTree size={24} className="text-blue-400 mb-3" />
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Add Category</h3>
          <p className="text-sm text-zinc-400 mt-1">Organize your products</p>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors group"
        >
          <Eye size={24} className="text-green-400 mb-3" />
          <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">View Live Store</h3>
          <p className="text-sm text-zinc-400 mt-1">See your store as customers do</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-violet-400 hover:text-violet-300">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-zinc-800">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-sm text-white">{order.id}</p>
                    <p className="text-sm text-zinc-400">{order.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">${order.total.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-zinc-500">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
