'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

export default function CollectionPage() {
  const params = useParams();
  const { categories, products, loading } = useData();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const category = categories.find(c => c.slug === params.slug);
  const categoryProducts = products.filter(p => p.category === params.slug);

  // Sort products
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // newest - keep original order
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-[var(--foreground)] mb-4">
            Collection Not Found
          </h1>
          <p className="text-[var(--foregroundMuted)] mb-6">
            The collection you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/collections" className="btn btn-primary">
            View All Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link 
          href="/collections" 
          className="inline-flex items-center gap-2 text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft size={18} />
          All Collections
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-2">
              {category.name}
            </h1>
            <p className="text-[var(--foregroundMuted)]">
              {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={18} className="text-[var(--foregroundMuted)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--foregroundMuted)] text-lg mb-6">
              No products found in this collection.
            </p>
            <Link href="/collections" className="btn btn-primary">
              Browse Other Collections
            </Link>
          </div>
        )}
      </section>

      {/* Other Collections */}
      <section className="py-16 bg-[var(--backgroundAlt)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-[var(--foreground)] mb-6">
            Other Collections
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories
              .filter(c => c.slug !== params.slug)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/collections/${cat.slug}`}
                  className="px-5 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-full text-[var(--foreground)] font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
