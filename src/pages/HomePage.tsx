import { useState } from 'react';
import { ArrowRight, Leaf, MapPin, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { FABRIC_EDITORIAL_IMAGE, HERO_IMAGE } from '../data/seedData';
import type {
  AppRoute,
  FeedbackEntry,
  FeedbackSummary,
  PopupEvent,
  Product,
  SizeOption,
} from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  feedback: FeedbackEntry[];
  feedbackSummary: FeedbackSummary;
  popups: PopupEvent[];
  onNavigate: (route: AppRoute) => void;
  onAddToCart: (product: Product, size: SizeOption, color: string) => void;
  onBuyNow: (product: Product, size: SizeOption, color: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export function HomePage({
  products,
  feedback,
  feedbackSummary,
  popups,
  onNavigate,
  onAddToCart,
  onBuyNow,
  wishlistIds,
  onToggleWishlist,
}: HomePageProps) {
  const [collectionTab, setCollectionTab] = useState<'featured' | 'new' | 'limited'>('featured');

  const visibleProducts = products
    .filter((p) => {
      if (collectionTab === 'new') return p.isNewArrival;
      if (collectionTab === 'limited') return p.isLimitedBatch;
      return p.isFeatured;
    })
    .slice(0, 6);

  return (
    <div>
      {/* 1. Storefront Hero Split */}
      <section className="border-b border-[#E2DDD3] bg-[#F7F5F0]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Editorial Copy Left */}
            <div className="lg:col-span-5 flex flex-col justify-between py-2">
              <div className="space-y-5">
                <p className="text-xs font-medium tracking-wider text-[#4B5842]">
                  Style Today · Sustain Tomorrow
                </p>
                <h1 className="font-editorial text-[clamp(2.25rem,3.8vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-[#1A1917] [text-wrap:balance]">
                  Fashion That Feels Good. Choices That Do Good.
                </h1>
                <p className="text-base text-[#635E56] leading-relaxed max-w-lg">
                  Thoughtfully tailored everyday clothing for India&apos;s campus and studio
                  generation. Crafted from organic cotton, Himalayan hemp, and recycled twill—most
                  pieces priced around ₹1,200.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'shop', category: 'All' })}
                    className="px-6 py-3 text-sm font-medium bg-[#1A1917] text-[#F7F5F0] rounded-md hover:bg-[#33312D] transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'about' })}
                    className="px-6 py-3 text-sm font-medium border border-[#D8D1C5] text-[#1A1917] rounded-md hover:bg-[#EFECE6] transition-colors whitespace-nowrap"
                  >
                    Explore Collection
                  </button>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-[#E2DDD3] grid grid-cols-2 gap-6">
                <div>
                  <p className="font-mono tabular-nums text-lg font-medium text-[#1A1917]">
                    ₹799 – ₹2,499
                  </p>
                  <p className="text-xs text-[#635E56] mt-0.5">
                    Accessible sustainable pricing
                  </p>
                </div>
                <div>
                  <p className="font-mono tabular-nums text-lg font-medium text-[#1A1917]">
                    {feedbackSummary.positiveFabricPercent || 100}% Positive
                  </p>
                  <p className="text-xs text-[#635E56] mt-0.5">
                    Verified student fabric rating
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Campaign Visual Right */}
            <div className="lg:col-span-7">
              <div className="relative h-full min-h-[340px] lg:min-h-[500px] rounded-lg overflow-hidden bg-[#EFECE6] border border-[#E2DDD3]">
                <img
                  src={HERO_IMAGE}
                  alt="Young Indian Gen Z models wearing Urban Loom organic cotton overshirts and linen trousers"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/75 via-black/30 to-transparent text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/80">Batch 04 &amp; 05 Now Open</p>
                    <p className="font-editorial text-lg font-medium">
                      Limited-run everyday silhouettes · Delhi NCR, Mumbai, Bengaluru &amp; Pune
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'shop', category: 'All' })}
                    className="px-4 py-2 text-xs font-medium bg-white text-[#1A1917] rounded-md hover:bg-[#EFECE6] transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    Place Your Pre-order
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Value Strip Below Hero Split */}
          <div className="mt-10 pt-8 border-t border-[#E2DDD3] grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-semibold text-[#1A1917]">Eco-Certified Fabrics</p>
              <p className="text-xs text-[#635E56] mt-1">
                GOTS organic cotton, Himalayan hemp, bamboo knit &amp; closed-loop Tencel.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1917]">Zero Overproduction</p>
              <p className="text-xs text-[#635E56] mt-1">
                75–160 units per limited batch to eliminate landfill deadstock.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1917]">Typical Price ₹1,200</p>
              <p className="text-xs text-[#635E56] mt-1">
                Fair artisan wages with direct-to-student transparent pricing.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1917]">Campus Pop-Up Racks</p>
              <p className="text-xs text-[#635E56] mt-1">
                Feel the fabrics in person across 5 Indian university hubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Collection Showcase (Featured / New Arrivals / Limited Batch) */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium text-[#4B5842] mb-1.5">
              Curated Wardrobe
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1A1917]">
              Everyday Sustainable Essentials
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center p-1 bg-[#EFECE6] rounded-md border border-[#E2DDD3]">
              <button
                type="button"
                onClick={() => setCollectionTab('featured')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  collectionTab === 'featured'
                    ? 'bg-white text-[#1A1917] shadow-xs'
                    : 'text-[#635E56] hover:text-[#1A1917]'
                }`}
              >
                Featured
              </button>
              <button
                type="button"
                onClick={() => setCollectionTab('new')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  collectionTab === 'new'
                    ? 'bg-white text-[#1A1917] shadow-xs'
                    : 'text-[#635E56] hover:text-[#1A1917]'
                }`}
              >
                New Arrivals
              </button>
              <button
                type="button"
                onClick={() => setCollectionTab('limited')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${
                  collectionTab === 'limited'
                    ? 'bg-white text-[#1A1917] shadow-xs'
                    : 'text-[#635E56] hover:text-[#1A1917]'
                }`}
              >
                Limited Batch
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate({ page: 'shop', category: 'All' })}
              className="px-4 py-2 text-xs font-medium text-[#1A1917] border border-[#D8D1C5] rounded-md hover:bg-[#EFECE6] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visibleProducts.map((product) => (
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
      </section>

      {/* 3. Sustainable Fabrics & Limited-Batch Philosophy */}
      <section className="bg-[#EFECE6] border-y border-[#E2DDD3]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#D8D1C5] bg-white">
                <img
                  src={FABRIC_EDITORIAL_IMAGE}
                  alt="Raw unbleached organic cotton bolls and handwoven hemp linen swatches on travertine"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-medium text-[#4B5842]">
                Material Transparency · Limited-Batch Model
              </p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1A1917] [text-wrap:balance]">
                Honest Fibres Built for Indian Weather and Student Budgets
              </h2>
              <p className="text-sm sm:text-base text-[#635E56] leading-relaxed">
                Fast fashion hides behind virgin polyester and synthetic overproduction. Urban Loom
                partners directly with solar-powered knitting mills in Tiruppur, handloom weavers
                in Wardha, and circular cotton recyclers in Panipat to bring breathable natural
                garments within reach at ₹799–₹2,499.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white border border-[#E2DDD3] rounded-md p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1917]">
                    <Leaf className="w-4 h-4 text-[#4B5842]" />
                    <span>Botanical &amp; Low-Water Dyes</span>
                  </div>
                  <p className="text-xs text-[#635E56] mt-1.5 leading-relaxed">
                    Up to 2,400 litres of fresh water conserved per garment using closed-loop dyeing.
                  </p>
                </div>
                <div className="bg-white border border-[#E2DDD3] rounded-md p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1917]">
                    <ShieldCheck className="w-4 h-4 text-[#6E4F3A]" />
                    <span>Small-Batch Pre-Orders</span>
                  </div>
                  <p className="text-xs text-[#635E56] mt-1.5 leading-relaxed">
                    Only 75–160 pieces per drop so fabric never sits unsold in warehouses.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'about' })}
                  className="px-5 py-2.5 text-xs font-medium bg-[#1A1917] text-white rounded-md hover:bg-[#33312D]"
                >
                  Read Our Sustainability Story
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'find-us' })}
                  className="px-5 py-2.5 text-xs font-medium border border-[#1A1917] text-[#1A1917] rounded-md hover:bg-white"
                >
                  Request a Fabric Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Campus Pop-ups Preview + Verified Student Testimonials */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Upcoming Campus Pop-ups */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-medium text-[#4B5842] mb-1">Find Us Near You</p>
              <h2 className="font-editorial text-2xl font-medium text-[#1A1917]">
                Campus Pop-Up Tour 2026
              </h2>
              <p className="text-sm text-[#635E56] mt-1.5">
                Touch our organic cotton and hemp-linen fabrics before you pre-order at university
                courtyards across five cities.
              </p>
            </div>

            <div className="space-y-3">
              {popups.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white border border-[#E2DDD3] rounded-md p-4 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#4B5842] font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{ev.city}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{ev.dateLabel}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#1A1917]">{ev.campusName}</h3>
                    <p className="text-xs text-[#635E56]">{ev.venue}</p>
                  </div>
                  <span className="font-mono tabular-nums text-[11px] text-[#635E56] shrink-0">
                    {ev.registrationCount} going
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate({ page: 'find-us' })}
              className="px-5 py-2.5 text-xs font-medium bg-[#4B5842] text-white rounded-md hover:bg-[#3B4634] inline-flex items-center gap-2"
            >
              <span>Register Your Interest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Adjacent Customer Proof & Fabric Quality Metric */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#4B5842] mb-1">
                  Student &amp; Young Professional Reviews
                </p>
                <h2 className="font-editorial text-2xl font-medium text-[#1A1917]">
                  {feedbackSummary.positiveFabricPercent}% Positive Fabric Quality Score
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'feedback' })}
                className="text-xs font-medium text-[#1A1917] underline underline-offset-4 hover:text-[#4B5842] whitespace-nowrap self-start sm:self-auto"
              >
                Rate Our Fabrics &amp; Pricing
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {feedback.slice(0, 4).map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white border border-[#E2DDD3] rounded-md p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1A1917]">{fb.productName}</span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums text-[#4B5842]">
                        <Star className="w-3.5 h-3.5 fill-[#4B5842] text-[#4B5842]" />
                        {fb.fabricQuality}.0
                      </span>
                    </div>
                    <p className="text-xs text-[#635E56] leading-relaxed">
                      &ldquo;{fb.suggestion}&rdquo;
                    </p>
                  </div>
                  <div className="text-[11px] text-[#8D867B] pt-2 border-t border-[#EFECE6] flex items-center justify-between">
                    <span>{fb.customerName}</span>
                    <span>{fb.city}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#EFECE6] border border-[#E2DDD3] rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-[#1A1917]">
                <Sparkles className="w-4 h-4 text-[#4B5842] shrink-0" />
                <span>
                  Average Comfort{' '}
                  <strong className="font-mono tabular-nums">{feedbackSummary.avgComfort}/5</strong>{' '}
                  · Affordability{' '}
                  <strong className="font-mono tabular-nums">
                    {feedbackSummary.avgAffordability}/5
                  </strong>{' '}
                  across {feedbackSummary.totalReviews} verified responses
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'feedback' })}
                className="px-4 py-2 text-xs font-medium bg-white border border-[#D8D1C5] rounded-md text-[#1A1917] hover:bg-[#F7F5F0] whitespace-nowrap"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
