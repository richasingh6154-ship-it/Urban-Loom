import { FABRIC_EDITORIAL_IMAGE } from '../data/seedData';
import type { AppRoute } from '../types';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      {/* Vision & Mission Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <p className="text-xs font-medium text-[#4B5842]">
            Style Today. Sustain Tomorrow.
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#1A1917] [text-wrap:balance]">
            Making Sustainable Everyday Fashion Accessible to Gen Z India
          </h1>
          <p className="text-sm sm:text-base text-[#635E56] leading-relaxed">
            Urban Loom was founded on a simple observation: Indian college students and young
            professionals aged 18–24 care deeply about climate impact, yet sustainable labels
            often price everyday basics above ₹3,500 while fast-fashion chains flood campuses with
            synthetic polyester.
          </p>
          <p className="text-sm sm:text-base text-[#635E56] leading-relaxed">
            By producing in small pre-ordered batches directly with certified Indian mills and
            handloom collectives, we keep our typical garment around ₹1,200—without compromising
            fabric weight, silhouette, or artisan wages.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E2DDD3] bg-[#EFECE6]">
            <img
              src={FABRIC_EDITORIAL_IMAGE}
              alt="Organic cotton bolls and handwoven hemp-linen textiles at Urban Loom studio"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-[#E2DDD3]">
        <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-2.5">
          <p className="font-mono text-xs text-[#4B5842]">01. Vision</p>
          <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
            Conscious Campus Wardrobes
          </h2>
          <p className="text-xs sm:text-sm text-[#635E56] leading-relaxed">
            Normalize breathable, circular clothing across Indian universities and creative studios
            before fast-fashion habits lock in.
          </p>
        </div>

        <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-2.5">
          <p className="font-mono text-xs text-[#4B5842]">02. Affordable Pricing</p>
          <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
            The ₹1,200 Sweet Spot
          </h2>
          <p className="text-xs sm:text-sm text-[#635E56] leading-relaxed">
            Zero retail store markups and direct mill partnerships keep essentials between ₹799
            and ₹2,499, tailored to student budgets.
          </p>
        </div>

        <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-2.5">
          <p className="font-mono text-xs text-[#4B5842]">03. Eco Materials</p>
          <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
            Natural &amp; Recycled Fibres
          </h2>
          <p className="text-xs sm:text-sm text-[#635E56] leading-relaxed">
            GOTS organic cotton, Himalayan hemp, hand-spun khadi, bamboo knit, and post-consumer
            recycled cotton twill.
          </p>
        </div>

        <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-2.5">
          <p className="font-mono text-xs text-[#4B5842]">04. Limited-Batch</p>
          <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
            Zero Deadstock Waste
          </h2>
          <p className="text-xs sm:text-sm text-[#635E56] leading-relaxed">
            Small 75–160 piece runs and pre-orders mean we only cut and stitch what our community
            genuinely wants to wear.
          </p>
        </div>
      </section>

      {/* Responsible Sourcing Table */}
      <section className="bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#1A1917]">
              Material &amp; Mill Traceability
            </h2>
            <p className="text-xs sm:text-sm text-[#635E56] mt-1">
              Every Urban Loom garment lists its exact mill cluster and water conservation profile.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'shop', category: 'All' })}
            className="px-5 py-2.5 text-xs font-medium bg-[#4B5842] text-white rounded-md hover:bg-[#3B4634] whitespace-nowrap self-start sm:self-auto"
          >
            Shop Certified Pieces
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E2DDD3] text-[#635E56]">
                <th className="py-3 pr-4 font-medium">Fibre</th>
                <th className="py-3 pr-4 font-medium">Partner Cluster</th>
                <th className="py-3 pr-4 font-medium">Environmental Advantage</th>
                <th className="py-3 font-medium">Typical Garment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              <tr>
                <td className="py-3.5 pr-4 font-medium text-[#1A1917]">GOTS Organic Cotton</td>
                <td className="py-3.5 pr-4 text-[#635E56]">Tiruppur Solar Mill</td>
                <td className="py-3.5 pr-4 text-[#635E56]">Zero synthetic pesticides, 1,800L water saved</td>
                <td className="py-3.5 text-[#1A1917]">Moss Boxy Organic Tee (₹999)</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium text-[#1A1917]">Himalayan Hemp &amp; Linen</td>
                <td className="py-3.5 pr-4 text-[#635E56]">Uttarakhand &amp; Jaipur</td>
                <td className="py-3.5 pr-4 text-[#635E56]">Rain-fed crop, biodegradable coconut buttons</td>
                <td className="py-3.5 text-[#1A1917]">Oatmeal Hemp-Linen Shirt (₹1,299)</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium text-[#1A1917]">Recycled Cotton Twill</td>
                <td className="py-3.5 pr-4 text-[#635E56]">Panipat Recovery Hub</td>
                <td className="py-3.5 pr-4 text-[#635E56]">650g post-consumer textile scrap diverted</td>
                <td className="py-3.5 text-[#1A1917]">Walnut Twill Overshirt (₹1,999)</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium text-[#1A1917]">Handloom Desi Khadi</td>
                <td className="py-3.5 pr-4 text-[#635E56]">Wardha &amp; Gadag Artisans</td>
                <td className="py-3.5 pr-4 text-[#635E56]">Zero grid electricity during weaving</td>
                <td className="py-3.5 text-[#1A1917]">Deccan Khadi Tunic (₹1,199)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
