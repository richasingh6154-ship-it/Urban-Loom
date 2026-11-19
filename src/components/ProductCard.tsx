import { useState } from 'react';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import type { Product, SizeOption } from '../types';
import { formatINR } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  onAddToCart: (product: Product, size: SizeOption, color: string) => void;
  onBuyNow: (product: Product, size: SizeOption, color: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export function ProductCard({
  product,
  onSelect,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const defaultColor = product.colors[0]?.name || 'Natural';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, defaultColor);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1200);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product, selectedSize, defaultColor);
  };

  return (
    <article className="group flex flex-col bg-white border border-[#E2DDD3] rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      {/* 4:3 Studio Product Photography */}
      <div
        onClick={() => onSelect(product.id)}
        className="relative aspect-[4/3] bg-[#EFECE6] overflow-hidden cursor-pointer"
      >
        {!imgError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#EFECE6] to-[#E2DDD3]">
            <Sparkles className="w-6 h-6 text-[#4B5842] mb-2" />
            <span className="font-editorial text-sm text-[#1A1917]">{product.name}</span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 border border-[#E2DDD3] flex items-center justify-center text-[#1A1917] hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-[#6E4F3A] text-[#6E4F3A]' : 'text-[#1A1917]'}`}
          />
        </button>

        {product.isLimitedBatch && (
          <div className="absolute bottom-2.5 left-3 px-2 py-0.5 bg-[#1A1917]/85 text-[#F7F5F0] text-[11px] font-mono tabular-nums rounded-sm">
            {product.batchCode} · {product.batchRemaining} left
          </div>
        )}
      </div>

      {/* Card Metadata & Actions */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#635E56] mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.fabric.split('(')[0].trim()}</span>
          </div>

          <h3
            onClick={() => onSelect(product.id)}
            className="font-semibold text-[15px] text-[#1A1917] leading-snug cursor-pointer hover:text-[#4B5842] transition-colors"
          >
            {product.name}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono tabular-nums text-[15px] font-medium text-[#1A1917]">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-mono tabular-nums text-xs text-[#8D867B] line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5" aria-label="Available colours">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="w-3 h-3 rounded-full border border-[#1A1917]/15"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Size + Actions */}
        <div className="pt-2 border-t border-[#EFECE6] space-y-2.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] text-[#635E56]">Size</span>
            <div className="flex items-center gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-sm border transition-colors ${
                    selectedSize === size
                      ? 'bg-[#1A1917] text-white border-[#1A1917]'
                      : 'bg-transparent text-[#635E56] border-[#E2DDD3] hover:border-[#1A1917]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="py-2 px-3 text-xs font-medium border border-[#1A1917] text-[#1A1917] rounded-md hover:bg-[#EFECE6] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{addedFeedback ? 'Added' : 'Add to Cart'}</span>
            </button>
            <button
              type="button"
              onClick={handleQuickBuy}
              className="py-2 px-3 text-xs font-medium bg-[#4B5842] text-white rounded-md hover:bg-[#3B4634] transition-colors whitespace-nowrap"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
