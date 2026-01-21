'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { config, cartCount, setIsCartOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      {config.announcement && (
        <div className="bg-[var(--primary)] text-[var(--background)] text-center py-2 px-4 text-sm font-medium">
          {config.announcement}
        </div>
      )}
      
      <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-[var(--foreground)]"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight gradient-text">
                {config.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-8">
              <Link 
                href="/" 
                className="text-[var(--foregroundMuted)] hover:text-[var(--foreground)] transition-colors font-medium"
              >
                Shop
              </Link>
              <Link 
                href="/collections" 
                className="text-[var(--foregroundMuted)] hover:text-[var(--foreground)] transition-colors font-medium"
              >
                Collections
              </Link>
              <Link 
                href="/about" 
                className="text-[var(--foregroundMuted)] hover:text-[var(--foreground)] transition-colors font-medium"
              >
                About
              </Link>
            </nav>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-[var(--backgroundAlt)] rounded-full transition-colors"
            >
              <ShoppingBag size={24} className="text-[var(--foreground)]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-[var(--background)] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="sm:hidden border-t border-[var(--border)] bg-[var(--background)] animate-slide-up">
            <div className="px-4 py-4 space-y-4">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-[var(--foreground)]"
              >
                Shop
              </Link>
              <Link 
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-[var(--foreground)]"
              >
                Collections
              </Link>
              <Link 
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-[var(--foreground)]"
              >
                About
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
