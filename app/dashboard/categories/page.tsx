'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Edit, Trash2, FolderTree, Check, X } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-store';

export default function CategoriesPage() {
  const { categories, products, deleteCategory, isLoading } = useDashboard();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getCategoryProductCount = (slug: string) => {
    return products.filter(p => p.category === slug).length;
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-zinc-400 mt-1">Organize your products into collections</p>
        </div>
        <Link
          href="/dashboard/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Category
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group"
          >
            {/* Category Image */}
            <div className="relative h-40 bg-zinc-800">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderTree size={48} className="text-zinc-700" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Actions Overlay */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-zinc-900/90 text-white rounded-lg hover:bg-zinc-800 transition-colors">
                  <Edit size={16} />
                </button>
                {deleteConfirm === category.id ? (
                  <>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={isLoading}
                      className="p-2 bg-green-600/90 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="p-2 bg-zinc-900/90 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
                    className="p-2 bg-zinc-900/90 text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{category.name}</h3>
                  <p className="text-sm text-zinc-500 font-mono">/{category.slug}</p>
                </div>
                <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
                  {getCategoryProductCount(category.slug)} products
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add Category Card */}
        <Link
          href="/dashboard/categories/new"
          className="border-2 border-dashed border-zinc-800 rounded-xl h-full min-h-[200px] flex flex-col items-center justify-center gap-3 text-zinc-500 hover:border-violet-500/50 hover:text-violet-400 transition-colors"
        >
          <Plus size={32} />
          <span className="font-medium">Add New Category</span>
        </Link>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <FolderTree size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No categories yet</h3>
          <p className="text-zinc-400 mb-6">Create categories to organize your products</p>
          <Link
            href="/dashboard/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Create your first category
          </Link>
        </div>
      )}
    </div>
  );
}
