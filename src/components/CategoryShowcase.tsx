import { ArrowRight } from 'lucide-react';
import { MARKET_IMAGES } from '../data/products';
import { AppRoute } from '../types/market';
import { MarketImage } from './MarketImage';

interface CategoryShowcaseProps {
  onSelectCategory: (route: AppRoute) => void;
  vegCount: number;
  meatCount: number;
}

export function CategoryShowcase({
  onSelectCategory,
  vegCount,
  meatCount,
}: CategoryShowcaseProps) {
  const categories = [
    {
      id: 'vegetables' as const,
      title: 'Vegetables',
      meta: `${vegCount} varieties · Farm-fresh per kg`,
      description:
        'Crisp leafy greens, pinakbet gourds, highland Cordillera crops, and everyday Filipino cooking aromatics like red onion, garlic, ginger, and calamansi.',
      image: MARKET_IMAGES.catVeg,
      alt: 'Fresh Filipino wet market vegetables including eggplant, bitter gourd, squash, okra, native pechay, onions, garlic, and ginger',
    },
    {
      id: 'meats' as const,
      title: 'Meats',
      meta: `${meatCount} cuts & catches · Pork, Beef, Chicken & Seafood`,
      description:
        'Freshly butchered pork liempo and ribs, tender beef cuts, chilled poultry, plus coastal bangus, sugpo prawns, shellfish, and sun-dried tuyo and tinapa.',
      image: MARKET_IMAGES.catMeat,
      alt: 'Fresh wet market meats and seafood including marbled pork belly, beef ribeye, chicken cuts, whole milkfish, and tiger prawns on crushed ice',
    },
  ];

  return (
    <section
      aria-labelledby="featured-categories-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#166534] uppercase mb-1.5">
            Market Stalls
          </p>
          <h2
            id="featured-categories-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-[#1A241B] tracking-tight"
          >
            Shop by Market Category
          </h2>
        </div>
        <p className="text-sm text-[#4A584C] max-w-md">
          Choose a market section below to inspect live kilogram pricing, available stock quantities, and custom weights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {categories.map((cat) => (
          <article
            key={cat.id}
            className="group bg-white rounded-2xl border border-[#E2E8DC] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
          >
            <button
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="block w-full text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#166534]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F0F3EC]">
                <MarketImage
                  src={cat.image}
                  alt={cat.alt}
                  className="w-full h-full group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </button>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#5A6B5D] tabular-nums">
                  {cat.meta}
                </p>
                <h3 className="font-display text-2xl font-bold text-[#1A241B]">
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-[#166534] transition-colors text-left"
                  >
                    {cat.title}
                  </button>
                </h3>
                <p className="text-sm sm:text-base text-[#4A584C] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  aria-label={`Explore ${cat.title}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
