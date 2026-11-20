import {
  CartItem,
  CheckoutFormState,
  DeliveryZone,
  FulfillmentType,
  MainCategory,
  OrderLineItem,
  Product,
  ProductSubGroup,
  SeafoodSubGroup,
} from '../types/market';

export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatQty(qty: number, unitLabel: string): string {
  const clean = Number.isInteger(qty) ? qty.toString() : qty.toFixed(2).replace(/0$/, '');
  return `${clean} ${unitLabel}`;
}

export function getCartQtyForProduct(cartItems: CartItem[], productId: string): number {
  const found = cartItems.find((item) => item.productId === productId);
  return found ? found.quantity : 0;
}

export function getRemainingStock(product: Product, cartItems: CartItem[]): number {
  const inCart = getCartQtyForProduct(cartItems, product.id);
  return Math.max(0, Number((product.stockQty - inCart).toFixed(2)));
}

export function addOrUpdateCartItem(
  cartItems: CartItem[],
  product: Product,
  deltaQty: number
): CartItem[] {
  const existing = cartItems.find((item) => item.productId === product.id);
  const currentQty = existing ? existing.quantity : 0;
  const nextQty = Number((currentQty + deltaQty).toFixed(2));

  if (nextQty <= 0) {
    return cartItems.filter((item) => item.productId !== product.id);
  }

  const clampedQty = Math.min(nextQty, product.stockQty);
  if (clampedQty <= 0) {
    return cartItems.filter((item) => item.productId !== product.id);
  }

  if (existing) {
    return cartItems.map((item) =>
      item.productId === product.id ? { ...item, quantity: clampedQty } : item
    );
  }

  return [...cartItems, { productId: product.id, quantity: clampedQty }];
}

export function setCartItemQuantity(
  cartItems: CartItem[],
  product: Product,
  targetQty: number
): CartItem[] {
  if (targetQty <= 0 || product.stockQty <= 0) {
    return cartItems.filter((item) => item.productId !== product.id);
  }
  const clamped = Math.min(Number(targetQty.toFixed(2)), product.stockQty);
  const existing = cartItems.find((item) => item.productId === product.id);
  if (existing) {
    return cartItems.map((item) =>
      item.productId === product.id ? { ...item, quantity: clamped } : item
    );
  }
  return [...cartItems, { productId: product.id, quantity: clamped }];
}

export interface ProductFilterOptions {
  category?: MainCategory | 'all';
  subGroup?: ProductSubGroup | 'all';
  seafoodGroup?: SeafoodSubGroup | 'all';
  query?: string;
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
}

export function filterProducts(
  products: Product[],
  options: ProductFilterOptions
): Product[] {
  const {
    category = 'all',
    subGroup = 'all',
    seafoodGroup = 'all',
    query = '',
    inStockOnly = false,
    sortBy = 'featured',
  } = options;

  const trimmedQuery = query.trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (subGroup !== 'all' && p.subGroup !== subGroup) return false;
    if (seafoodGroup !== 'all' && p.seafoodGroup !== seafoodGroup) return false;
    if (inStockOnly && p.stockQty <= 0) return false;
    if (trimmedQuery) {
      const haystack = `${p.name} ${p.localName ?? ''} ${p.subGroup} ${p.seafoodGroup ?? ''} ${p.origin} ${p.description}`.toLowerCase();
      if (!haystack.includes(trimmedQuery)) return false;
    }
    return true;
  });

  if (sortBy === 'price-asc') {
    return [...filtered].sort((a, b) => a.pricePerKg - b.pricePerKg);
  }
  if (sortBy === 'price-desc') {
    return [...filtered].sort((a, b) => b.pricePerKg - a.pricePerKg);
  }
  if (sortBy === 'name-asc') {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }
  return filtered;
}

export function buildOrderLineItems(
  cartItems: CartItem[],
  products: Product[]
): OrderLineItem[] {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const lines: OrderLineItem[] = [];
  for (const item of cartItems) {
    const product = productMap.get(item.productId);
    if (!product) continue;
    const lineTotal = Number((product.pricePerKg * item.quantity).toFixed(2));
    lines.push({
      productId: product.id,
      name: product.name,
      unitLabel: product.unitLabel,
      pricePerKg: product.pricePerKg,
      quantity: item.quantity,
      lineTotal,
    });
  }
  return lines;
}

export function calculateSubtotal(lines: OrderLineItem[]): number {
  return Number(
    lines.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)
  );
}

export function calculateShippingFee(
  fulfillmentType: FulfillmentType,
  zoneId: string,
  zones: DeliveryZone[]
): number {
  if (fulfillmentType === 'pickup') {
    return 0;
  }
  const found = zones.find((z) => z.id === zoneId);
  return found ? found.fee : zones[0]?.fee ?? 0;
}

export function calculateOrderTotal(subtotal: number, shippingFee: number): number {
  return Number((subtotal + shippingFee).toFixed(2));
}

export function validateCheckoutForm(form: CheckoutFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.customerName.trim() || form.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name.';
  }

  const digitsPhone = form.customerPhone.replace(/\D/g, '');
  if (digitsPhone.length < 10) {
    errors.customerPhone = 'Please enter a valid 10 or 11-digit Philippine mobile number.';
  }

  if (form.fulfillmentType === 'delivery') {
    if (!form.deliveryZoneId) {
      errors.deliveryZoneId = 'Please select your delivery location.';
    }
    if (!form.deliveryAddress.trim() || form.deliveryAddress.trim().length < 8) {
      errors.deliveryAddress = 'Please enter your complete street and barangay address.';
    }
  } else {
    if (!form.pickupHubId) {
      errors.pickupHubId = 'Please select a market pickup hub.';
    }
  }

  if (form.paymentMethod === 'gcash') {
    const gDigits = form.gcashNumber.replace(/\D/g, '');
    if (gDigits.length < 10) {
      errors.gcashNumber = 'Please enter a valid GCash mobile number.';
    }
  } else if (form.paymentMethod === 'paymaya') {
    const pDigits = form.paymayaNumber.replace(/\D/g, '');
    if (pDigits.length < 10) {
      errors.paymayaNumber = 'Please enter a valid PayMaya mobile number.';
    }
  } else if (form.paymentMethod === 'credit_card') {
    if (!form.cardHolderName.trim()) {
      errors.cardHolderName = 'Please enter the cardholder name.';
    }
    const cardDigits = form.cardNumber.replace(/\D/g, '');
    if (cardDigits.length < 13 || cardDigits.length > 19) {
      errors.cardNumber = 'Please enter a valid 13–19 digit card number.';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry.trim())) {
      errors.cardExpiry = 'Use MM/YY format.';
    }
    if (!/^\d{3,4}$/.test(form.cardCvv.trim())) {
      errors.cardCvv = 'Enter 3 or 4-digit CVV.';
    }
  }

  return errors;
}

export function deductPurchasedStock(
  products: Product[],
  cartItems: CartItem[]
): Product[] {
  const purchasedMap = new Map(cartItems.map((c) => [c.productId, c.quantity]));
  return products.map((p) => {
    const qty = purchasedMap.get(p.id);
    if (!qty) return p;
    return {
      ...p,
      stockQty: Math.max(0, Number((p.stockQty - qty).toFixed(2))),
    };
  });
}
