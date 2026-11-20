import { ArrowRight } from 'lucide-react';
import { MARKET_IMAGES } from '../data/products';
import { AppRoute, MeatGroup } from '../types/market';
import { MarketImage } from './MarketImage';

interface CategoriesPageProps {
  onNavigate: (route: AppRoute, meatTab?: MeatGroup) => void;
  vegCount: number;
  meatCount: number;
}

export function CategoriesPage({
  onNavigate,
  vegCount,
  meatCount,
}: CategoriesPageProps) {
  const meatSubgroups: { id: MeatGroup; title: string; count: number; detail: string; image: string }[] = [
    {
      id: 'pork',
      title: 'Pork Cuts',
      count: 9,
      detail: 'Pork face, pork chop, liempo, kasim, pigue, pata, ground meat, liver, pork ribs.',
      image: MARKET_IMAGES.pork,
    },
    {
      id: 'beef',
      title: 'Beef Cuts',
      count: 11,
      detail: 'Ground beef, ribeye, sirloin, tenderloin, brisket, chuck, short ribs, flank, skirt, round, oxtail.',
      image: MARKET_IMAGES.beef,
    },
    {
      id: 'chicken',
      title: 'Fresh Chicken',
      count: 10,
      detail: 'Breast, thigh, drumstick, wings, leg quarter, back, neck, feet, liver, gizzard.',
      image: MARKET_IMAGES.chicken,
    },
    {
      id: 'seafood',
      title: 'Seafood & Dried Fish',
      count: 17,
      detail: 'Bangus, tilapia, galunggong, shrimp, sugpo, pusit, tahong, halaan, talaba, tuyo, tinapa, daing & dilis.',
      image: MARKET_IMAGES.seafoodFresh,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-2 pb-6 border-b border-[#E2E8DC]">
        <p className="text-xs font-semibold tracking-wide text-[#166534] uppercase">
          Market Directory
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A241B] tracking-tight">
          Wet Market Categories
        </h1>
        <p className="text-sm sm:text-base text-[#4A584C] max-w-2xl">
          Explore our two core market departments—Fresh Farm Vegetables and Prime Meats &amp; Coastal Seafood—or jump directly into a butcher or seafood stall.
        </p>
      </div>

      {/* Primary 2 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <article className="bg-white rounded-2xl border border-[#E2E8DC] overflow-hidden shadow-xs flex flex-col">
          <button
            type="button"
            onClick={() => onNavigate('vegetables')}
            className="aspect-[4/3] w-full overflow-hidden bg-[#F0F3EC] block text-left"
          >
            <MarketImage
              src={MARKET_IMAGES.catVeg}
              alt="Fresh market vegetables"
              className="w-full h-full hover:scale-[1.02] transition-transform duration-300"
            />
          </button>
          <div className="p-6 flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#5A6B5D] tabular-nums">
                {vegCount} vegetable varieties · Sold per kg
              </p>
              <h2 className="font-display text-2xl font-bold text-[#1A241B]">
                Vegetables
              </h2>
              <p className="text-sm text-[#4A584C] leading-relaxed">
                Complete lowland and Baguio highland produce: talong, kamatis, ampalaya, kalabasa, sitaw, kangkong, native pechay, malunggay, carrots, potatoes, onions, garlic, ginger, and calamansi.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => onNavigate('vegetables')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>

        <article className="bg-white rounded-2xl border border-[#E2E8DC] overflow-hidden shadow-xs flex flex-col">
          <button
            type="button"
            onClick={() => onNavigate('meats')}
            className="aspect-[4/3] w-full overflow-hidden bg-[#F0F3EC] block text-left"
          >
            <MarketImage
              src={MARKET_IMAGES.catMeat}
              alt="Fresh market meats and seafood"
              className="w-full h-full hover:scale-[1.02] transition-transform duration-300"
            />
          </button>
          <div className="p-6 flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#5A6B5D] tabular-nums">
                {meatCount} meat cuts &amp; seafood items · Sold per kg
              </p>
              <h2 className="font-display text-2xl font-bold text-[#1A241B]">
                Meats
              </h2>
              <p className="text-sm text-[#4A584C] leading-relaxed">
                Freshly butchered pork, beef, and chicken cuts alongside daily-landed fish, crustaceans, shellfish, and traditional dried &amp; smoked Filipino specialties.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => onNavigate('meats')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* Meat & Seafood Sub-sections */}
      <div className="space-y-5">
        <h2 className="font-display text-2xl font-bold text-[#1A241B]">
          Inside Our Meats &amp; Seafood Hall
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {meatSubgroups.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => onNavigate('meats', sub.id)}
              className="group text-left bg-white rounded-xl border border-[#E2E8DC] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F0F3EC]">
                <MarketImage
                  src={sub.image}
                  alt={sub.title}
                  className="w-full h-full group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4 space-y-1.5 flex-1">
                <p className="text-xs font-medium text-[#166534] tabular-nums">
                  {sub.count} selections
                </p>
                <h3 className="text-base font-semibold text-[#1A241B] group-hover:text-[#166534]">
                  {sub.title}
                </h3>
                <p className="text-xs text-[#5A6B5D] leading-relaxed">{sub.detail}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
