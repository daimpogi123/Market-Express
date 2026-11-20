import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { MARKET_IMAGES } from '../data/products';
import { AppRoute } from '../types/market';
import { MarketImage } from './MarketImage';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const pillars = [
    {
      icon: CheckCircle2,
      title: 'Harvested & Landed Fresh Daily',
      description:
        'Our produce buyers source directly from Benguet, Pangasinan, Nueva Ecija, and Batangas before sunrise so greens arrive crisp and meats stay chilled.',
    },
    {
      icon: ShieldCheck,
      title: 'Clean, Hygienic Handling',
      description:
        'Every pork, beef, chicken, and seafood order is trimmed, weighed on calibrated digital scales, and packed in sealed food-grade containers.',
    },
    {
      icon: Wallet,
      title: 'True Wet Market Affordability',
      description:
        'Transparent Philippine Peso (₱) per-kilogram pricing with zero hidden supermarket markups—helping families stretch their weekly grocery budget.',
    },
    {
      icon: Truck,
      title: 'Convenient Pickup or Delivery',
      description:
        'Skip early-morning traffic and crowded aisles. Pick up your packed basket at our neighborhood hubs or choose insulated doorstep delivery.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14">
      {/* Split Story Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          <p className="text-xs font-semibold tracking-wide text-[#166534] uppercase">
            About Market Express Online (MEO)
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A241B] tracking-tight text-balance">
            Bringing the Heart of the Filipino Wet Market Online
          </h1>
          <p className="text-base text-[#4A584C] leading-relaxed">
            Market Express Online (MEO) was built for modern Filipino households who love cooking with genuine wet market ingredients—fresh talong, leafy kangkong, newly butchered liempo, and morning-catch bangus—without needing to wake up at 4:00 AM.
          </p>
          <p className="text-base text-[#4A584C] leading-relaxed">
            By partnering directly with local farmers, accredited meat stalls, and coastal fishermen, we make buying fresh vegetables and meats effortless, transparent, and consistently dependable from stall to kitchen counter.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('vegetables')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-colors"
            >
              <span>Shop Vegetables</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('meats')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#DCE3D5] bg-white hover:bg-[#F0F3EC] text-[#1A241B] text-sm font-semibold transition-colors"
            >
              <span>Shop Meats &amp; Seafood</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[320px] rounded-2xl overflow-hidden border border-[#E2E8DC] bg-[#F0F3EC]">
            <MarketImage
              src={MARKET_IMAGES.about}
              alt="Friendly Filipino market vendor packing fresh vegetables into a woven market basket"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 4 Core Commitments */}
      <div className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A241B]">
            Why Families Trust Market Express Online
          </h2>
          <p className="text-sm sm:text-base text-[#4A584C] mt-1">
            Four standards that guide every market basket we pack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-xl border border-[#E2E8DC] p-6 space-y-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] text-[#166534] flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-[#1A241B]">{pillar.title}</h3>
                <p className="text-sm text-[#4A584C] leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
