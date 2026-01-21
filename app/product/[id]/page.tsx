'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useData } from '@/lib/data-context';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Minus, Plus, Truck, RotateCcw, Shield, Loader2 } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const { config, addToCart } = useStore();
  const { products, loading } = useData();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const product = products.find(p => p.id === params.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-[var(--foreground)] mb-4">
            Product Not Found
          </h1>
          <Link href="/" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.variants) {
      const variantsSelected = product.variants.every(v => selectedVariants[v.name]);
      if (!variantsSelected) {
        // Select first options as default
        const defaults: Record<string, string> = {};
        product.variants.forEach(v => {
          defaults[v.name] = selectedVariants[v.name] || v.options[0];
        });
        addToCart(product, quantity, defaults);
        return;
      }
    }
    addToCart(product, quantity, selectedVariants);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100) 
    : 0;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[var(--foregroundMuted)] hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </Link>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-[var(--radius)] overflow-hidden bg-[var(--card)] border border-[var(--border)]">
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!product.inStock && (
                  <span className="badge bg-[var(--foregroundMuted)] text-white">
                    Sold Out
                  </span>
                )}
                {hasDiscount && (
                  <span className="badge badge-secondary">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.tags.includes('new') && (
                  <span className="badge badge-primary">
                    New Arrival
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-[var(--primary)]' 
                        : 'border-[var(--border)] hover:border-[var(--foregroundMuted)]'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm mb-2">
                {product.category}
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
                {product.name}
              </h1>
              
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-heading text-3xl font-bold text-[var(--foreground)]">
                  {config.currencySymbol}{product.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-[var(--foregroundMuted)] line-through">
                      {config.currencySymbol}{product.compareAtPrice}
                    </span>
                    <span className="badge badge-secondary">
                      Save {config.currencySymbol}{(product.compareAtPrice! - product.price).toFixed(0)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-[var(--foregroundMuted)] text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.map((variant) => (
              <div key={variant.id}>
                <label className="block font-heading font-semibold text-[var(--foreground)] mb-3">
                  {variant.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                      className={`px-4 py-2 border rounded-[var(--radius)] font-medium transition-all ${
                        selectedVariants[variant.name] === option
                          ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--background)]'
                          : 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block font-heading font-semibold text-[var(--foreground)] mb-3">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-[var(--border)] rounded-[var(--radius)]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-[var(--backgroundAlt)] transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-6 font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-[var(--backgroundAlt)] transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full btn btn-primary text-lg py-4 ${
                  !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--border)]">
              <div className="flex items-center gap-3 text-[var(--foregroundMuted)]">
                <Truck size={20} className="text-[var(--primary)]" />
                <span className="text-sm">Free Shipping 50+</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--foregroundMuted)]">
                <RotateCcw size={20} className="text-[var(--primary)]" />
                <span className="text-sm">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--foregroundMuted)]">
                <Shield size={20} className="text-[var(--primary)]" />
                <span className="text-sm">Secure Checkout</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs text-[var(--foregroundMuted)] bg-[var(--backgroundAlt)] px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-[var(--backgroundAlt)] border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
