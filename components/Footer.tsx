'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { Instagram, Twitter } from 'lucide-react';

// TikTok icon component since lucide-react doesn't have it
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function Footer() {
  const { config } = useStore();

  return (
    <footer className="bg-[var(--backgroundAlt)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-heading text-2xl font-bold gradient-text mb-4">
              {config.name}
            </h3>
            <p className="text-[var(--foregroundMuted)] mb-4 max-w-md">
              {config.tagline}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {config.socialLinks?.instagram && (
                <a 
                  href={config.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-full hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {config.socialLinks?.twitter && (
                <a 
                  href={config.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-full hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  <Twitter size={20} />
                </a>
              )}
              {config.socialLinks?.tiktok && (
                <a 
                  href={config.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-full hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  <TikTokIcon size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-[var(--foreground)] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-bold text-[var(--foreground)] mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--foregroundMuted)]">
            © {new Date().getFullYear()} {config.name}. All rights reserved.
          </p>
          <p className="text-sm text-[var(--foregroundMuted)]">
            Powered by <span className="text-[var(--primary)]">Kriya</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
