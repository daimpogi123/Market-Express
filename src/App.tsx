import { useEffect, useState } from 'react';
import { AccountModal } from './components/AccountModal';
import { AboutPage } from './components/AboutPage';
import { CartCheckoutPage } from './components/CartCheckoutPage';
import { CatalogView } from './components/CatalogView';
import { CategoriesPage } from './components/CategoriesPage';
import { CategoryShowcase } from './components/CategoryShowcase';
import { CustomerReviews } from './components/CustomerReviews';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SupportPage } from './components/SupportPage';
import { INITIAL_PRODUCTS } from './data/products';
import { AppRoute, CartItem, MeatGroup, OrderRecord, Product } from './types/market';
import {
  addOrUpdateCartItem,
  deductPurchasedStock,
  formatQty,
  setCartItemQuantity,
} from './utils/marketLogic';

const ROUTE_PATHS: Record<AppRoute, string> = {
  home: '/',
  products: '/products',
  categories: '/categories',
  vegetables: '/vegetables',
  meats: '/meats',
  about: '/about',
  cart: '/cart',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
};

function getRouteFromPath(pathname: string): AppRoute {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const entry = (Object.entries(ROUTE_PATHS) as [AppRoute, string][]).find(
    ([, path]) => path === clean
  );
  return entry ? entry[0] : 'home';
}

const STORAGE_KEYS = {
  cart: 'palengke_fresh_cart_v1',
  orders: 'palengke_fresh_orders_v1',
  stock: 'palengke_fresh_stock_v1',
};

function loadInitialProducts(): Product[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.stock);
    if (!raw) return INITIAL_PRODUCTS;
    const savedMap = JSON.parse(raw) as Record<string, number>;
    return INITIAL_PRODUCTS.map((p) =>
      typeof savedMap[p.id] === 'number' ? { ...p, stockQty: savedMap[p.id] } : p
    );
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.cart);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadInitialOrders(): OrderRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.orders);
    return raw ? (JSON.parse(raw) as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    getRouteFromPath(window.location.pathname)
  );
  const [products, setProducts] = useState<Product[]>(loadInitialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadInitialCart);
  const [orders, setOrders] = useState<OrderRecord[]>(loadInitialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialMeatTab, setInitialMeatTab] = useState<MeatGroup | 'all'>('all');
  const [accountOpen, setAccountOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      const stockMap: Record<string, number> = {};
      for (const p of products) {
        stockMap[p.id] = p.stockQty;
      }
      window.localStorage.setItem(STORAGE_KEYS.stock, JSON.stringify(stockMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [products]);

  const navigate = (nextRoute: AppRoute, meatTab: MeatGroup | 'all' = 'all') => {
    setInitialMeatTab(meatTab);
    setRoute(nextRoute);
    const targetPath = ROUTE_PATHS[nextRoute] ?? '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSearchSubmit = (query: string, shouldNavigateToAll = false) => {
    setSearchQuery(query);
    if (shouldNavigateToAll || (route !== 'products' && route !== 'vegetables' && route !== 'meats')) {
      navigate('products');
    }
  };

  const handleAddToCart = (product: Product, qty: number) => {
    setCartItems((prev) => addOrUpdateCartItem(prev, product, qty));
    setToastMessage(`Added ${formatQty(qty, product.unitLabel)} of ${product.name} to cart.`);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleSetCartQty = (product: Product, qty: number) => {
    setCartItems((prev) => setCartItemQuantity(prev, product, qty));
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleCompleteOrder = (order: OrderRecord) => {
    setProducts((prev) => deductPurchasedStock(prev, cartItems));
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
  };

  const vegCount = products.filter((p) => p.category === 'vegetables').length;
  const meatCount = products.filter((p) => p.category === 'meats').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF7] text-[#1A241B]">
      <Header
        currentRoute={route}
        onNavigate={(r) => navigate(r)}
        searchQuery={searchQuery}
        onSearchSubmit={handleSearchSubmit}
        cartItemCount={cartItems.length}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <main className="flex-1">
        {route === 'home' && (
          <>
            <HeroSection onShopNow={(r) => navigate(r)} />
            <CategoryShowcase
              onSelectCategory={(r) => navigate(r)}
              vegCount={vegCount}
              meatCount={meatCount}
            />
            <CustomerReviews />
          </>
        )}

        {route === 'categories' && (
          <CategoriesPage
            onNavigate={(r, meatTab) => navigate(r, meatTab ?? 'all')}
            vegCount={vegCount}
            meatCount={meatCount}
          />
        )}

        {route === 'vegetables' && (
          <CatalogView
            key="vegetables"
            mode="vegetables"
            products={products}
            cartItems={cartItems}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToCart={handleAddToCart}
            onNavigate={(r) => navigate(r)}
          />
        )}

        {route === 'meats' && (
          <CatalogView
            key={`meats-${initialMeatTab}`}
            mode="meats"
            products={products}
            cartItems={cartItems}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToCart={handleAddToCart}
            onNavigate={(r) => navigate(r)}
            initialMeatTab={initialMeatTab}
          />
        )}

        {route === 'products' && (
          <CatalogView
            key="all-products"
            mode="all"
            products={products}
            cartItems={cartItems}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToCart={handleAddToCart}
            onNavigate={(r) => navigate(r)}
          />
        )}

        {route === 'about' && <AboutPage onNavigate={(r) => navigate(r)} />}

        {route === 'cart' && (
          <CartCheckoutPage
            products={products}
            cartItems={cartItems}
            onSetCartQty={handleSetCartQty}
            onRemoveItem={handleRemoveCartItem}
            onNavigate={(r) => navigate(r)}
            onCompleteOrder={handleCompleteOrder}
          />
        )}

        {(route === 'faq' || route === 'privacy' || route === 'terms') && (
          <SupportPage topic={route} onNavigate={(r) => navigate(r)} />
        )}
      </main>

      <Footer onNavigate={(r) => navigate(r)} />

      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        orders={orders}
        onShopNow={() => navigate('products')}
      />

      {toastMessage && route !== 'cart' && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#142416] text-white px-4 py-3 rounded-xl shadow-lg border border-white/15 flex items-center justify-between gap-4"
        >
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              navigate('cart');
            }}
            className="text-xs font-bold text-[#86EFAC] hover:underline whitespace-nowrap shrink-0"
          >
            Review Cart
          </button>
        </div>
      )}
    </div>
  );
}
