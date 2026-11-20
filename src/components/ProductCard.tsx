import { useState } from 'react';
import { Check, Minus, Plus, ShoppingBasket } from 'lucide-react';
import { Product } from '../types/market';
import { formatPeso, formatQty } from '../utils/marketLogic';
import { MarketImage } from './MarketImage';

interface ProductCardProps {
  product: Product;
  inCartQty: number;
  remainingStock: number;
  onAddToCart: (product: Product, quantity: number) => void;
}

const SUBGROUP_LABELS: Record<string, string> = {
  'gourds-fruiting': 'Gourds & Fruiting',
  'leafy-greens': 'Leafy Greens',
  'roots-aromatics': 'Roots & Aromatics',
  pork: 'Pork',
  beef: 'Beef',
  chicken: 'Chicken',
  seafood: 'Seafood',
};

const SEAFOOD_LABELS: Record<string, string> = {
  fish: 'Fresh Fish',
  crustaceans: 'Crustaceans',
  'mollusks-shellfish': 'Mollusks & Shellfish',
  'dried-smoked': 'Dried & Smoked',
};

export function ProductCard({
  product,
  inCartQty,
  remainingStock,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = remainingStock <= 0;
  const [selectedQty, setSelectedQty] = useState<number>(product.minQty);
  const [justAdded, setJustAdded] = useState(false);

  const effectiveQty = Math.min(selectedQty, Math.max(product.minQty, remainingStock));

  const handleDecrease = () => {
    setSelectedQty((prev) => {
      const next = Number((prev - product.stepQty).toFixed(2));
      return Math.max(product.minQty, next);
    });
  };

  const handleIncrease = () => {
    setSelectedQty((prev) => {
      const next = Number((prev + product.stepQty).toFixed(2));
      return Math.min(remainingStock, next);
    });
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    const qtyToAdd = Math.min(effectiveQty, remainingStock);
    if (qtyToAdd <= 0) return;
    onAddToCart(product, qtyToAdd);
    setSelectedQty(product.minQty);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const groupLabel = product.seafoodGroup
    ? `${SUBGROUP_LABELS[product.subGroup]} · ${SEAFOOD_LABELS[product.seafoodGroup]}`
    : SUBGROUP_LABELS[product.subGroup] ?? product.category;

  return (
    <article
      data-testid={`product-card-${product.id}`}
      data-out-of-stock={isOutOfStock ? 'true' : 'false'}
      className={`group rounded-xl border bg-white overflow-hidden flex flex-col transition-all duration-200 ${
        isOutOfStock
          ? 'border-[#E5E7EB] bg-[#F8F9F7]'
          : 'border-[#E2E8DC] shadow-xs hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0F3EC]">
        <MarketImage
          src={product.imageUrl}
          alt={product.name}
          objectPosition={product.imagePosition ?? 'center'}
          imageScale={product.imageScale ?? 1}
          grayscale={isOutOfStock}
          className="w-full h-full"
        />
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-[#5A6B5D]">
            <span className="truncate">{groupLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="shrink-0 truncate">{product.origin}</span>
          </div>

          <h3
            className={`text-base font-semibold leading-snug ${
              isOutOfStock ? 'text-[#6B7280]' : 'text-[#1A241B]'
            }`}
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#5A6B5D] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-[#EEF2EA]">
          <div className="flex items-baseline justify-between gap-2">
            <p
              className={`text-lg font-bold tabular-nums ${
                isOutOfStock ? 'text-[#6B7280]' : 'text-[#166534]'
              }`}
            >
              {formatPeso(product.pricePerKg)}
              <span className="text-xs font-normal text-[#5A6B5D]">
                {' '}
                / {product.unitLabel}
              </span>
            </p>

            <p
              className={`text-xs font-medium tabular-nums ${
                isOutOfStock
                  ? 'text-[#B91C1C]'
                  : remainingStock <= 5
                  ? 'text-[#B45309]'
                  : 'text-[#4A584C]'
              }`}
            >
              {isOutOfStock
                ? 'Out of stock'
                : `${formatQty(remainingStock, product.unitLabel)} available`}
            </p>
          </div>

          {inCartQty > 0 && (
            <p className="text-xs font-semibold text-[#166534] tabular-nums">
              In your cart: {formatQty(inCartQty, product.unitLabel)}
            </p>
          )}

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center border rounded-lg h-10 ${
                isOutOfStock
                  ? 'border-[#E5E7EB] bg-[#F3F4F6] opacity-60'
                  : 'border-[#DCE3D5] bg-[#F9FAF7]'
              }`}
            >
              <button
                type="button"
                onClick={handleDecrease}
                disabled={isOutOfStock || effectiveQty <= product.minQty}
                aria-label={`Decrease quantity for ${product.name}`}
                className="w-8 h-full flex items-center justify-center text-[#1A241B] disabled:text-[#9CA3AF] hover:bg-[#EAF0E4] rounded-l-lg transition-colors"
              >
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <span className="px-2 text-xs font-semibold text-[#1A241B] tabular-nums whitespace-nowrap min-w-[4.25rem] text-center">
                {isOutOfStock ? `0 ${product.unitLabel}` : formatQty(effectiveQty, product.unitLabel)}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                disabled={isOutOfStock || effectiveQty >= remainingStock}
                aria-label={`Increase quantity for ${product.name}`}
                className="w-8 h-full flex items-center justify-center text-[#1A241B] disabled:text-[#9CA3AF] hover:bg-[#EAF0E4] rounded-r-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              aria-label={
                isOutOfStock
                  ? `${product.name} is out of stock`
                  : `Add ${product.name} to cart`
              }
              className={`flex-1 h-10 px-3 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534] ${
                isOutOfStock
                  ? 'bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed'
                  : justAdded
                  ? 'bg-[#14532D] text-white'
                  : 'bg-[#166534] hover:bg-[#14532D] text-white'
              }`}
            >
              {isOutOfStock ? (
                <span>Out of Stock</span>
              ) : justAdded ? (
                <>
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBasket className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
