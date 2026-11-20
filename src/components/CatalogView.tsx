import { useMemo, useState } from 'react';
import { ArrowRight, Search, ShoppingBasket, SlidersHorizontal } from 'lucide-react';
import {
  AppRoute,
  CartItem,
  MeatGroup,
  Product,
  ProductSubGroup,
  SeafoodSubGroup,
  VegetableGroup,
} from '../types/market';
import {
  filterProducts,
  formatPeso,
  getCartQtyForProduct,
  getRemainingStock,
  buildOrderLineItems,
  calculateSubtotal,
} from '../utils/marketLogic';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  mode: 'vegetables' | 'meats' | 'all';
  products: Product[];
  cartItems: CartItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddToCart: (product: Product, qty: number) => void;
  onNavigate: (route: AppRoute) => void;
  initialMeatTab?: MeatGroup | 'all';
}

export function CatalogView({
  mode,
  products,
  cartItems,
  searchQuery,
  onSearchChange,
  onAddToCart,
  onNavigate,
  initialMeatTab = 'all',
}: CatalogViewProps) {
  const [vegFilter, setVegFilter] = useState<VegetableGroup | 'all'>('all');
  const [meatFilter, setMeatFilter] = useState<MeatGroup | 'all'>(initialMeatTab);
  const [seafoodFilter, setSeafoodFilter] = useState<SeafoodSubGroup | 'all'>('all');
  const [allCatFilter, setAllCatFilter] = useState<ProductSubGroup | 'all'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>(
    'featured'
  );

  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      category: mode === 'all' ? 'all' : mode,
      subGroup:
        mode === 'vegetables'
          ? vegFilter
          : mode === 'meats'
          ? meatFilter
          : allCatFilter,
      seafoodGroup:
        mode === 'meats' && meatFilter === 'seafood' ? seafoodFilter : 'all',
      query: searchQuery,
      inStockOnly,
      sortBy,
    });
  }, [
    products,
    mode,
    vegFilter,
    meatFilter,
    seafoodFilter,
    allCatFilter,
    searchQuery,
    inStockOnly,
    sortBy,
  ]);

  const cartLines = useMemo(
    () => buildOrderLineItems(cartItems, products),
    [cartItems, products]
  );
  const cartSubtotal = useMemo(() => calculateSubtotal(cartLines), [cartLines]);

  const pageTitle =
    mode === 'vegetables'
      ? 'Fresh Market Vegetables'
      : mode === 'meats'
      ? 'Fresh Meats & Coastal Seafood'
      : 'All Market Products';

  const pageSubtitle =
    mode === 'vegetables'
      ? 'Select your preferred harvest items at prevailing Philippine wet market SRP (₱/kg). Sold-out produce automatically dims to grayscale.'
      : mode === 'meats'
      ? 'Browse butcher-cut Pork, Beef, Chicken, and daily Seafoods at Philippine wet market SRP (₱/kg). Sold-out cuts display in grayscale.'
      : 'Browse our complete online Filipino wet market catalog priced at prevailing Philippine wet market SRP (₱/kg).';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Header & Cross-Category Switch */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#E2E8DC]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-[#5A6B5D]">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#166534] underline-offset-4 hover:underline"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#1A241B] font-semibold">
              {mode === 'vegetables'
                ? 'Vegetables'
                : mode === 'meats'
                ? 'Meats & Seafood'
                : 'Products'}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A241B] tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#4A584C] leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('vegetables')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              mode === 'vegetables'
                ? 'bg-[#166534] text-white'
                : 'bg-white border border-[#DCE3D5] text-[#1A241B] hover:bg-[#F0F3EC]'
            }`}
          >
            Vegetables
          </button>
          <button
            type="button"
            onClick={() => onNavigate('meats')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              mode === 'meats'
                ? 'bg-[#166534] text-white'
                : 'bg-white border border-[#DCE3D5] text-[#1A241B] hover:bg-[#F0F3EC]'
            }`}
          >
            Meats &amp; Seafood
          </button>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              mode === 'all'
                ? 'bg-[#166534] text-white'
                : 'bg-white border border-[#DCE3D5] text-[#1A241B] hover:bg-[#F0F3EC]'
            }`}
          >
            All Products
          </button>
        </div>
      </div>

      {/* Buyer Selection Prompt Banner when Cart Has Items */}
      {cartItems.length > 0 && (
        <div
          role="region"
          aria-label="Cart review prompt"
          className="rounded-xl bg-[#ECFDF5] border border-[#BBF7D0] px-4 py-3.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <ShoppingBasket className="w-5 h-5 text-[#166534] shrink-0" aria-hidden="true" />
            <p className="text-sm text-[#14532D]">
              <span className="font-semibold tabular-nums">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
              </span>{' '}
              (Subtotal: <span className="font-bold tabular-nums">{formatPeso(cartSubtotal)}</span>). Done selecting? Review and modify your items before checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
          >
            <span>Review Cart &amp; Checkout</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Filter & Sort Controls */}
      <div className="bg-white rounded-xl border border-[#E2E8DC] p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Sub-group filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by stall section">
            {mode === 'vegetables' && (
              <>
                {[
                  { id: 'all', label: 'All Vegetables (36)' },
                  { id: 'gourds-fruiting', label: 'Gourds & Fruiting' },
                  { id: 'leafy-greens', label: 'Leafy Greens' },
                  { id: 'roots-aromatics', label: 'Roots & Aromatics' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setVegFilter(tab.id as VegetableGroup | 'all')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      vegFilter === tab.id
                        ? 'bg-[#166534] text-white'
                        : 'bg-[#F5F7F2] text-[#4A584C] hover:text-[#1A241B]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </>
            )}

            {mode === 'meats' && (
              <>
                {[
                  { id: 'all', label: 'All Meats & Seafood' },
                  { id: 'pork', label: 'Pork (9)' },
                  { id: 'beef', label: 'Beef (11)' },
                  { id: 'chicken', label: 'Chicken (10)' },
                  { id: 'seafood', label: 'Seafood (17)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setMeatFilter(tab.id as MeatGroup | 'all');
                      if (tab.id !== 'seafood') setSeafoodFilter('all');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      meatFilter === tab.id
                        ? 'bg-[#166534] text-white'
                        : 'bg-[#F5F7F2] text-[#4A584C] hover:text-[#1A241B]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </>
            )}

            {mode === 'all' && (
              <>
                {[
                  { id: 'all', label: 'All Stalls' },
                  { id: 'gourds-fruiting', label: 'Gourds & Fruiting' },
                  { id: 'leafy-greens', label: 'Leafy Greens' },
                  { id: 'roots-aromatics', label: 'Roots & Aromatics' },
                  { id: 'pork', label: 'Pork' },
                  { id: 'beef', label: 'Beef' },
                  { id: 'chicken', label: 'Chicken' },
                  { id: 'seafood', label: 'Seafood' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAllCatFilter(tab.id as ProductSubGroup | 'all')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      allCatFilter === tab.id
                        ? 'bg-[#166534] text-white'
                        : 'bg-[#F5F7F2] text-[#4A584C] hover:text-[#1A241B]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Search input, In-Stock toggle, Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-initial sm:w-52">
              <label htmlFor="catalog-inline-search" className="sr-only">
                Filter products by name
              </label>
              <input
                id="catalog-inline-search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter items..."
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-[#F9FAF7] border border-[#DCE3D5] rounded-lg text-[#1A241B] placeholder:text-[#6B7A6D] focus:outline-none focus:border-[#166534]"
              />
              <Search
                className="w-4 h-4 text-[#5A6B5D] absolute left-2.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#1A241B] cursor-pointer select-none px-2.5 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#F9FAF7]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#DCE3D5] text-[#166534] focus:ring-[#166534]"
              />
              <span className="whitespace-nowrap">In stock only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#5A6B5D]" aria-hidden="true" />
              <label htmlFor="catalog-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'name-asc'
                  )
                }
                className="py-1.5 px-2.5 text-xs sm:text-sm bg-[#F9FAF7] border border-[#DCE3D5] rounded-lg text-[#1A241B] focus:outline-none focus:border-[#166534]"
              >
                <option value="featured">Sort: Market Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seafood sub-navigation when Seafood tab is active */}
        {mode === 'meats' && meatFilter === 'seafood' && (
          <div className="pt-3 border-t border-[#EEF2EA] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#5A6B5D] mr-1">Seafood Section:</span>
            {[
              { id: 'all', label: 'All Seafood (17)' },
              { id: 'fish', label: 'Fish (6)' },
              { id: 'crustaceans', label: 'Crustaceans (3)' },
              { id: 'mollusks-shellfish', label: 'Mollusks & Shellfish (4)' },
              { id: 'dried-smoked', label: 'Dried & Smoked (4)' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSeafoodFilter(sub.id as SeafoodSubGroup | 'all')}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  seafoodFilter === sub.id
                    ? 'bg-[#14532D] text-white'
                    : 'bg-[#F0F3EC] text-[#4A584C] hover:text-[#1A241B]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#5A6B5D] tabular-nums">
        <p>
          Showing <span className="font-semibold text-[#1A241B]">{filteredProducts.length}</span>{' '}
          {filteredProducts.length === 1 ? 'item' : 'items'}
          {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ''}
        </p>
        {searchQuery.trim() && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-[#166534] font-medium hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8DC] p-12 text-center space-y-3">
          <p className="font-display text-xl font-bold text-[#1A241B]">
            No market items match your filter
          </p>
          <p className="text-sm text-[#5A6B5D] max-w-md mx-auto">
            Try clearing your search keyword or switching stall sections to view available fresh produce and meats.
          </p>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              setVegFilter('all');
              setMeatFilter('all');
              setSeafoodFilter('all');
              setAllCatFilter('all');
              setInStockOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-[#166534] text-white text-sm font-semibold hover:bg-[#14532D]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCartQty={getCartQtyForProduct(cartItems, product.id)}
              remainingStock={getRemainingStock(product, cartItems)}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
