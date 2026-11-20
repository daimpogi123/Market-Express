import { Mail, MapPin, Phone } from 'lucide-react';
import { AppRoute } from '../types/market';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#142416] text-[#E6EFE8] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand & Market Mission */}
          <div className="space-y-3">
            <div>
              <BrandLogo theme="dark" />
            </div>
            <p className="text-sm text-[#B8C7BA] leading-relaxed">
              Modern Filipino online wet market bringing farm-fresh vegetables, butcher-cut meats, and daily coastal catch straight to your kitchen.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Contact Information</h3>
            <ul className="space-y-2.5 text-sm text-[#C8D6CA]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#86EFAC] mt-0.5 shrink-0" aria-hidden="true" />
                <span>42 Kamuning Rd, Quezon City, Metro Manila 1103</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#86EFAC] shrink-0" aria-hidden="true" />
                <span className="tabular-nums">+63 (02) 8555-0194 · 0917-824-5510</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#86EFAC] shrink-0" aria-hidden="true" />
                <span>support@marketexpressonline.ph</span>
              </li>
            </ul>
          </div>

          {/* Market Navigation & Social Media */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Market &amp; Social</h3>
            <ul className="space-y-2 text-sm text-[#C8D6CA]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('vegetables')}
                  className="hover:text-white transition-colors"
                >
                  Vegetables Stall
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('meats')}
                  className="hover:text-white transition-colors"
                >
                  Meats &amp; Seafood Stall
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li className="pt-1 flex items-center gap-4 text-xs text-[#9BB09F]">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline-offset-4 hover:underline"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/core_memoko/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline-offset-4 hover:underline"
                >
                  Instagram
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline-offset-4 hover:underline"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Customer Support</h3>
            <ul className="space-y-2 text-sm text-[#C8D6CA]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors text-left"
                >
                  Frequently Asked Questions (FAQs)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9BB09F]">
          <p>© 2026 Market Express Online (MEO). All rights reserved.</p>
          <p>Fresh Philippine Produce &amp; Daily Harvests · Priced in Philippine Peso (₱)</p>
        </div>
      </div>
    </footer>
  );
}
