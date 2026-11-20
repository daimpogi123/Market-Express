import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBasket,
  Smartphone,
  Store,
  Trash2,
  Truck,
} from 'lucide-react';
import { DELIVERY_ZONES, PICKUP_HUBS } from '../data/reviews';
import {
  AppRoute,
  CartItem,
  CheckoutFormState,
  OrderRecord,
  PaymentMethod,
  Product,
} from '../types/market';
import {
  buildOrderLineItems,
  calculateOrderTotal,
  calculateShippingFee,
  calculateSubtotal,
  formatPeso,
  formatQty,
  validateCheckoutForm,
} from '../utils/marketLogic';
import { MarketImage } from './MarketImage';

interface CartCheckoutPageProps {
  products: Product[];
  cartItems: CartItem[];
  onSetCartQty: (product: Product, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (route: AppRoute) => void;
  onCompleteOrder: (order: OrderRecord) => void;
}

const INITIAL_FORM: CheckoutFormState = {
  fulfillmentType: 'delivery',
  deliveryZoneId: DELIVERY_ZONES[0].id,
  pickupHubId: PICKUP_HUBS[0].id,
  pickupWindow: '8:00 AM – 10:00 AM',
  customerName: '',
  customerPhone: '',
  deliveryAddress: '',
  deliveryNotes: '',
  paymentMethod: 'gcash',
  gcashNumber: '',
  paymayaNumber: '',
  cardHolderName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  gcash: 'GCash',
  paymaya: 'PayMaya (Maya)',
  credit_card: 'Credit Card (Visa / Mastercard)',
};

export function CartCheckoutPage({
  products,
  cartItems,
  onSetCartQty,
  onRemoveItem,
  onNavigate,
  onCompleteOrder,
}: CartCheckoutPageProps) {
  const [step, setStep] = useState<'review' | 'checkout' | 'confirmed'>('review');
  const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  );

  const lineItems = useMemo(
    () => buildOrderLineItems(cartItems, products),
    [cartItems, products]
  );

  const subtotal = useMemo(() => calculateSubtotal(lineItems), [lineItems]);
  const shippingFee = useMemo(
    () =>
      calculateShippingFee(
        form.fulfillmentType,
        form.deliveryZoneId,
        DELIVERY_ZONES
      ),
    [form.fulfillmentType, form.deliveryZoneId]
  );
  const total = useMemo(
    () => calculateOrderTotal(subtotal, shippingFee),
    [subtotal, shippingFee]
  );

  const selectedZone = DELIVERY_ZONES.find((z) => z.id === form.deliveryZoneId);
  const selectedHub = PICKUP_HUBS.find((h) => h.id === form.pickupHubId);

