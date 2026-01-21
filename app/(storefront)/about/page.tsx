'use client';

import { useStore } from '@/lib/store-context';
import { Heart, Leaf, Truck, Users } from 'lucide-react';

export default function AboutPage() {
  const { config } = useStore();

  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'We curate only the best products that meet our high standards for quality and design.',
    },
    {
      icon: Leaf,
      title: 'Sustainable',
      description: 'Committed to eco-friendly practices and sustainable sourcing wherever possible.',
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Quick and reliable delivery to get your favorites to you as fast as possible.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a community of like-minded individuals who appreciate good taste.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, var(--primaryGlow) 0%, transparent 60%)`
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-[var(--foreground)] mb-6">
            About <span className="gradient-text">{config.name}</span>
          </h1>
          <p className="text-xl text-[var(--foregroundMuted)] max-w-2xl mx-auto">
            {config.tagline}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-24 bg-[var(--backgroundAlt)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">
              Our Story
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-[var(--foregroundMuted)]">
            <p className="text-lg leading-relaxed mb-6">
              We started with a simple idea: make it easy for anyone to discover and shop 
              unique products that reflect their personal style. No algorithms, no endless 
              scrolling—just carefully curated collections that speak to modern taste.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Every product in our store is hand-picked by our team. We work directly with 
              independent designers, small brands, and artisans who share our commitment to 
              quality and authenticity.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you&apos;re looking for everyday essentials or that one statement piece, 
              we&apos;ve got you covered. Welcome to the culture.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              What We Stand For
            </h2>
            <p className="text-[var(--foregroundMuted)] max-w-2xl mx-auto">
              Our core values guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {values.map((value, index) => (
              <div 
                key={index}
                className="card p-6 text-center hover-lift"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[var(--backgroundAlt)] rounded-full flex items-center justify-center">
                  <value.icon size={24} className="text-[var(--primary)]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[var(--foreground)] mb-2">
                  {value.title}
                </h3>
                <p className="text-[var(--foregroundMuted)] text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[var(--backgroundAlt)] border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            Ready to explore?
          </h2>
          <p className="text-lg text-[var(--foregroundMuted)] mb-8">
            Check out our latest drops and find your next favorite piece.
          </p>
          <a href="/" className="btn btn-primary">
            Start Shopping
          </a>
        </div>
      </section>
    </div>
  );
}
