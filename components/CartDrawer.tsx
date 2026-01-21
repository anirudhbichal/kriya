'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartTotal,
    config 
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--background)] border-l border-[var(--border)] z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-[var(--backgroundAlt)] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-[var(--foregroundMuted)] mb-4" />
              <p className="text-[var(--foregroundMuted)] mb-4">Your cart is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.product.id} className="flex gap-4 p-3 bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)]">
                  {/* Product Image */}
                  <div className="relative w-20 h-24 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images?.[0] || item.product.image || ''}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/product/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="font-heading font-semibold text-[var(--foreground)] line-clamp-1 hover:text-[var(--primary)] transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    
                    {item.selectedVariants && (
                      <p className="text-xs text-[var(--foregroundMuted)] mt-1">
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span key={key}>{key}: {value} </span>
                        ))}
                      </p>
                    )}

                    <p className="font-heading font-bold text-[var(--foreground)] mt-2">
                      {config.currencySymbol}{item.product.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[var(--border)] rounded">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-[var(--backgroundAlt)] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-[var(--backgroundAlt)] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[var(--foregroundMuted)] hover:text-[var(--error)] text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[var(--border)] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--foregroundMuted)]">Subtotal</span>
              <span className="font-heading text-xl font-bold">
                {config.currencySymbol}{cartTotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-[var(--foregroundMuted)]">
              Shipping and taxes calculated at checkout
            </p>
            <button className="btn btn-primary w-full">
              Checkout
            </button>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="btn btn-secondary w-full"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
