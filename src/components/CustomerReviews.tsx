import { Star } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/reviews';

export function CustomerReviews() {
  return (
    <section
      aria-labelledby="customer-reviews-heading"
      className="bg-[#F0F3EC] border-y border-[#E2E8DC] py-12 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#166534] uppercase mb-1.5">
              Verified Market Customers
            </p>
            <h2
              id="customer-reviews-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-[#1A241B] tracking-tight"
            >
              Trusted by Filipino Households &amp; Kitchens
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#4A584C] tabular-nums">
            <div className="flex items-center text-[#D97706]" aria-label="4.9 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" aria-hidden="true" />
              ))}
            </div>
            <span className="font-semibold text-[#1A241B]">4.9 / 5.0</span>
            <span aria-hidden="true">·</span>
            <span>1,420+ verified wet market orders</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CUSTOMER_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="bg-white rounded-xl border border-[#E2E8DC] p-5 flex flex-col justify-between gap-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="flex items-center gap-0.5 text-[#D97706]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-[#166534]">{review.topic}</span>
                </div>

                <p className="text-sm text-[#2C392E] leading-relaxed">
                  “{review.comment}”
                </p>
              </div>

              <div className="pt-3 border-t border-[#EEF2EA] space-y-1">
                <p className="text-sm font-semibold text-[#1A241B]">{review.name}</p>
                <p className="text-xs text-[#5A6B5D]">{review.location}</p>
                <p className="text-xs text-[#6B7A6D] truncate" title={review.purchasedItems}>
                  Bought: {review.purchasedItems}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
