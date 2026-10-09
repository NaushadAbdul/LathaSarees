export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'Sarees' | 'Jewelry';
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  thumbnail: string;
  stock: number;
  sku: string;
  colors: string[];
  fabric: string;
  occasion: string;
  weave: string;
  featured: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  collectionSlug?: string;
}

import sareesVideo from '../assets/images/sareesvideo.mp4';

export const BRAND_IMAGES = {
  heroBridal: '/src/assets/images/hero_indian_bridal_saree_1791476960167.jpg',
  sareeBanarasiCrimson: '/src/assets/images/saree_banarasi_crimson_1791476972608.jpg',
  sareeKanchipuramEmerald: '/src/assets/images/saree_kanchipuram_emerald_1791476983737.jpg',
  jewelryTempleJhumka: '/src/assets/images/jewelry_temple_jhumka_1791476992802.jpg',
  jewelryLakshmiNecklace: '/src/assets/images/jewelry_lakshmi_necklace_1791477003454.jpg',
  jewelryKundanBangles: '/src/assets/images/jewelry_kundan_bangles_1791477012771.jpg',
  sareesVideo: sareesVideo,
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_banarasi_crimson_01',
    name: 'Royal Crimson Katan Banarasi Silk Saree',
    slug: 'royal-crimson-katan-banarasi-silk-saree',
    description:
      'Handwoven in Varanasi using pure mulberry Katan silk, this heirloom crimson maroon Banarasi saree features intricate antique gold kadwa zari floral jaal motifs and a grand heritage pallu. Includes an unstitched zari-bordered silk blouse piece.',
    category: 'Sarees',
    subcategory: 'Banarasi',
    price: 12900,
    originalPrice: 16500,
    discount: 22,
    images: [
      '/src/assets/images/saree_banarasi_crimson_1791476972608.jpg',
      '/src/assets/images/hero_indian_bridal_saree_1791476960167.jpg',
    ],
    thumbnail: '/src/assets/images/saree_banarasi_crimson_1791476972608.jpg',
    stock: 6,
    sku: 'LTH-SAR-BAN-001',
    colors: ['Deep Wine', 'Crimson Gold'],
    fabric: 'Pure Katan Mulberry Silk',
    occasion: 'Wedding & Bridal',
    weave: 'Handloom Kadwa Zari',
    featured: true,
    newArrival: true,
    rating: 4.9,
    reviewCount: 42,
    collectionSlug: 'wedding-collection',
  },
  {
    id: 'prod_temple_jhumka_02',
    name: 'Kemp Ruby & South Sea Pearl Temple Jhumkas',
    slug: 'kemp-ruby-south-sea-pearl-temple-jhumkas',
    description:
      'Exquisitely sculpted in antique 22k gold vermeil over sterling silver base, these traditional South Indian temple jhumkas are hand-set with deep cabochon Kemp rubies and finished with cascading clusters of lustrous pearls.',
    category: 'Jewelry',
    subcategory: 'Jhumkas',
    price: 3900,
    originalPrice: 4800,
    discount: 19,
    images: [
      '/src/assets/images/jewelry_temple_jhumka_1791476992802.jpg',
      '/src/assets/images/jewelry_lakshmi_necklace_1791477003454.jpg',
    ],
    thumbnail: '/src/assets/images/jewelry_temple_jhumka_1791476992802.jpg',
    stock: 14,
    sku: 'LTH-JWL-JHM-002',
    colors: ['Antique Gold', 'Kemp Ruby'],
    fabric: '22k Gold Vermeil & Natural Pearls',
    occasion: 'Festive & Bridal',
    weave: 'Handcrafted Nakshi Filigree',
    featured: true,
    newArrival: true,
    rating: 4.9,
    reviewCount: 68,
    collectionSlug: 'festive-edit',
  },
  {
    id: 'prod_lakshmi_necklace_03',
    name: 'Maharani Lakshmi Nakshi Temple Haram Necklace',
    slug: 'maharani-lakshmi-nakshi-temple-haram-necklace',
    description:
      'A statement bridal heirloom celebrating South Indian temple artistry. Featuring a sacred Goddess Lakshmi medallion flanked by auspicious peacocks, handset Kemp stones, uncut polki accents, and hand-strung pearl droplets.',
    category: 'Jewelry',
    subcategory: 'Necklaces',
    price: 8900,
    originalPrice: 11200,
    discount: 21,
    images: [
      '/src/assets/images/jewelry_lakshmi_necklace_1791477003454.jpg',
      '/src/assets/images/jewelry_temple_jhumka_1791476992802.jpg',
    ],
    thumbnail: '/src/assets/images/jewelry_lakshmi_necklace_1791477003454.jpg',
    stock: 4,
    sku: 'LTH-JWL-NCK-003',
    colors: ['Antique Gold', 'Ruby & Pearl'],
    fabric: 'Antique Gold Plated Silver Alloy',
    occasion: 'Wedding & Muhurtham',
    weave: 'Temple Repoussé Craft',
    featured: true,
    newArrival: true,
    rating: 5.0,
    reviewCount: 53,
    collectionSlug: 'wedding-collection',
  },
  {
    id: 'prod_kanchipuram_emerald_04',
    name: 'Emerald Forest Korvai Kanchipuram Silk Saree',
    slug: 'emerald-forest-korvai-kanchipuram-silk-saree',
    description:
      'Woven by master weavers in Kanchipuram from three-ply pure mulberry silk and heavy antique gold zari. Features a classic contrast korvai temple border with peacock and rudraksha motifs.',
    category: 'Sarees',
    subcategory: 'Kanchipuram',
    price: 14900,
    originalPrice: 18500,
    discount: 19,
    images: [
      '/src/assets/images/saree_kanchipuram_emerald_1791476983737.jpg',
      '/src/assets/images/saree_banarasi_crimson_1791476972608.jpg',
    ],
    thumbnail: '/src/assets/images/saree_kanchipuram_emerald_1791476983737.jpg',
    stock: 5,
    sku: 'LTH-SAR-KAN-004',
    colors: ['Emerald Green', 'Antique Gold'],
    fabric: 'Pure 3-Ply Kanchipuram Silk',
    occasion: 'Wedding & Reception',
    weave: 'Traditional Korvai Zari',
    featured: true,
    newArrival: true,
    rating: 4.8,
    reviewCount: 37,
    collectionSlug: 'wedding-collection',
  },
  {
    id: 'prod_kundan_bangles_05',
    name: 'Nizam Filigree & Kundan Pearl Kada Bangles (Pair)',
    slug: 'nizam-filigree-kundan-pearl-kada-bangles',
    description:
      'Handcrafted pair of hinged royal kadas featuring intricate Lakshmi and peacock relief carving, uncut Kundan stone settings, emerald and ruby cabochons, and delicate seed-pearl edging.',
    category: 'Jewelry',
    subcategory: 'Bangles',
    price: 6490,
    originalPrice: 7990,
    discount: 19,
    images: [
      '/src/assets/images/jewelry_kundan_bangles_1791477012771.jpg',
      '/src/assets/images/jewelry_lakshmi_necklace_1791477003454.jpg',
    ],
    thumbnail: '/src/assets/images/jewelry_kundan_bangles_1791477012771.jpg',
    stock: 9,
    sku: 'LTH-JWL-BNG-005',
    colors: ['Antique Gold', 'Pearl White'],
    fabric: 'Antique Gold Finish & Uncut Kundan',
    occasion: 'Festive & Bridal',
    weave: 'Hand-carved Nakshi & Kundan',
    featured: true,
    newArrival: true,
    rating: 4.9,
    reviewCount: 29,
    collectionSlug: 'festive-edit',
  },
  {
    id: 'prod_bridal_zari_saree_06',
    name: 'Arundhati Bridal Wine Zari Brocade Silk Saree',
    slug: 'arundhati-bridal-wine-zari-brocade-silk-saree',
    description:
      'Designed for timeless bridal celebrations, this deep wine pure silk saree showcases a rich architectural zari border inspired by Tanjore palace carvings and subtle butti motifs across the drape.',
    category: 'Sarees',
    subcategory: 'Silk',
    price: 15800,
    originalPrice: 19200,
    discount: 18,
    images: [
      '/src/assets/images/hero_indian_bridal_saree_1791476960167.jpg',
      '/src/assets/images/saree_banarasi_crimson_1791476972608.jpg',
    ],
    thumbnail: '/src/assets/images/hero_indian_bridal_saree_1791476960167.jpg',
    stock: 3,
    sku: 'LTH-SAR-SLK-006',
    colors: ['Deep Wine', 'Champagne Gold'],
    fabric: 'Pure Mulberry Bridal Silk',
    occasion: 'Bridal & Muhurtham',
    weave: 'Brocade Zari Weave',
    featured: true,
    newArrival: false,
    rating: 5.0,
    reviewCount: 48,
    collectionSlug: 'wedding-collection',
  },
  {
    id: 'prod_temple_choker_set_07',
    name: 'Devasena Bridal Temple Necklace & Jhumka Suite',
    slug: 'devasena-bridal-temple-necklace-jhumka-suite',
    description:
      'Complete bridal temple jewelry suite pairing our signature Lakshmi Nakshi necklace with matching Kemp ruby and pearl jhumka earrings. Presented in a velvet Latha heirloom keepsake box.',
    category: 'Jewelry',
    subcategory: 'Temple Jewelry',
    price: 11800,
    originalPrice: 14900,
    discount: 21,
    images: [
      '/src/assets/images/jewelry_lakshmi_necklace_1791477003454.jpg',
      '/src/assets/images/jewelry_temple_jhumka_1791476992802.jpg',
    ],
    thumbnail: '/src/assets/images/jewelry_lakshmi_necklace_1791477003454.jpg',
    stock: 7,
    sku: 'LTH-JWL-SET-007',
    colors: ['Antique Gold', 'Deep Ruby'],
    fabric: '22k Gold Vermeil & Kemp Stones',
    occasion: 'Bridal & Reception',
    weave: 'Handcrafted Temple Set',
    featured: false,
    newArrival: true,
    rating: 4.9,
    reviewCount: 31,
    collectionSlug: 'wedding-collection',
  },
  {
    id: 'prod_organza_zari_saree_08',
    name: 'Marigold & Wine Tissue Organza Zari Saree',
    slug: 'marigold-wine-tissue-organza-zari-saree',
    description:
      'Featherlight handwoven silk-organza drape finished with antique zari borders and delicate floral buttas, crafted for effortless elegance at evening soirées and festive gatherings.',
    category: 'Sarees',
    subcategory: 'Organza',
    price: 7490,
    originalPrice: 9490,
    discount: 21,
    images: [
      '/src/assets/images/saree_banarasi_crimson_1791476972608.jpg',
      '/src/assets/images/saree_kanchipuram_emerald_1791476983737.jpg',
    ],
    thumbnail: '/src/assets/images/saree_banarasi_crimson_1791476972608.jpg',
    stock: 11,
    sku: 'LTH-SAR-ORG-008',
    colors: ['Wine Rose', 'Antique Gold'],
    fabric: 'Pure Silk Tissue Organza',
    occasion: 'Festive & Party Wear',
    weave: 'Zari Border Weave',
    featured: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 22,
    collectionSlug: 'everyday-elegance',
  },
];

