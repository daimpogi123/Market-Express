import { ArrowLeft } from 'lucide-react';
import { FAQ_ITEMS } from '../data/reviews';
import { AppRoute } from '../types/market';

interface SupportPageProps {
  topic: 'faq' | 'privacy' | 'terms';
  onNavigate: (route: AppRoute) => void;
}

export function SupportPage({ topic, onNavigate }: SupportPageProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      <div className="space-y-3 pb-6 border-b border-[#E2E8DC]">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#166534] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Home</span>
        </button>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A241B] tracking-tight">
          {topic === 'faq'
            ? 'Frequently Asked Questions (FAQs)'
            : topic === 'privacy'
            ? 'Privacy Policy'
            : 'Terms and Conditions'}
        </h1>
        <p className="text-sm text-[#5A6B5D]">
          Market Express Online (MEO) Customer Support · Effective November 2026
        </p>
      </div>

      {topic === 'faq' && (
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.q}
              className="bg-white rounded-xl border border-[#E2E8DC] p-5 sm:p-6 space-y-2 shadow-xs"
            >
              <h2 className="text-base font-semibold text-[#1A241B]">{item.q}</h2>
              <p className="text-sm text-[#4A584C] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      )}

      {topic === 'privacy' && (
        <div className="bg-white rounded-2xl border border-[#E2E8DC] p-6 sm:p-8 space-y-5 text-sm text-[#4A584C] leading-relaxed shadow-xs">
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-[#1A241B]">1. Information We Collect</h2>
            <p>
              When you place a market order or select doorstep delivery, we collect only your name, mobile contact number, delivery address, and order items needed to fulfill and dispatch your produce and meats accurately.
            </p>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-[#1A241B]">2. Payment Security</h2>
            <p>
              Digital transactions via GCash, PayMaya, and Credit Cards are processed securely. Market Express Online does not store full card CVV details on device storage.
            </p>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-[#1A241B]">3. Local Cart &amp; Order History</h2>
            <p>
              Your shopping basket and recent order receipts are kept in your browser session storage for convenience. You may clear them anytime or contact support at support@marketexpressonline.ph.
            </p>
          </div>
        </div>
      )}

      {topic === 'terms' && (
        <div className="bg-white rounded-2xl border border-[#E2E8DC] p-6 sm:p-8 space-y-5 text-sm text-[#4A584C] leading-relaxed shadow-xs">
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-[#1A241B]">1. Freshness &amp; Weight Standards</h2>
            <p>
              All wet market products are priced in Philippine Peso (₱) per kilogram (kg). Our stall packers weigh items on calibrated digital scales prior to sealing.
            </p>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-[#1A241B]">2. Stock Availability</h2>
            <p>
              Market inventory updates dynamically. Items with zero remaining stock appear in grayscale and cannot be ordered until the next morning farm or coastal delivery.
            </p>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-[#1A241B]">3. Delivery Fees &amp; Pickup</h2>
            <p>
              Store pickup at designated Metro Manila hubs is free of charge. Doorstep delivery shipping charges vary by buyer location zone (₱65 to ₱145) and are displayed transparently prior to order confirmation.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
