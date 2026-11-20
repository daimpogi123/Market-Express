import { CustomerReview, DeliveryZone, PickupHub } from '../types/market';

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'metro-core',
    label: 'Metro Manila Core',
    areas: 'Manila, Quezon City, Makati, San Juan, Mandaluyong',
    fee: 65,
    eta: 'Same-day (2–3 hrs)',
  },
  {
    id: 'metro-east-south',
    label: 'Metro Manila East & South',
    areas: 'Pasig, Taguig, Parañaque, Las Piñas, Marikina, Pasay',
    fee: 85,
    eta: 'Same-day (3–4 hrs)',
  },
  {
    id: 'metro-north',
    label: 'Metro Manila North',
    areas: 'Caloocan, Malabon, Navotas, Valenzuela, Muntinlupa',
    fee: 95,
    eta: 'Same-day (3–5 hrs)',
  },
  {
    id: 'greater-luzon',
    label: 'Nearby Provinces (Greater Manila)',
    areas: 'Cavite, Laguna, Rizal, Bulacan',
    fee: 145,
    eta: 'Next-morning cold-chain slot',
  },
];

export const PICKUP_HUBS: PickupHub[] = [
  {
    id: 'hub-qc',
    name: 'Quezon City — Kamuning Market Hub',
    address: '42 Kamuning Rd, Diliman, Quezon City',
    hours: '5:30 AM – 6:30 PM Daily',
  },
  {
    id: 'hub-makati',
    name: 'Makati — Poblacion Fresh Stall',
    address: '118 J.P. Rizal Ave, Makati City',
    hours: '6:00 AM – 7:00 PM Daily',
  },
  {
    id: 'hub-pasig',
    name: 'Pasig — Kapitolyo Cold-Pack Counter',
    address: '19 East Capitol Dr, Pasig City',
    hours: '6:00 AM – 6:30 PM Daily',
  },
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Marisol Villanueva',
    location: 'Quezon City · Home Cook',
    rating: 5,
    topic: 'Product Freshness',
    comment:
      'The kangkong, talong, and Dagupan bangus arrived still cold with morning dew. Everything smelled clean and looked hand-picked just like going to the palengke at 6 AM.',
    purchasedItems: 'Milkfish (Bangus), Eggplant (Talong), Water Spinach (Kangkong)',
    date: 'November 14, 2026',
  },
  {
    id: 'rev-2',
    name: 'Rafael Mendoza',
    location: 'Makati · Family Weekly Shopper',
    rating: 5,
    topic: 'Quality & Butcher Cuts',
    comment:
      'Ordered 2 kg of liempo and beef brisket cubes for Sunday kare-kare and ihaw. The cuts were evenly trimmed, zero foul odor, and packed in sealed food-grade trays.',
    purchasedItems: 'Liempo, Brisket, Oxtail, Pechay',
    date: 'November 11, 2026',
  },
  {
    id: 'rev-3',
    name: 'Clarissa Santos',
    location: 'Pasig · Working Mom',
    rating: 5,
    topic: 'Affordability & Fair Weights',
    comment:
      'Prices match our neighborhood wet market without the markups of big supermarkets. Even down to the calamansi and red onions, the digital scale weight was spot on.',
    purchasedItems: 'Red Onion, Garlic, Calamansi, Chicken Leg Quarter',
    date: 'November 8, 2026',
  },
  {
    id: 'rev-4',
    name: 'Jerome Bautista',
    location: 'Bacoor, Cavite · Small Eatery Owner',
    rating: 5,
    topic: 'Reliable Delivery Service',
    comment:
      'Insulated delivery reached Cavite right on schedule with crushed ice packs still intact around the suahe shrimp and galunggong. Paying via GCash took seconds.',
    purchasedItems: 'Whiteleg Shrimp (Suahe), Round Scad (Galunggong), Squash',
    date: 'November 3, 2026',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'How fresh are the vegetables, meats, and seafood?',
    a: 'All produce is sourced directly from partner Cordillera and Central Luzon farms before dawn, while pork, beef, poultry, and coastal seafood arrive daily from accredited local butcheries and Navotas/Dagupan landings.',
  },
  {
    q: 'How are weights and Philippine Peso (₱) prices calculated?',
    a: 'Prices are listed clearly per kilogram (kg) with exact digital scale weighing. You can order in convenient 0.25 kg, 0.5 kg, or 1 kg increments depending on the item.',
  },
  {
    q: 'What happens when an item has zero available stock?',
    a: 'Out-of-stock items automatically appear in grayscale and cannot be added to your cart so you never experience surprise substitutions after checkout.',
  },
  {
    q: 'How do delivery fees and market pickup work?',
    a: 'Store pickup at our Quezon City, Makati, or Pasig hubs is always free (₱0). For doorstep delivery, cold-chain shipping fees depend on your city or province zone (₱65 to ₱145).',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'We accept instant digital payments via GCash, PayMaya (Maya), and major Visa/Mastercard Credit Cards.',
  },
];