export interface CuratedCollection {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  itemCount: string;
}

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    slug: 'wedding-collection',
    title: 'The Bridal & Muhurtham Edit',
    subtitle: 'Heirloom Silk & Temple Gold',
    description: 'Statement Banarasi and Kanchipuram drapes paired with sacred Lakshmi temple jewelry for unforgettable weddings.',
    image: '/src/assets/images/hero_indian_bridal_saree_1791476960167.jpg',
    itemCount: '18 Curated Pieces',
  },
  {
    slug: 'festive-edit',
    title: 'The Festive Heritage Edit',
    subtitle: 'Celebratory Weaves & Jhumkas',
    description: 'Rich jewel tones, pure zari borders, and handcrafted Kemp pearl jewelry curated for auspicious celebrations.',
    image: '/src/assets/images/saree_banarasi_crimson_1791476972608.jpg',
    itemCount: '24 Curated Pieces',
  },
  {
    slug: 'temple-jewelry',
    title: 'Sacred Temple Jewelry',
    subtitle: 'Nakshi & Kemp Craftsmanship',
    description: 'Intricate South Indian temple necklaces, jhumkas, and kadas sculpted with timeless devotion.',
    image: '/src/assets/images/jewelry_lakshmi_necklace_1791477003454.jpg',
    itemCount: '16 Curated Pieces',
  },
  {
    slug: 'everyday-elegance',
    title: 'Sovereign Silk Classics',
    subtitle: 'Kanchipuram & Organza Drapes',
    description: 'Effortless handloom silks and refined jewelry silhouettes designed to be cherished across generations.',
    image: '/src/assets/images/saree_kanchipuram_emerald_1791476983737.jpg',
    itemCount: '14 Curated Pieces',
  },
];

