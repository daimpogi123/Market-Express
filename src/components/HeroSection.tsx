import { ArrowRight } from 'lucide-react';
import { MARKET_IMAGES } from '../data/products';
import { AppRoute } from '../types/market';
import { MarketImage } from './MarketImage';

interface HeroSectionProps {
  onShopNow: (route: AppRoute) => void;
}

export function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <section aria-label="Online Wet Market Banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
      <div className="relative overflow-hidden rounded-2xl border border-[#DCE3D5] bg-[#142818] min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center">
        <MarketImage
          src={MARKET_IMAGES.hero}
          alt="Fresh Filipino wet market stall with baskets of eggplant, bitter gourd, tomatoes, leafy greens, fresh meats, and milkfish on ice"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Measured contrast scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#0D1E11]/72 md:bg-transparent md:bg-gradient-to-r md:from-[#0D1E11]/92 md:via-[#0D1E11]/72 md:to-[#0D1E11]/20"
        />

        <div className="relative z-10 max-w-2xl px-6 py-12 sm:px-12 lg:px-14 space-y-5">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#D1FAE5]">
            Morning Harvest &amp; Daily Catch · Metro Manila &amp; Nearby Luzon
          </p>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight text-balance">
            Your Modern Filipino Wet Market, Freshly Delivered.
          </h1>

          <p className="text-base sm:text-lg text-[#E6EFE8] leading-relaxed max-w-xl">
            Browse farm-direct lowland &amp; highland vegetables, butcher-cut pork and beef, fresh poultry, and daily coastal seafood at honest palengke prices in Philippine Peso (₱).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onShopNow('products')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-[#14532D] hover:bg-[#ECFDF5] font-semibold text-base shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onShopNow('categories')}
              className="inline-flex items-center px-5 py-3.5 rounded-xl border border-white/40 text-white hover:bg-white/10 font-medium text-sm sm:text-base transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Browse Categories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
