'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function CollectionsPage() {
  const { categories, products, loading } = useData();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 bg-[var(--backgroundAlt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-4">
            Collections
          </h1>
          <p className="text-lg text-[var(--foregroundMuted)] max-w-2xl mx-auto">
            Explore our curated categories. Find exactly what you&apos;re looking for.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {categories.map((category) => {
                const productCount = products.filter(p => p.category === category.slug).length;
                
                return (
                  <Link
                    key={category.id}
                    href={`/collections/${category.slug}`}
                    className="group relative aspect-[16/9] rounded-[var(--radius)] overflow-hidden card hover-lift"
                  >
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            {category.name}
                          </h2>
                          <p className="text-white/70">
                            {productCount} {productCount === 1 ? 'product' : 'products'}
                          </p>
                        </div>
                        <div className="p-3 bg-[var(--primary)] rounded-full text-[var(--background)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* All Products Link */}
      <section className="py-16 bg-[var(--backgroundAlt)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">
            Can&apos;t decide?
          </h2>
          <p className="text-[var(--foregroundMuted)] mb-6">
            Browse all {products.length} products in our store
          </p>
          <Link href="/#products" className="btn btn-primary">
            Shop All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
