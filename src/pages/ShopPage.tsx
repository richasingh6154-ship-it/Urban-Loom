import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import type { AppRoute, Product, ProductCategory, SizeOption } from '../types';

interface ShopPageProps {
  products: Product[];
  initialCategory?: ProductCategory | 'All';
  onNavigate: (route: AppRoute) => void;
  onAddToCart: (product: Product, size: SizeOption, color: string) => void;
  onBuyNow: (product: Product, size: SizeOption, color: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'T-shirts',
  'Shirts',
  'Tops',
  'Casual Wear',
  'Everyday Essentials',
];

export function ShopPage({
  products,
  initialCategory = 'All',
  onNavigate,
  onAddToCart,
  onBuyNow,
  wishlistIds,
  onToggleWishlist,
}: ShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((p) => {
      const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
      const searchMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E2DDD3]">
        <div>
          <p className="text-xs font-medium text-[#4B5842] mb-1">
            Batch 04 &amp; 05 Catalogue · ₹799–₹2,499
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#1A1917]">
            Sustainable Everyday Collection
          </h1>
        </div>
        <p className="text-xs text-[#635E56] font-mono tabular-nums">
          Showing {filteredProducts.length} of {products.length} garments
        </p>
      </div>

      {/* Category Filter Bar & Search */}
      <div className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1A1917] text-white border-[#1A1917]'
                  : 'bg-white text-[#635E56] border-[#E2DDD3] hover:text-[#1A1917] hover:border-[#C6BEB0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8D867B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fabric or garment..."
              className="w-full sm:w-64 pl-9 pr-3.5 py-2 text-xs bg-white border border-[#E2DDD3] rounded-md text-[#1A1917] placeholder-[#8D867B] focus:outline-none focus:border-[#4B5842]"
            />
          </div>

          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
            className="px-3 py-2 text-xs bg-white border border-[#E2DDD3] rounded-md text-[#1A1917] focus:outline-none focus:border-[#4B5842]"
          >
            <option value="featured">Sort: Curated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[#E2DDD3] rounded-lg">
          <p className="font-editorial text-xl text-[#1A1917]">No matching garments found</p>
          <p className="text-xs text-[#635E56] mt-1">
            Try resetting your category filter or search term.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium bg-[#1A1917] text-white rounded-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(id) => onNavigate({ page: 'product', productId: id })}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
