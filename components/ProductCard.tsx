'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { config, addToCart } = useStore();
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100) 
    : 0;

  return (
    <div className="group card hover-lift">
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!product.inStock && (
            <span className="badge bg-[var(--foregroundMuted)] text-white">
              Sold Out
            </span>
          )}
          {hasDiscount && (
            <span className="badge badge-secondary">
              -{discountPercent}%
            </span>
          )}
          {product.tags.includes('new') && (
            <span className="badge badge-primary">
              New
            </span>
          )}
        </div>

        {/* Quick Add Button - Shows on Hover */}
        {product.inStock && !product.variants?.length && (
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="absolute bottom-3 left-3 right-3 btn btn-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Add to Cart
          </button>
        )}
        
        {product.inStock && product.variants?.length && (
          <Link
            href={`/product/${product.id}`}
            className="absolute bottom-3 left-3 right-3 btn btn-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center"
          >
            Select Options
          </Link>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-heading text-lg font-semibold text-[var(--foreground)] mb-1 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-[var(--foregroundMuted)] mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold text-[var(--foreground)]">
            {config.currencySymbol}{product.price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--foregroundMuted)] line-through">
              {config.currencySymbol}{product.compareAtPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
