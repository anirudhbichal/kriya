'use client';

import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/store-context";
import { useData } from "@/lib/data-context";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { config } = useStore();
  const { products, categories, loading } = useData();

  const featuredProducts = products.filter(p => p.tags.includes('bestseller') || p.tags.includes('new'));
  const trendingProducts = products.filter(p => p.tags.includes('trending'));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[var(--backgroundAlt)]" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, var(--primaryGlow) 0%, transparent 50%),
                         radial-gradient(ellipse at 80% 50%, var(--secondaryGlow) 0%, transparent 50%)`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-full mb-6 animate-slide-up">
              <Sparkles size={16} className="text-[var(--primary)]" />
              <span className="text-sm font-medium text-[var(--foregroundMuted)]">
                New arrivals just dropped
              </span>
            </div>
            
            <h1 
              className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="text-[var(--foreground)]">Curated for</span>
              <br />
              <span className="gradient-text text-glow-primary">the culture.</span>
            </h1>
            
            <p 
              className="text-lg sm:text-xl text-[var(--foregroundMuted)] max-w-xl mb-8 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              Discover unique pieces that speak to your style. 
              From streetwear to essentials, we&apos;ve got you covered.
            </p>
            
            <div 
              className="flex flex-wrap gap-4 animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Link href="#products" className="btn btn-primary">
                Shop Now
                <ArrowRight size={18} />
              </Link>
              <Link href="/collections" className="btn btn-secondary">
                View Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              Shop by Category
            </h2>
            <Link 
              href="/collections" 
              className="hidden sm:flex items-center gap-2 text-[var(--primary)] font-medium hover:gap-3 transition-all"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/collections/${category.slug}`}
                  className="group relative aspect-square rounded-[var(--radius)] overflow-hidden card hover-lift"
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 sm:py-24 bg-[var(--backgroundAlt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Featured Picks
            </h2>
            <p className="text-[var(--foregroundMuted)] max-w-2xl mx-auto">
              Our most-loved items, handpicked for you. These are the pieces everyone&apos;s talking about.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl sm:text-6xl font-bold mb-6">
              <span className="gradient-text">Free Shipping</span>
            </h2>
            <p className="text-xl text-[var(--foregroundMuted)] mb-8">
              On all orders over {config.currencySymbol}50. No minimum purchase required.
            </p>
            <Link href="#products" className="btn btn-primary">
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      {trendingProducts.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2">
                  Trending Now 🔥
                </h2>
                <p className="text-[var(--foregroundMuted)]">
                  What everyone&apos;s adding to their carts
                </p>
              </div>
              <Link 
                href="/" 
                className="hidden sm:flex items-center gap-2 text-[var(--primary)] font-medium hover:gap-3 transition-all"
              >
                Shop All <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 sm:py-24 bg-[var(--backgroundAlt)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Stay in the Loop
            </h2>
            <p className="text-[var(--foregroundMuted)] mb-8">
              Subscribe to get exclusive drops, early access, and member-only deals.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 max-w-md px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] placeholder:text-[var(--foregroundMuted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
