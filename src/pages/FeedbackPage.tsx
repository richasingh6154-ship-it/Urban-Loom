import { useState, type FormEvent } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { api } from '../api/client';
import { TARGET_CITIES } from '../data/seedData';
import type { FeedbackEntry, FeedbackSummary, Product } from '../types';
import { formatShortDate } from '../utils/format';

interface FeedbackPageProps {
  products: Product[];
  feedback: FeedbackEntry[];
  summary: FeedbackSummary;
  onFeedbackAdded: (entry: FeedbackEntry, updatedSummary: FeedbackSummary) => void;
}

function StarRatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-[#EFECE6]">
      <span className="text-xs font-medium text-[#1A1917]">{label}</span>
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            aria-label={`${label} ${num} out of 5`}
            className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B5842] rounded-sm"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                num <= value
                  ? 'fill-[#4B5842] text-[#4B5842]'
                  : 'text-[#D8D1C5] hover:text-[#9C9589]'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function FeedbackPage({
  products,
  feedback,
  summary,
  onFeedbackAdded,
}: FeedbackPageProps) {
  const [customerName, setCustomerName] = useState('');
  const [city, setCity] = useState<string>(TARGET_CITIES[0]);
  const [productName, setProductName] = useState(products[0]?.name || 'Charcoal Bamboo Knit Polo');
  const [fabricQuality, setFabricQuality] = useState(5);
  const [comfort, setComfort] = useState(5);
  const [design, setDesign] = useState(5);
  const [affordability, setAffordability] = useState(4);
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedOk, setSubmittedOk] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmittedOk(false);

    if (customerName.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitFeedback({
        customerName: customerName.trim(),
        city,
        productName,
        fabricQuality,
        comfort,
        design,
        affordability,
        suggestion: suggestion.trim(),
      });
      onFeedbackAdded(res.entry, res.summary);
      setCustomerName('');
      setSuggestion('');
      setSubmittedOk(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
      {/* Header & MVP Metric */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E2DDD3]">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium text-[#4B5842]">
            Product &amp; Fabric Validation · Target &gt;80% Positive
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#1A1917]">
            Customer Feedback &amp; Quality Index
          </h1>
          <p className="text-sm text-[#635E56]">
            Your honest ratings on fabric feel, everyday comfort, design, and ₹1,200 affordability
            shape our next production batch.
          </p>
        </div>

        <div className="bg-white border border-[#E2DDD3] rounded-lg px-5 py-4 min-w-[260px]">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-xs text-[#635E56]">Positive Fabric Quality</span>
            <span className="font-mono tabular-nums text-2xl font-semibold text-[#4B5842]">
              {summary.positiveFabricPercent}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-[#EFECE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4B5842] transition-all duration-300"
              style={{ width: `${Math.min(100, summary.positiveFabricPercent)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#635E56] mt-1.5">
            MVP Goal: &gt;80% rating 4–5 stars · {summary.totalReviews} verified responses
          </p>
        </div>
      </div>

      {/* Dimension Averages */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Fabric Quality', val: summary.avgFabricQuality },
          { label: 'Everyday Comfort', val: summary.avgComfort },
          { label: 'Minimalist Design', val: summary.avgDesign },
          { label: 'Affordability (₹1,200)', val: summary.avgAffordability },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white border border-[#E2DDD3] rounded-md p-4 flex items-center justify-between"
          >
            <span className="text-xs text-[#635E56]">{metric.label}</span>
            <span className="font-mono tabular-nums text-lg font-semibold text-[#1A1917]">
              {metric.val.toFixed(1)}
              <span className="text-xs text-[#8D867B]">/5</span>
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Feedback Submission Form */}
        <div className="lg:col-span-5 bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-5">
          <h2 className="font-editorial text-2xl font-medium text-[#1A1917]">
            Rate Your Urban Loom Experience
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="fb-name" className="block text-xs font-medium text-[#1A1917] mb-1">
                  Your Name
                </label>
                <input
                  id="fb-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanya Jain"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                />
              </div>

              <div>
                <label htmlFor="fb-city" className="block text-xs font-medium text-[#1A1917] mb-1">
                  City
                </label>
                <select
                  id="fb-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                >
                  {TARGET_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="fb-prod" className="block text-xs font-medium text-[#1A1917] mb-1">
                Garment / Fabric Swatch Tried
              </label>
              <select
                id="fb-prod"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-1">
              <StarRatingInput
                label="Fabric Quality"
                value={fabricQuality}
                onChange={setFabricQuality}
              />
              <StarRatingInput label="Comfort & Breathability" value={comfort} onChange={setComfort} />
              <StarRatingInput label="Design & Silhouette" value={design} onChange={setDesign} />
              <StarRatingInput
                label="Affordability & Value"
                value={affordability}
                onChange={setAffordability}
              />
            </div>

            <div>
              <label htmlFor="fb-note" className="block text-xs font-medium text-[#1A1917] mb-1">
                Suggestions or Fit Notes
              </label>
              <textarea
                id="fb-note"
                rows={3}
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Tell us what you loved about the fabric weight, price, or what shades you want next..."
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>

            {error && <p className="text-xs text-[#8B2E2E]">{error}</p>}
            {submittedOk && (
              <div className="p-3 bg-[#F0F4ED] border border-[#C3D1B8] rounded-md text-xs text-[#2F3B28] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4B5842]" />
                <span>Thank you! Your fabric review is now live.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#1A1917] text-white text-xs font-medium rounded-md hover:bg-[#33312D] transition-colors disabled:opacity-60"
            >
              {submitting ? 'Submitting Review...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        {/* Customer Reviews Feed */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-semibold text-[#1A1917]">
            Community Reviews ({feedback.length})
          </h2>

          <div className="space-y-3">
            {feedback.map((entry) => (
              <article
                key={entry.id}
                className="bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1917]">{entry.productName}</h3>
                    <p className="text-xs text-[#635E56]">
                      {entry.customerName} · {entry.city} · {formatShortDate(entry.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[#4B5842]">
                    <span>Fabric {entry.fabricQuality}/5</span>
                    <span>·</span>
                    <span>Value {entry.affordability}/5</span>
                  </div>
                </div>

                <p className="text-sm text-[#1A1917] leading-relaxed">{entry.suggestion}</p>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#EFECE6] text-[11px] text-[#635E56] font-mono tabular-nums">
                  <span>Fabric: {entry.fabricQuality}/5</span>
                  <span>Comfort: {entry.comfort}/5</span>
                  <span>Design: {entry.design}/5</span>
                  <span>Price: {entry.affordability}/5</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
