export type MainCategory = 'vegetables' | 'meats';

export type VegetableGroup =
  | 'gourds-fruiting'
  | 'leafy-greens'
  | 'roots-aromatics';

export type MeatGroup = 'pork' | 'beef' | 'chicken' | 'seafood';

export type SeafoodSubGroup =
  | 'fish'
  | 'crustaceans'
  | 'mollusks-shellfish'
  | 'dried-smoked';

export type ProductSubGroup = VegetableGroup | MeatGroup;

export interface Product {
  id: string;
  name: string;
  localName?: string;
  category: MainCategory;
  subGroup: ProductSubGroup;
  seafoodGroup?: SeafoodSubGroup;
  pricePerKg: number;
  unitLabel: string;
  stepQty: number;
  minQty: number;
  stockQty: number;
  imageUrl: string;
  imagePosition?: string;
  imageScale?: number;
  origin: string;
  description: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type FulfillmentType = 'delivery' | 'pickup';

export type PaymentMethod = 'gcash' | 'paymaya' | 'credit_card';

export interface DeliveryZone {
  id: string;
  label: string;
  areas: string;
  fee: number;
  eta: string;
}

export interface PickupHub {
  id: string;
  name: string;
  address: string;
  hours: string;
}

export interface CheckoutFormState {
  fulfillmentType: FulfillmentType;
  deliveryZoneId: string;
  pickupHubId: string;
  pickupWindow: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes: string;
  paymentMethod: PaymentMethod;
  gcashNumber: string;
  paymayaNumber: string;
  cardHolderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export interface OrderLineItem {
  productId: string;
  name: string;
  unitLabel: string;
  pricePerKg: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  items: OrderLineItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  fulfillmentType: FulfillmentType;
  fulfillmentLabel: string;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  status: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  topic: string;
  comment: string;
  purchasedItems: string;
  date: string;
}

export type AppRoute =
  | 'home'
  | 'products'
  | 'categories'
  | 'vegetables'
  | 'meats'
  | 'about'
  | 'cart'
  | 'faq'
  | 'privacy'
  | 'terms';
