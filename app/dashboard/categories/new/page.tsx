'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-store';

export default function NewCategoryPage() {
  const router = useRouter();
  const { addCategory, isLoading } = useDashboard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
  });

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: formData.imageUrl || undefined,
      });
      
      setShowSuccess(true);
      
      // Redirect after showing success
      setTimeout(() => {
        router.push('/dashboard/categories');
      }, 1500);
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Category Created!</h2>
          <p className="text-zinc-400">Redirecting to categories list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/categories"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          Back to Categories
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Category</h1>
        <p className="text-zinc-400 mt-1">Create a new category to organize your products</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Apparel"
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              URL Slug *
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-zinc-800 border border-r-0 border-zinc-700 rounded-l-lg text-zinc-500">
                /collections/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                placeholder="apparel"
                required
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-r-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Only lowercase letters, numbers, and hyphens
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Description
              <span className="text-zinc-500 ml-1">(optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this category..."
              rows={3}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Cover Image URL
              <span className="text-zinc-500 ml-1">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/photo-xxx?w=600"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Use Unsplash URLs for best results
            </p>
            
            {formData.imageUrl && (
              <div className="mt-4 relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
                <img
                  src={formData.imageUrl}
                  alt="Category preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard/categories"
            className="px-6 py-3 text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              'Create Category'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