export const TESTIMONIALS = [
  {
    id: 'rev-1',
    quote:
      'The Royal Crimson Banarasi Saree surpassed every expectation. The weight of the pure mulberry silk and the antique tone of the zari border looked truly regal at my sister’s wedding in Hyderabad.',
    author: 'Ananya Reddy',
    role: 'Bridal Patron · Hyderabad',
    product: 'Royal Crimson Katan Banarasi Silk Saree',
    rating: 5,
  },
  {
    id: 'rev-2',
    quote:
      'I ordered the Maharani Lakshmi Temple Haram and Kemp Ruby Jhumkas together. The Nakshi carving and pearl cluster finishing rival family heirlooms from Chennai boutiques.',
    author: 'Meenakshi Sundaram',
    role: 'Verified Patron · Chennai',
    product: 'Maharani Lakshmi Nakshi Temple Haram Necklace',
    rating: 5,
  },
  {
    id: 'rev-3',
    quote:
      'From the personal WhatsApp styling consultation to the signature ivory gift box packaging, shopping with Latha felt like visiting a private luxury atelier.',
    author: 'Priya Venkatesh',
    role: 'Verified Patron · Bengaluru',
    product: 'Emerald Forest Korvai Kanchipuram Silk Saree',
    rating: 5,
  },
];
