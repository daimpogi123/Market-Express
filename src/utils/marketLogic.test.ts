import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PRODUCTS } from '../data/products';
import { DELIVERY_ZONES } from '../data/reviews';
import {
  addOrUpdateCartItem,
  buildOrderLineItems,
  calculateOrderTotal,
  calculateShippingFee,
  calculateSubtotal,
  deductPurchasedStock,
  filterProducts,
  formatPeso,
  getRemainingStock,
  validateCheckoutForm,
} from './marketLogic';
import { CheckoutFormState } from '../types/market';

test('catalog includes all 36 requested vegetables and 47 meat & seafood items', () => {
  const vegetables = INITIAL_PRODUCTS.filter((p) => p.category === 'vegetables');
  const pork = INITIAL_PRODUCTS.filter((p) => p.subGroup === 'pork');
  const beef = INITIAL_PRODUCTS.filter((p) => p.subGroup === 'beef');
  const chicken = INITIAL_PRODUCTS.filter((p) => p.subGroup === 'chicken');
  const seafood = INITIAL_PRODUCTS.filter((p) => p.subGroup === 'seafood');

  assert.equal(vegetables.length, 36);
  assert.equal(pork.length, 9);
  assert.equal(beef.length, 11);
  assert.equal(chicken.length, 10);
  assert.equal(seafood.length, 17);
});

test('formats Philippine Peso with two decimals and comma grouping', () => {
  assert.equal(formatPeso(1250), '₱1,250.00');
  assert.equal(formatPeso(95.5), '₱95.50');
});

test('cart addition respects available stock and deducts stock on checkout', () => {
  const eggplant = INITIAL_PRODUCTS.find((p) => p.id === 'veg-eggplant')!;
  const outOfStockLeeks = INITIAL_PRODUCTS.find((p) => p.id === 'veg-leeks')!;

  assert.equal(outOfStockLeeks.stockQty, 0);
  assert.deepEqual(addOrUpdateCartItem([], outOfStockLeeks, 0.5), []);

  let cart = addOrUpdateCartItem([], eggplant, 1);
  cart = addOrUpdateCartItem(cart, eggplant, 100);
  assert.equal(cart[0].quantity, eggplant.stockQty);
  assert.equal(getRemainingStock(eggplant, cart), 0);

  const updatedCatalog = deductPurchasedStock(INITIAL_PRODUCTS, cart);
  const updatedEggplant = updatedCatalog.find((p) => p.id === 'veg-eggplant')!;
  assert.equal(updatedEggplant.stockQty, 0);
});

test('filtering searches by English and Filipino local names', () => {
  const talongMatches = filterProducts(INITIAL_PRODUCTS, { query: 'talong' });
  assert.ok(talongMatches.some((p) => p.id === 'veg-eggplant'));

  const bangusMatches = filterProducts(INITIAL_PRODUCTS, { query: 'bangus' });
  assert.ok(bangusMatches.some((p) => p.id === 'sea-milkfish'));
});

test('shipping fees vary by fulfillment mode and buyer location', () => {
  assert.equal(calculateShippingFee('pickup', 'metro-core', DELIVERY_ZONES), 0);
  assert.equal(calculateShippingFee('delivery', 'metro-core', DELIVERY_ZONES), 65);
  assert.equal(calculateShippingFee('delivery', 'greater-luzon', DELIVERY_ZONES), 145);

  const bangus = INITIAL_PRODUCTS.find((p) => p.id === 'sea-milkfish')!;
  const liempo = INITIAL_PRODUCTS.find((p) => p.id === 'pork-liempo')!;
  assert.equal(bangus.pricePerKg, 240);
  assert.equal(liempo.pricePerKg, 380);
  const cart = [
    { productId: bangus.id, quantity: 2 },
    { productId: liempo.id, quantity: 1 },
  ];
  const lines = buildOrderLineItems(cart, INITIAL_PRODUCTS);
  const subtotal = calculateSubtotal(lines);
  assert.equal(subtotal, bangus.pricePerKg * 2 + liempo.pricePerKg);
  assert.equal(calculateOrderTotal(subtotal, 85), bangus.pricePerKg * 2 + liempo.pricePerKg + 85);
});

test('checkout validation catches missing delivery address or invalid payment inputs', () => {
  const invalidForm: CheckoutFormState = {
    fulfillmentType: 'delivery',
    deliveryZoneId: 'metro-core',
    pickupHubId: 'hub-qc',
    pickupWindow: '8:00 AM – 10:00 AM',
    customerName: '',
    customerPhone: '0917',
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

  const errors = validateCheckoutForm(invalidForm);
  assert.ok(errors.customerName);
  assert.ok(errors.customerPhone);
  assert.ok(errors.deliveryAddress);
  assert.ok(errors.gcashNumber);

  const validPickupForm: CheckoutFormState = {
    ...invalidForm,
    fulfillmentType: 'pickup',
    customerName: 'Maria Clara',
    customerPhone: '09171234567',
    paymentMethod: 'paymaya',
    paymayaNumber: '09181234567',
  };
  assert.deepEqual(validateCheckoutForm(validPickupForm), {});
});
