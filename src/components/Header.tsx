import { FormEvent, useState } from 'react';
import { Menu, Search, ShoppingBasket, User, X } from 'lucide-react';
import { AppRoute } from '../types/market';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  searchQuery: string;
  onSearchSubmit: (query: string, shouldNavigateToAll?: boolean) => void;
  cartItemCount: number;
  onOpenAccount: () => void;
}

export function Header({
  currentRoute,
  onNavigate,
  searchQuery,
  onSearchSubmit,
  cartItemCount,
  onOpenAccount,
}: HeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit(inputValue, true);
    setMobileMenuOpen(false);
  };

  const navItems: { route: AppRoute; label: string }[] = [
    { route: 'home', label: 'Home' },
    { route: 'products', label: 'Products' },
    { route: 'categories', label: 'Categories' },
    { route: 'about', label: 'About Us' },
  ];

  const isNavActive = (route: AppRoute) => {
    if (route === 'categories' && (currentRoute === 'vegetables' || currentRoute === 'meats')) {
      return true;
    }
    return currentRoute === route;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E2E8DC]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-6 xl:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-3 xl:gap-8">
        {/* Zone 1: Upper-Left Website Logo */}
        <button
          type="button"
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          aria-label="MEO — Market Express Online Home"
          className="flex items-center text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534] rounded-md"
        >
          <BrandLogo theme="light" />
        </button>

        {/* Zone 2: Navigation Links + Search Bar */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-7 flex-1 justify-center">
          <nav aria-label="Primary navigation" className="flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => {
              const active = isNavActive(item.route);
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => onNavigate(item.route)}
                  className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#166534] ${
                    active
                      ? 'text-[#166534] font-semibold'
                      : 'text-[#4A584C] hover:text-[#1A241B]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#166534] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <form onSubmit={handleSubmit} className="relative w-44 xl:w-72 shrink-0" role="search">
            <label htmlFor="desktop-market-search" className="sr-only">
              Search market products
            </label>
            <input
              id="desktop-market-search"
              type="search"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (currentRoute === 'products') {
                  onSearchSubmit(e.target.value, false);
                }
              }}
              placeholder="Search talong, bangus, liempo..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F7F2] border border-[#DCE3D5] rounded-lg text-[#1A241B] placeholder:text-[#6B7A6D] focus:outline-none focus:bg-white focus:border-[#166534] transition-colors"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5A6B5D] hover:text-[#166534]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        {/* Zone 3: Right Side Account & Shopping Cart Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAccount}
            aria-label="Customer account and order history"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-[#E2E8DC] bg-white hover:bg-[#F5F7F2] text-[#1A241B] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('cart');
              setMobileMenuOpen(false);
            }}
            aria-label={`Shopping cart with ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}`}
            className={`relative h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg flex items-center gap-1.5 sm:gap-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534] ${
              currentRoute === 'cart'
                ? 'bg-[#14532D] text-white'
                : 'bg-[#166534] hover:bg-[#14532D] text-white'
            }`}
          >
            <ShoppingBasket className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span
              data-testid="cart-badge-count"
              className="tabular-nums inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded-md bg-white text-[#14532D]"
            >
              {cartItemCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-9 h-9 rounded-lg border border-[#E2E8DC] bg-white hover:bg-[#F5F7F2] text-[#1A241B] flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8DC] bg-white px-4 py-4 space-y-4">
          <form onSubmit={handleSubmit} className="relative" role="search">
            <label htmlFor="mobile-market-search" className="sr-only">
              Search market products
            </label>
            <input
              id="mobile-market-search"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search vegetables, pork, beef, seafood..."
              className="w-full pl-9 pr-20 py-2.5 text-sm bg-[#F5F7F2] border border-[#DCE3D5] rounded-lg text-[#1A241B] placeholder:text-[#6B7A6D] focus:outline-none focus:bg-white focus:border-[#166534]"
            />
            <Search
              className="w-4 h-4 text-[#5A6B5D] absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold bg-[#166534] text-white rounded-md"
            >
              Search
            </button>
          </form>

          <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const active = isNavActive(item.route);
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => {
                    onNavigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    active
                      ? 'bg-[#ECFDF5] text-[#166534] font-semibold border border-[#BBF7D0]'
                      : 'bg-[#F5F7F2] text-[#1A241B] hover:bg-[#EAF0E4]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
