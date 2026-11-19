import { useState } from 'react';
import {
  ArrowLeft,
  Droplets,
  Heart,
  Leaf,
  Minus,
  Plus,
  Recycle,
  ShoppingBag,
} from 'lucide-react';
import type { AppRoute, Product, SizeOption } from '../types';
import { formatINR } from '../utils/format';

interface ProductDetailPageProps {
  product: Product | undefined;
  onNavigate: (route: AppRoute) => void;
  onAddToCart: (product: Product, size: SizeOption, color: string, quantity: number) => void;
  onBuyNow: (product: Product, size: SizeOption, color: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export function ProductDetailPage({
  product,
  onNavigate,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailPageProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || 'Natural');
  const [quantity, setQuantity] = useState(1);
  const [addedBanner, setAddedBanner] = useState(false);

  if (!product) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="font-editorial text-2xl text-[#1A1917]">Garment Not Found</h1>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'shop', category: 'All' })}
          className="px-5 py-2.5 text-xs font-medium bg-[#1A1917] text-white rounded-md"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  const gallery = product.images.length > 1 ? product.images : [product.images[0], product.images[0]];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedBanner(true);
    setTimeout(() => setAddedBanner(false), 1800);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <button
        type="button"
        onClick={() => onNavigate({ page: 'shop', category: 'All' })}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#635E56] hover:text-[#1A1917] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Catalogue</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Sticky Gallery Left */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          <div className="aspect-[4/3] bg-[#EFECE6] rounded-lg overflow-hidden border border-[#E2DDD3]">
            <img
              src={gallery[activeImageIdx] || gallery[0]}
              alt={`${product.name} — view ${activeImageIdx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {gallery.map((imgUrl, idx) => (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`aspect-[4/3] rounded-md overflow-hidden border transition-colors bg-[#EFECE6] ${
                  activeImageIdx === idx
                    ? 'border-[#1A1917] ring-1 ring-[#1A1917]'
                    : 'border-[#E2DDD3] opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sticky Purchase Module Right */}
        <div className="lg:col-span-5 bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs text-[#635E56]">
              <span>
                {product.category} · {product.batchCode}
              </span>
              <span className="font-mono tabular-nums text-[#4B5842]">
                {product.batchRemaining} of {product.batchTotal} left
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1A1917]">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className="p-2 border border-[#E2DDD3] rounded-full hover:bg-[#F7F5F0] shrink-0"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#6E4F3A] text-[#6E4F3A]' : 'text-[#1A1917]'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-mono tabular-nums text-2xl font-medium text-[#1A1917]">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-mono tabular-nums text-sm text-[#8D867B] line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
              <span className="text-xs text-[#635E56]">Inclusive of all taxes</span>
            </div>
          </div>

          <p className="text-sm text-[#635E56] leading-relaxed">{product.description}</p>

          {/* Colour Selection */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#1A1917]">Colour</span>
              <span className="text-[#635E56]">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    selectedColor === c.name
                      ? 'border-[#1A1917] bg-[#F7F5F0] text-[#1A1917] font-medium'
                      : 'border-[#E2DDD3] text-[#635E56] hover:border-[#1A1917]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-[#1A1917]/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#1A1917]">Select Size</span>
              <span className="text-[#635E56]">Relaxed Indian Campus Fit</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 text-xs font-mono rounded-md border transition-colors ${
                    selectedSize === size
                      ? 'bg-[#1A1917] text-white border-[#1A1917]'
                      : 'bg-white text-[#1A1917] border-[#E2DDD3] hover:border-[#1A1917]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-[#1A1917]">Quantity</span>
              <div className="inline-flex items-center border border-[#E2DDD3] rounded-md">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2.5 text-[#635E56] hover:text-[#1A1917]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-mono tabular-nums text-[#1A1917]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="p-2.5 text-[#635E56] hover:text-[#1A1917]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="py-3 px-4 text-sm font-medium border border-[#1A1917] text-[#1A1917] rounded-md hover:bg-[#EFECE6] transition-colors inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedBanner ? 'Added to Bag' : 'Add to Cart'}</span>
              </button>
              <button
                type="button"
                onClick={() => onBuyNow(product, selectedSize, selectedColor, quantity)}
                className="py-3 px-4 text-sm font-medium bg-[#4B5842] text-white rounded-md hover:bg-[#3B4634] transition-colors"
              >
                Place Your Pre-order
              </button>
            </div>
          </div>

          {/* Limited-Batch & Fabric Transparency */}
          <div className="pt-5 border-t border-[#EFECE6] space-y-3 text-xs">
            <div className="bg-[#F7F5F0] border border-[#E2DDD3] rounded-md p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[#1A1917]">
                <Recycle className="w-4 h-4 text-[#4B5842]" />
                <span>Limited-Batch Waste Reduction Commitment</span>
              </div>
              <p className="text-[#635E56] leading-relaxed">
                Urban Loom follows limited-batch production ({product.batchTotal} units in{' '}
                {product.batchCode}) to eliminate unsold inventory and reduce textile waste.
              </p>
            </div>

            <div className="space-y-2 pt-1 text-[#635E56]">
              <div className="flex items-start gap-2">
                <Leaf className="w-4 h-4 text-[#4B5842] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1917]">Fabric:</strong> {product.fabric} · Sourced
                  from {product.fabricOrigin}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Droplets className="w-4 h-4 text-[#6E4F3A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1917]">Impact:</strong> Saves approx.{' '}
                  <span className="font-mono tabular-nums">{product.waterSavedLiters}L</span> water
                  vs conventional fast fashion. {product.sustainabilityNote}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