  const updateField = <K extends keyof CheckoutFormState>(
    key: K,
    value: CheckoutFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const fulfillmentLabel =
      form.fulfillmentType === 'delivery'
        ? `Delivery — ${selectedZone?.label ?? 'Metro Manila'} (${form.deliveryAddress.trim()})`
        : `Pickup — ${selectedHub?.name ?? 'Market Hub'} (${form.pickupWindow})`;

    const newOrder: OrderRecord = {
      orderNumber: `MEO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      items: lineItems,
      subtotal,
      shippingFee,
      total,
      fulfillmentType: form.fulfillmentType,
      fulfillmentLabel,
      paymentMethod: form.paymentMethod,
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      status: 'Confirmed — Packing Fresh Produce & Cuts',
    };

    setConfirmedOrder(newOrder);
    onCompleteOrder(newOrder);
    setStep('confirmed');
  };

  if (step === 'confirmed' && confirmedOrder) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#DCE3D5] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#166534] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#166534]">
                Order Confirmed
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A241B]">
                Order #{confirmedOrder.orderNumber}
              </h1>
              <p className="text-sm text-[#4A584C]">
                Thank you, <span className="font-semibold text-[#1A241B]">{confirmedOrder.customerName}</span>. Your market order is now being freshly weighed and packed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F9FAF7] rounded-xl border border-[#E2E8DC] p-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#5A6B5D]">Fulfillment</p>
              <p className="font-medium text-[#1A241B]">{confirmedOrder.fulfillmentLabel}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#5A6B5D]">Payment Method</p>
              <p className="font-medium text-[#1A241B]">
                {PAYMENT_LABELS[confirmedOrder.paymentMethod]}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#1A241B]">Itemized Market Receipt</h2>
            <ul className="divide-y divide-[#EEF2EA] border border-[#E2E8DC] rounded-xl overflow-hidden">
              {confirmedOrder.items.map((item) => (
                <li
                  key={item.productId}
                  className="px-4 py-3 flex items-center justify-between gap-4 text-sm bg-white"
                >
                  <div>
                    <p className="font-medium text-[#1A241B]">{item.name}</p>
                    <p className="text-xs text-[#5A6B5D] tabular-nums">
                      {formatQty(item.quantity, item.unitLabel)} × {formatPeso(item.pricePerKg)}
                    </p>
                  </div>
                  <p className="font-semibold text-[#1A241B] tabular-nums">
                    {formatPeso(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#E2E8DC] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#4A584C]">
              <span>Items Subtotal</span>
              <span className="tabular-nums font-medium">{formatPeso(confirmedOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#4A584C]">
              <span>
                {confirmedOrder.fulfillmentType === 'delivery'
                  ? 'Delivery Shipping Charge'
                  : 'Market Hub Pickup'}
              </span>
              <span className="tabular-nums font-medium">{formatPeso(confirmedOrder.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#1A241B] pt-2 border-t border-[#EEF2EA]">
              <span>Total Paid</span>
              <span className="tabular-nums text-[#166534]">{formatPeso(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-colors"
            >
              Back to Homepage
            </button>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="px-5 py-2.5 rounded-xl border border-[#DCE3D5] bg-white hover:bg-[#F0F3EC] text-[#1A241B] text-sm font-semibold transition-colors"
            >
              Shop More Produce
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-[#E2E8DC] p-10 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F3EC] text-[#166534] flex items-center justify-center mx-auto">
            <ShoppingBasket className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A241B]">
              Your Market Basket Is Empty
            </h1>
            <p className="text-sm sm:text-base text-[#4A584C] max-w-md mx-auto">
              Select fresh Filipino vegetables, pork, beef, chicken, or coastal seafood to begin your order.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('vegetables')}
              className="px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-colors"
            >
              Explore Vegetables
            </button>
            <button
              type="button"
              onClick={() => onNavigate('meats')}
              className="px-5 py-2.5 rounded-xl border border-[#DCE3D5] bg-white hover:bg-[#F0F3EC] text-[#1A241B] text-sm font-semibold transition-colors"
            >
              Explore Meats &amp; Seafood
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E2E8DC]">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-[#166534] uppercase">
            {step === 'review'
              ? 'Step 1 of 2 · Review Selected Items'
              : 'Step 2 of 2 · Fulfillment & Payment'}
          </p>
          <h1 className="font-display text-3xl font-bold text-[#1A241B] tracking-tight">
            {step === 'review'
              ? 'Review & Modify Your Cart'
              : 'Pickup or Delivery & Payment'}
          </h1>
          <p className="text-sm text-[#4A584C]">
            {step === 'review'
              ? 'Adjust kilogram quantities or remove items before finalizing your market basket.'
              : 'Choose pickup or location-based delivery, then select GCash, PayMaya, or Credit Card.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStep('review')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              step === 'review'
                ? 'bg-[#166534] text-white'
                : 'bg-[#F0F3EC] text-[#4A584C] hover:text-[#1A241B]'
            }`}
          >
            1. Review Items
          </button>
          <span aria-hidden="true" className="text-[#9CA3AF]">→</span>
          <button
            type="button"
            onClick={() => setStep('checkout')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              step === 'checkout'
                ? 'bg-[#166534] text-white'
                : 'bg-[#F0F3EC] text-[#4A584C] hover:text-[#1A241B]'
            }`}
          >
            2. Fulfillment &amp; Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Area */}
        <div className="lg:col-span-8 space-y-6">
          {step === 'review' ? (
            <div className="bg-white rounded-2xl border border-[#E2E8DC] overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-[#EEF2EA] flex items-center justify-between gap-4">
                <h2 className="font-semibold text-base text-[#1A241B]">
                  Selected Items ({lineItems.length})
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#166534] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Add More Products</span>
                </button>
              </div>

              <ul className="divide-y divide-[#EEF2EA]">
                {lineItems.map((line) => {
                  const product = productMap.get(line.productId);
                  if (!product) return null;
                  const canIncrease = line.quantity < product.stockQty;
                  const canDecrease = line.quantity > product.minQty;

                  return (
                    <li
                      key={line.productId}
                      data-testid={`cart-item-${line.productId}`}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#F0F3EC] shrink-0 border border-[#E2E8DC]">
                          <MarketImage
                            src={product.imageUrl}
                            alt={product.name}
                            objectPosition={product.imagePosition}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-sm sm:text-base font-semibold text-[#1A241B]">
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#5A6B5D] tabular-nums">
                            {formatPeso(product.pricePerKg)} / {product.unitLabel} ·{' '}
                            {formatQty(product.stockQty, product.unitLabel)} in stock
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center border border-[#DCE3D5] rounded-lg h-9 bg-[#F9FAF7]">
                          <button
                            type="button"
                            onClick={() =>
                              onSetCartQty(
                                product,
                                Number((line.quantity - product.stepQty).toFixed(2))
                              )
                            }
                            disabled={!canDecrease}
                            aria-label={`Decrease quantity for ${product.name}`}
                            className="w-8 h-full flex items-center justify-center text-[#1A241B] disabled:text-[#9CA3AF] hover:bg-[#EAF0E4] rounded-l-lg"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-[#1A241B] tabular-nums min-w-[4.25rem] text-center">
                            {formatQty(line.quantity, product.unitLabel)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onSetCartQty(
                                product,
                                Number((line.quantity + product.stepQty).toFixed(2))
                              )
                            }
                            disabled={!canIncrease}
                            aria-label={`Increase quantity for ${product.name}`}
                            className="w-8 h-full flex items-center justify-center text-[#1A241B] disabled:text-[#9CA3AF] hover:bg-[#EAF0E4] rounded-r-lg"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <p className="text-sm sm:text-base font-bold text-[#1A241B] tabular-nums min-w-[5.5rem] text-right">
                          {formatPeso(line.lineTotal)}
                        </p>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`Remove ${product.name} from cart`}
                          className="p-2 rounded-lg text-[#6B7A6D] hover:text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Fulfillment Choice: Delivery vs Pickup */}
              <div className="bg-white rounded-2xl border border-[#E2E8DC] p-5 sm:p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-[#1A241B]">
                    1. Choose Pickup or Delivery
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    className="text-xs font-semibold text-[#166534] hover:underline"
                  >
                    Modify Cart Items
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateField('fulfillmentType', 'delivery')}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      form.fulfillmentType === 'delivery'
                        ? 'border-[#166534] bg-[#ECFDF5] ring-1 ring-[#166534]'
                        : 'border-[#DCE3D5] bg-[#F9FAF7] hover:bg-white'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#166534] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[#1A241B]">Doorstep Delivery</p>
                      <p className="text-xs text-[#4A584C] mt-0.5">
                        Insulated cold-chain rider · Shipping fee depends on buyer location
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField('fulfillmentType', 'pickup')}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      form.fulfillmentType === 'pickup'
                        ? 'border-[#166534] bg-[#ECFDF5] ring-1 ring-[#166534]'
                        : 'border-[#DCE3D5] bg-[#F9FAF7] hover:bg-white'
                    }`}
                  >
                    <Store className="w-5 h-5 text-[#166534] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[#1A241B]">Market Hub Pickup</p>
                      <p className="text-xs text-[#4A584C] mt-0.5">
                        Free (₱0.00) · Collect packed basket at our QC, Makati, or Pasig hub
                      </p>
                    </div>
                  </button>
                </div>

                {/* Buyer Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={form.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      placeholder="e.g., Juan Dela Cruz"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                    />
                    {errors.customerName && (
                      <p className="text-xs text-[#B91C1C] mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => updateField('customerPhone', e.target.value)}
                      placeholder="e.g., 0917 123 4567"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-[#B91C1C] mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>

                {form.fulfillmentType === 'delivery' ? (
                  <div className="space-y-4 pt-2 border-t border-[#EEF2EA]">
                    <div>
                      <label
                        htmlFor="delivery-zone"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Buyer Location (Determines Shipping Charge)
                      </label>
                      <div className="relative">
                        <MapPin
                          className="w-4 h-4 text-[#166534] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                          aria-hidden="true"
                        />
                        <select
                          id="delivery-zone"
                          value={form.deliveryZoneId}
                          onChange={(e) => updateField('deliveryZoneId', e.target.value)}
                          className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534] truncate"
                        >
                          {DELIVERY_ZONES.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.label} ({zone.areas}) — {formatPeso(zone.fee)}
                            </option>
                          ))}
                        </select>
                      </div>
                      {selectedZone && (
                        <p className="text-xs text-[#5A6B5D] mt-1.5">
                          Estimated arrival: <span className="font-medium text-[#1A241B]">{selectedZone.eta}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="delivery-address"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Complete Delivery Address
                      </label>
                      <input
                        id="delivery-address"
                        type="text"
                        value={form.deliveryAddress}
                        onChange={(e) => updateField('deliveryAddress', e.target.value)}
                        placeholder="House/Unit No., Street, Barangay, City"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                      />
                      {errors.deliveryAddress && (
                        <p className="text-xs text-[#B91C1C] mt-1">{errors.deliveryAddress}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="delivery-notes"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Butcher / Packing Notes (Optional)
                      </label>
                      <input
                        id="delivery-notes"
                        type="text"
                        value={form.deliveryNotes}
                        onChange={(e) => updateField('deliveryNotes', e.target.value)}
                        placeholder="e.g., Cut liempo into adobo cubes, clean & gut bangus"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EEF2EA]">
                    <div>
                      <label
                        htmlFor="pickup-hub"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Select Pickup Market Hub
                      </label>
                      <select
                        id="pickup-hub"
                        value={form.pickupHubId}
                        onChange={(e) => updateField('pickupHubId', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                      >
                        {PICKUP_HUBS.map((hub) => (
                          <option key={hub.id} value={hub.id}>
                            {hub.name}
                          </option>
                        ))}
                      </select>
                      {selectedHub && (
                        <p className="text-xs text-[#5A6B5D] mt-1">
                          {selectedHub.address} · {selectedHub.hours}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="pickup-window"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Preferred Pickup Time
                      </label>
                      <select
                        id="pickup-window"
                        value={form.pickupWindow}
                        onChange={(e) => updateField('pickupWindow', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                      >
                        <option value="6:30 AM – 8:00 AM">6:30 AM – 8:00 AM</option>
                        <option value="8:00 AM – 10:00 AM">8:00 AM – 10:00 AM</option>
                        <option value="10:00 AM – 12:00 PM">10:00 AM – 12:00 PM</option>
                        <option value="2:00 PM – 5:00 PM">2:00 PM – 5:00 PM</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method: GCash, PayMaya, Credit Cards */}
              <div className="bg-white rounded-2xl border border-[#E2E8DC] p-5 sm:p-6 space-y-5 shadow-xs">
                <h2 className="font-display text-xl font-bold text-[#1A241B]">
                  2. Select Mode of Payment
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'gcash' as const,
                      label: 'GCash',
                      sub: 'Instant e-wallet transfer',
                      icon: Smartphone,
                    },
                    {
                      id: 'paymaya' as const,
                      label: 'PayMaya',
                      sub: 'Maya mobile wallet',
                      icon: Smartphone,
                    },
                    {
                      id: 'credit_card' as const,
                      label: 'Credit Card',
                      sub: 'Visa / Mastercard',
                      icon: CreditCard,
                    },
                  ].map((method) => {
                    const Icon = method.icon;
                    const active = form.paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => updateField('paymentMethod', method.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          active
                            ? 'border-[#166534] bg-[#ECFDF5] ring-1 ring-[#166534]'
                            : 'border-[#DCE3D5] bg-[#F9FAF7] hover:bg-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-[#166534] mt-0.5 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-semibold text-[#1A241B]">{method.label}</p>
                          <p className="text-xs text-[#5A6B5D] mt-0.5">{method.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {form.paymentMethod === 'gcash' && (
                  <div className="pt-2">
                    <label
                      htmlFor="gcash-number"
                      className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                    >
                      GCash Registered Mobile Number
                    </label>
                    <input
                      id="gcash-number"
                      type="tel"
                      value={form.gcashNumber}
                      onChange={(e) => updateField('gcashNumber', e.target.value)}
                      placeholder="0917 000 0000"
                      className="w-full sm:max-w-sm px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                    />
                    {errors.gcashNumber && (
                      <p className="text-xs text-[#B91C1C] mt-1">{errors.gcashNumber}</p>
                    )}
                  </div>
                )}

                {form.paymentMethod === 'paymaya' && (
                  <div className="pt-2">
                    <label
                      htmlFor="paymaya-number"
                      className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                    >
                      PayMaya / Maya Registered Mobile Number
                    </label>
                    <input
                      id="paymaya-number"
                      type="tel"
                      value={form.paymayaNumber}
                      onChange={(e) => updateField('paymayaNumber', e.target.value)}
                      placeholder="0918 000 0000"
                      className="w-full sm:max-w-sm px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                    />
                    {errors.paymayaNumber && (
                      <p className="text-xs text-[#B91C1C] mt-1">{errors.paymayaNumber}</p>
                    )}
                  </div>
                )}

                {form.paymentMethod === 'credit_card' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="card-holder"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Cardholder Name
                      </label>
                      <input
                        id="card-holder"
                        type="text"
                        value={form.cardHolderName}
                        onChange={(e) => updateField('cardHolderName', e.target.value)}
                        placeholder="Name on card"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534]"
                      />
                      {errors.cardHolderName && (
                        <p className="text-xs text-[#B91C1C] mt-1">{errors.cardHolderName}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="card-number"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Card Number
                      </label>
                      <input
                        id="card-number"
                        type="text"
                        inputMode="numeric"
                        value={form.cardNumber}
                        onChange={(e) => updateField('cardNumber', e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534] tabular-nums"
                      />
                      {errors.cardNumber && (
                        <p className="text-xs text-[#B91C1C] mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="card-expiry"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Expiry (MM/YY)
                      </label>
                      <input
                        id="card-expiry"
                        type="text"
                        value={form.cardExpiry}
                        onChange={(e) => updateField('cardExpiry', e.target.value)}
                        placeholder="08/29"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534] tabular-nums"
                      />
                      {errors.cardExpiry && (
                        <p className="text-xs text-[#B91C1C] mt-1">{errors.cardExpiry}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="card-cvv"
                        className="block text-xs font-semibold text-[#1A241B] mb-1.5"
                      >
                        Security Code (CVV)
                      </label>
                      <input
                        id="card-cvv"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={form.cardCvv}
                        onChange={(e) => updateField('cardCvv', e.target.value)}
                        placeholder="123"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DCE3D5] bg-white focus:outline-none focus:border-[#166534] tabular-nums"
                      />
                      {errors.cardCvv && (
                        <p className="text-xs text-[#B91C1C] mt-1">{errors.cardCvv}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Right Summary Panel */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white rounded-2xl border border-[#E2E8DC] p-6 space-y-5 shadow-xs">
          <h2 className="font-display text-xl font-bold text-[#1A241B]">Order Summary</h2>

          <div className="space-y-3 text-sm border-b border-[#EEF2EA] pb-4">
            <div className="flex justify-between text-[#4A584C]">
              <span>Items Subtotal ({lineItems.length})</span>
              <span className="font-semibold text-[#1A241B] tabular-nums">
                {formatPeso(subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-[#4A584C]">
              <span>
                {step === 'review'
                  ? 'Estimated Shipping'
                  : form.fulfillmentType === 'delivery'
                  ? `Shipping (${selectedZone?.label ?? 'Delivery'})`
                  : 'Market Hub Pickup'}
              </span>
              <span className="font-semibold text-[#1A241B] tabular-nums">
                {step === 'review'
                  ? 'Calculated next'
                  : formatPeso(shippingFee)}
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-[#1A241B]">Total</span>
            <span
              data-testid="order-total-amount"
              className="text-2xl font-bold text-[#166534] tabular-nums"
            >
              {formatPeso(step === 'review' ? subtotal : total)}
            </span>
          </div>

          {step === 'review' ? (
            <button
              type="button"
              onClick={() => setStep('checkout')}
              className="w-full py-3.5 px-5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-colors"
            >
              Confirm Items &amp; Choose Pickup / Delivery
            </button>
          ) : (
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3.5 px-5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-colors"
            >
              Place Order · {formatPeso(total)}
            </button>
          )}

          <p className="text-xs text-[#5A6B5D] leading-relaxed">
            All weights are verified on calibrated market scales before dispatch. Payment via GCash, PayMaya, or Credit Card is confirmed immediately.
          </p>
        </aside>
      </div>
    </section>
  );
}
