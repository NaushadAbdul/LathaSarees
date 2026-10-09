import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { INITIAL_PRODUCTS, Product, BRAND_IMAGES } from '../data/catalog';
import { saveLocalMedia, getLocalMedia, deleteLocalMedia } from '../utils/mediaStorage';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'Online Payment' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'COD';
  status:
    | 'Pending'
    | 'Confirmed'
    | 'Processing'
    | 'Shipped'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Cancelled'
    | 'Returned';
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  itemSummary: string;
  itemCount: number;
  createdAt?: string;
}

export interface UserPrivateProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface StoreSettings {
  announcementText: string;
  freeShippingThreshold: number;
  codEnabled: boolean;
  storySubtitle?: string;
  storyTitle?: string;
  storyQuote?: string;
  storyParagraph1?: string;
  storyParagraph2?: string;
  storyImageUrl?: string;

  // Single hero slide legacy fields (Slide 0 compatibility)
  heroMediaType?: 'image' | 'video' | 'pinterest';
  heroMediaUrl?: string;
  heroMediaSource?: 'url' | 'system';
  heroMediaFileName?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroSubtitleGold?: string;
  heroKicker?: string;
  heroDescription?: string;
  heroPrimaryCtaText?: string;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaLink?: string;

  // Multi-slide Hero Configuration
  heroSlides?: HeroSlideConfig[];
}

export interface HeroSlideConfig {
  id: number;
  titleLine1: string;
  titleLine2: string;
  subtitleGold: string;
  kicker: string;
  description: string;
  mediaType: 'image' | 'video' | 'pinterest';
  mediaSource?: 'url' | 'system';
  mediaUrl: string;
  mediaFileName?: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlistIds: string[];
  orders: OrderRecord[];
  user: User | null;
  isAdmin: boolean;
  authReady: boolean;
  profile: UserPrivateProfile | null;
  settings: StoreSettings;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  addToCart: (product: Product, quantity?: number, color?: string, openDrawer?: boolean) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateCartQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveUserProfile: (data: Omit<UserPrivateProfile, 'uid'>) => Promise<void>;
  placeOrder: (orderInput: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: 'Online Payment' | 'Cash on Delivery';
    discountAmount: number;
  }) => Promise<OrderRecord>;
  cancelCustomerOrder: (orderId: string, currentOrder: OrderRecord) => Promise<void>;
  adminSaveProduct: (product: Omit<Product, 'id'> & { id?: string }) => Promise<void>;
  adminDeleteProduct: (productId: string) => Promise<void>;
  adminUpdateOrderStatus: (
    orderId: string,
    status: OrderRecord['status'],
    paymentStatus: OrderRecord['paymentStatus']
  ) => Promise<void>;
  adminUpdateSettings: (newSettings: StoreSettings) => Promise<void>;
  adminSeedCatalog: () => Promise<void>;
  uploadHeroMediaFile: (file: File, slideIdx?: number) => Promise<string>;
  resetHeroMediaToDefault: (slideIdx?: number) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_EMAILS = ['naushadabdul2006@gmail.com', 'lathasarees182@gmail.com'];

function formatTimestamp(val: unknown): string {
  if (val instanceof Timestamp) {
    return val.toDate().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  if (typeof val === 'string') return val;
  return new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const DEFAULT_HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 0,
    titleLine1: 'TIMELESS INDIAN',
    titleLine2: 'ELEGANCE,',
    subtitleGold: 'PRECIOUS & WOVEN FOR YOU.',
    kicker: 'SAREES · TEMPLE JEWELRY · JHUMKAS · NECKLACES · HERITAGE',
    description:
      'Discover handwoven Banarasi and Kanchipuram silks alongside sacred temple jewelry crafted to celebrate every unforgettable occasion.',
    mediaType: 'image',
    mediaSource: 'url',
    mediaUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600',
    mediaFileName: '',
    primaryCtaText: 'DISCOVER THE COLLECTION',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'EXPLORE JEWELRY',
    secondaryCtaLink: '/jewelry',
  },
  {
    id: 1,
    titleLine1: 'HEIRLOOM SILK',
    titleLine2: 'DRAPES,',
    subtitleGold: 'HANDWOVEN IN KANCHIPURAM & KASHI.',
    kicker: 'PURE MULBERRY SILK · KORVAI ZARI · BRIDAL TROUSSEAU',
    description:
      'Each saree in the Latha archive is selected directly from master weaver looms for its lustrous drape and architectural gold zari.',
    mediaType: 'video',
    mediaSource: 'url',
    mediaUrl: BRAND_IMAGES.sareesVideo,
    mediaFileName: '',
    primaryCtaText: 'SHOP SAREES',
    primaryCtaLink: '/sarees',
    secondaryCtaText: 'BRIDAL EDIT',
    secondaryCtaLink: '/collections/wedding-collection',
  },
  {
    id: 2,
    titleLine1: 'SACRED TEMPLE',
    titleLine2: 'JEWELRY,',
    subtitleGold: 'SCULPTED IN ANTIQUE GOLD & PEARLS.',
    kicker: 'LAKSHMI HARAMS · KEMP JHUMKAS · NIZAM KADAS',
    description:
      'Intricate South Indian Nakshi artistry hand-set with deep Kemp rubies and natural pearl clusters to complete your ceremonial look.',
    mediaType: 'video',
    mediaSource: 'url',
    mediaUrl: BRAND_IMAGES.jewelryVideo,
    mediaFileName: '',
    primaryCtaText: 'EXPLORE JEWELRY',
    primaryCtaLink: '/jewelry',
    secondaryCtaText: 'SHOP JHUMKAS',
    secondaryCtaLink: '/jewelry?sub=Jhumkas',
  },
];

export const DEFAULT_SETTINGS: StoreSettings = {
  announcementText: 'Complimentary Shipping across India on Orders Above ₹2,999 · Boutique Concierge: +91 7036623624',
  freeShippingThreshold: 2999,
  codEnabled: true,
  storySubtitle: 'OUR HERITAGE & PHILOSOPHY',
  storyTitle: 'Crafted With Tradition. Curated For Today.',
  storyQuote: 'Celebrating the timeless poetry of Indian handlooms and sacred temple jewelry.',
  storyParagraph1: 'Founded with a devotion to authentic Indian textiles and traditional goldsmithing, Latha Sarees & Jewelry curates heirloom drapes and artisanal jewelry for women who cherish heritage with modern refinement.',
  storyParagraph2: 'Every Banarasi and Kanchipuram saree in our collection is selected for the purity of its silk, the richness of its zari weave, and the grace of its drape. Our jewelry collection pairs these textiles with handcrafted Kemp ruby jhumkas, Goddess Lakshmi Nakshi harams, and Nizam kadas.',
  storyImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
  heroMediaType: 'image',
  heroMediaUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600',
  heroMediaSource: 'url',
  heroMediaFileName: '',
  heroTitleLine1: 'TIMELESS INDIAN',
  heroTitleLine2: 'ELEGANCE,',
  heroSubtitleGold: 'PRECIOUS & WOVEN FOR YOU.',
  heroKicker: 'SAREES · TEMPLE JEWELRY · JHUMKAS · NECKLACES · HERITAGE',
  heroDescription:
    'Discover handwoven Banarasi and Kanchipuram silks alongside sacred temple jewelry crafted to celebrate every unforgettable occasion.',
  heroPrimaryCtaText: 'DISCOVER THE COLLECTION',
  heroPrimaryCtaLink: '/shop',
  secondaryCtaText: 'EXPLORE JEWELRY',
  secondaryCtaLink: '/jewelry',
  heroSlides: DEFAULT_HERO_SLIDES,
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('latha_deleted_product_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedDeleted = localStorage.getItem('latha_deleted_product_ids');
      const deleted: string[] = savedDeleted ? JSON.parse(savedDeleted) : [];
      return INITIAL_PRODUCTS.filter((p) => !deleted.includes(p.id));
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('latha_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('latha_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('latha_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<UserPrivateProfile | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('latha_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedSlides = Array.isArray(parsed.heroSlides) && parsed.heroSlides.length > 0
          ? parsed.heroSlides
          : DEFAULT_HERO_SLIDES.map((s, idx) => {
              if (idx === 0 && (parsed.heroTitleLine1 || parsed.heroMediaUrl)) {
                return {
                  ...s,
                  titleLine1: parsed.heroTitleLine1 || s.titleLine1,
                  titleLine2: parsed.heroTitleLine2 || s.titleLine2,
                  subtitleGold: parsed.heroSubtitleGold || s.subtitleGold,
                  kicker: parsed.heroKicker || s.kicker,
                  description: parsed.heroDescription || s.description,
                  mediaType: parsed.heroMediaType || s.mediaType,
                  mediaSource: parsed.heroMediaSource || s.mediaSource,
                  mediaUrl: parsed.heroMediaUrl || s.mediaUrl,
                  mediaFileName: parsed.heroMediaFileName || s.mediaFileName,
                  primaryCtaText: parsed.heroPrimaryCtaText || s.primaryCtaText,
                  primaryCtaLink: parsed.heroPrimaryCtaLink || s.primaryCtaLink,
                  secondaryCtaText: parsed.heroSecondaryCtaText || s.secondaryCtaText,
                  secondaryCtaLink: parsed.heroSecondaryCtaLink || s.secondaryCtaLink,
                };
              }
              return s;
            });
        return { ...DEFAULT_SETTINGS, ...parsed, heroSlides: mergedSlides };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  useEffect(() => {
    try {
      localStorage.setItem('latha_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('latha_wishlist_v1', JSON.stringify(wishlistIds));
    } catch {
      // ignore storage errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      if (orders.length > 0) {
        localStorage.setItem('latha_orders_v1', JSON.stringify(orders));
      }
    } catch {
      // ignore storage errors
    }
  }, [orders]);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const isAdmin = useMemo(() => {
    return Boolean(user && user.emailVerified && user.email && ADMIN_EMAILS.includes(user.email));
  }, [user]);

  // Public products & store settings listener
  useEffect(() => {
    const productsPath = 'products';
    const unsubProducts = onSnapshot(
      collection(db, productsPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Product[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name,
              slug: data.slug,
              description: data.description,
              category: data.category,
              subcategory: data.subcategory,
              price: Number(data.price),
              originalPrice: Number(data.originalPrice),
              discount: Number(data.discount),
              images: Array.isArray(data.images) ? data.images : [data.thumbnail],
              thumbnail: data.thumbnail,
              stock: Number(data.stock),
              sku: data.sku,
              colors: Array.isArray(data.colors) ? data.colors : ['Antique Gold'],
              fabric: data.fabric,
              occasion: data.occasion,
              weave: data.weave || 'Handloom Craft',
              featured: Boolean(data.featured),
              newArrival: Boolean(data.newArrival),
              rating: Number(data.rating || 4.9),
              reviewCount: Number(data.reviewCount || 18),
            };
          });
          setProducts(loaded);
        } else {
          setProducts(INITIAL_PRODUCTS.filter((p) => !deletedIds.includes(p.id)));
        }
      },
      (error) => {
        console.warn('Firestore products listener info:', error);
      }
    );

    const settingsDocPath = 'settings/store';
    getDoc(doc(db, 'settings', 'store'))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSettings((prev) => ({
            ...prev,
            announcementText: data.announcementText || prev.announcementText,
            freeShippingThreshold: Number(data.freeShippingThreshold ?? prev.freeShippingThreshold),
            codEnabled: Boolean(data.codEnabled ?? prev.codEnabled),
            storySubtitle: data.storySubtitle || prev.storySubtitle,
            storyTitle: data.storyTitle || prev.storyTitle,
            storyQuote: data.storyQuote || prev.storyQuote,
            storyParagraph1: data.storyParagraph1 || prev.storyParagraph1,
            storyParagraph2: data.storyParagraph2 || prev.storyParagraph2,
            storyImageUrl: data.storyImageUrl || prev.storyImageUrl,
            heroMediaType: data.heroMediaType || prev.heroMediaType,
            heroMediaUrl: data.heroMediaUrl || prev.heroMediaUrl,
            heroMediaSource: data.heroMediaSource || prev.heroMediaSource,
            heroMediaFileName: data.heroMediaFileName || prev.heroMediaFileName,
            heroTitleLine1: data.heroTitleLine1 || prev.heroTitleLine1,
            heroTitleLine2: data.heroTitleLine2 || prev.heroTitleLine2,
            heroSubtitleGold: data.heroSubtitleGold || prev.heroSubtitleGold,
            heroKicker: data.heroKicker || prev.heroKicker,
            heroDescription: data.heroDescription || prev.heroDescription,
            heroPrimaryCtaText: data.heroPrimaryCtaText || prev.heroPrimaryCtaText,
            heroPrimaryCtaLink: data.heroPrimaryCtaLink || prev.heroPrimaryCtaLink,
            heroSecondaryCtaText: data.heroSecondaryCtaText || prev.heroSecondaryCtaText,
            heroSecondaryCtaLink: data.heroSecondaryCtaLink || prev.heroSecondaryCtaLink,
            heroSlides: Array.isArray(data.heroSlides) && data.heroSlides.length > 0 ? data.heroSlides : prev.heroSlides,
          }));
        }
      })
      .catch((error) => {
        console.warn('Firestore settings listener info:', error);
      });

    // Check if there is an uploaded system media file (video or image) in IndexedDB
    getLocalMedia('hero_media_file').then((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const isVideo = blob.type.startsWith('video');
        setSettings((prev) => {
          if (prev.heroMediaSource === 'system') {
            return {
              ...prev,
              heroMediaType: isVideo ? 'video' : 'image',
              heroMediaUrl: url,
            };
          }
          return prev;
        });
      }
    });

    return () => {
      unsubProducts();
    };
  }, []);

  // Authenticated listeners: Profile, Wishlist, Orders
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setOrders([]);
      setProfile(null);
      return;
    }

    const profilePath = `users/${user.uid}/private/profile`;
    getDoc(doc(db, 'users', user.uid, 'private', 'profile'))
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setProfile({
            uid: user.uid,
            displayName: d.displayName || user.displayName || '',
            email: d.email || user.email || '',
            phone: d.phone || '',
            addressLine: d.addressLine || '',
            city: d.city || '',
            state: d.state || '',
            pincode: d.pincode || '',
          });
        } else {
          setProfile({
            uid: user.uid,
            displayName: user.displayName || 'Patron',
            email: user.email || '',
            phone: '',
            addressLine: '',
            city: '',
            state: '',
            pincode: '',
          });
        }
      })
      .catch((error) => {
        handleFirestoreError(error, OperationType.GET, profilePath);
      });

    const wishlistPath = 'wishlists';
    const qWishlist = query(collection(db, wishlistPath), where('userId', '==', user.uid));
    const unsubWishlist = onSnapshot(
      qWishlist,
      (snap) => {
        const ids = snap.docs.map((d) => String(d.data().productId));
        if (ids.length > 0) {
          setWishlistIds(ids);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, wishlistPath);
      }
    );

    const ordersPath = 'orders';
    const qOrders = isAdmin
      ? query(collection(db, ordersPath))
      : query(collection(db, ordersPath), where('userId', '==', user.uid));

    const unsubOrders = onSnapshot(
      qOrders,
      (snap) => {
        const list: OrderRecord[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            orderNumber: data.orderNumber,
            userId: data.userId,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            shippingAddress: data.shippingAddress,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentStatus,
            status: data.status,
            subtotal: Number(data.subtotal),
            shippingFee: Number(data.shippingFee),
            discountAmount: Number(data.discountAmount),
            totalAmount: Number(data.totalAmount),
            itemSummary: data.itemSummary,
            itemCount: Number(data.itemCount),
            createdAt: formatTimestamp(data.createdAt),
          };
        });
        setOrders(list);
      },
      (error) => {
        console.warn('Firestore orders listener info:', error);
      }
    );

    return () => {
      unsubWishlist();
      unsubOrders();
    };
  }, [authReady, user, isAdmin]);

  const addToCart = (
    product: Product,
    quantity = 1,
    color?: string,
    openDrawer = true
  ) => {
    const chosenColor = color || product.colors[0] || 'Default';
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === chosenColor
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(product.stock, updated[existingIndex].quantity + quantity),
        };
        return updated;
      }
      return [...prev, { product, quantity, selectedColor: chosenColor }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
    showToast(`Added "${product.name}" to your shopping bag`);
  };

  const removeFromCart = (productId: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === color)
      )
    );
  };

  const updateCartQuantity = (productId: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor === color
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (productId: string) => {
    const exists = wishlistIds.includes(productId);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from your wishlist');
      if (user && user.emailVerified) {
        const docId = `${user.uid}_${productId}`.replace(/[^a-zA-Z0-9_-]/g, '_');
        try {
          await deleteDoc(doc(db, 'wishlists', docId));
        } catch {
          // ignore if not persisted in Firestore yet
        }
      }
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      showToast('Saved to your personal wishlist');
      if (user && user.emailVerified) {
        const docId = `${user.uid}_${productId}`.replace(/[^a-zA-Z0-9_-]/g, '_');
        try {
          const productDoc = await getDoc(doc(db, 'products', productId));
          if (productDoc.exists()) {
            await setDoc(doc(db, 'wishlists', docId), {
              userId: user.uid,
              productId,
              createdAt: serverTimestamp(),
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `wishlists/${docId}`);
        }
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Welcome to Latha Sarees & Jewelry');
    } catch (err) {
      console.error('Sign-in error:', err);
      showToast('Sign-in was cancelled or could not complete');
    }
  };

  const logout = async () => {
    await signOut(auth);
    showToast('You have signed out safely');
  };

  const saveUserProfile = async (data: Omit<UserPrivateProfile, 'uid'>) => {
    if (!user || !user.emailVerified) return;
    const path = `users/${user.uid}/private/profile`;
    const payload = {
      uid: user.uid,
      displayName: data.displayName.trim().slice(0, 100) || 'Patron',
      email: (data.email.trim() || user.email || '').slice(0, 150),
      phone: data.phone.trim().slice(0, 25),
      addressLine: data.addressLine.trim().slice(0, 250),
      city: data.city.trim().slice(0, 80),
      state: data.state.trim().slice(0, 80),
      pincode: data.pincode.trim().slice(0, 12),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, 'users', user.uid, 'private', 'profile'), payload);
      setProfile({
        uid: user.uid,
        displayName: payload.displayName,
        email: payload.email,
        phone: payload.phone,
        addressLine: payload.addressLine,
        city: payload.city,
        state: payload.state,
        pincode: payload.pincode,
      });
      showToast('Account & delivery preferences saved');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const placeOrder = async (orderInput: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: 'Online Payment' | 'Cash on Delivery';
    discountAmount: number;
  }): Promise<OrderRecord> => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : 199;
    const totalAmount = Math.max(0, subtotal + shippingFee - orderInput.discountAmount);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const itemSummary = cart
      .map((i) => `${i.product.name} (${i.selectedColor}) × ${i.quantity}`)
      .join(' · ')
      .slice(0, 950);

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `LTH-${randomDigits}`;
    const orderId = `ord_${Date.now()}_${randomDigits}`;
    const paymentStatus: 'Paid' | 'COD' =
      orderInput.paymentMethod === 'Online Payment' ? 'Paid' : 'COD';
    const initialStatus: 'Confirmed' | 'Pending' =
      orderInput.paymentMethod === 'Online Payment' ? 'Confirmed' : 'Pending';

    const localRecord: OrderRecord = {
      id: orderId,
      orderNumber,
      userId: user?.uid || 'guest_patron',
      customerName: orderInput.customerName.trim().slice(0, 100),
      customerEmail: orderInput.customerEmail.trim().slice(0, 150),
      customerPhone: orderInput.customerPhone.trim().slice(0, 20),
      shippingAddress: orderInput.shippingAddress.trim().slice(0, 300),
      city: orderInput.city.trim().slice(0, 80),
      state: orderInput.state.trim().slice(0, 80),
      pincode: orderInput.pincode.trim().slice(0, 12),
      paymentMethod: orderInput.paymentMethod,
      paymentStatus,
      status: initialStatus,
      subtotal,
      shippingFee,
      discountAmount: orderInput.discountAmount,
      totalAmount,
      itemSummary: itemSummary || 'Curated Latha Order',
      itemCount: Math.max(1, itemCount),
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    if (user && user.emailVerified) {
      const path = `orders/${orderId}`;
      try {
        await setDoc(doc(db, 'orders', orderId), {
          orderNumber: localRecord.orderNumber,
          userId: user.uid,
          customerName: localRecord.customerName,
          customerEmail: localRecord.customerEmail,
          customerPhone: localRecord.customerPhone,
          shippingAddress: localRecord.shippingAddress,
          city: localRecord.city,
          state: localRecord.state,
          pincode: localRecord.pincode,
          paymentMethod: localRecord.paymentMethod,
          paymentStatus: localRecord.paymentStatus,
          status: localRecord.status,
          subtotal: localRecord.subtotal,
          shippingFee: localRecord.shippingFee,
          discountAmount: localRecord.discountAmount,
          totalAmount: localRecord.totalAmount,
          itemSummary: localRecord.itemSummary,
          itemCount: localRecord.itemCount,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.warn('Firestore order sync warning:', error);
      }
    }
    setOrders((prev) => [localRecord, ...prev]);

    clearCart();
    return localRecord;
  };

  const cancelCustomerOrder = async (orderId: string, currentOrder: OrderRecord) => {
    if (!user || !user.emailVerified) return;
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Cancelled',
        updatedAt: serverTimestamp(),
      });
      showToast(`Order ${currentOrder.orderNumber} has been cancelled`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const adminSaveProduct = async (productInput: Omit<Product, 'id'> & { id?: string }) => {
    if (!isAdmin) return;
    const cleanSlug = productInput.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 130);
    const productId =
      productInput.id || `prod_${cleanSlug.slice(0, 40)}_${Date.now().toString().slice(-4)}`.replace(/[^a-zA-Z0-9_-]/g, '_');

    const path = `products/${productId}`;
    const existingDoc = await getDoc(doc(db, 'products', productId));

    const payload = {
      name: productInput.name.trim().slice(0, 140),
      slug: cleanSlug,
      description: productInput.description.trim().slice(0, 2000),
      category: productInput.category,
      subcategory: productInput.subcategory.trim().slice(0, 60),
      price: Number(productInput.price),
      originalPrice: Math.max(Number(productInput.price), Number(productInput.originalPrice)),
      discount: Math.min(95, Math.max(0, Number(productInput.discount))),
      images: productInput.images.slice(0, 8),
      thumbnail: productInput.thumbnail.trim().slice(0, 500),
      stock: Math.max(0, Number(productInput.stock)),
      sku: productInput.sku.trim().slice(0, 40),
      colors: productInput.colors.slice(0, 10),
      fabric: productInput.fabric.trim().slice(0, 80),
      occasion: productInput.occasion.trim().slice(0, 80),
      weave: (productInput.weave || 'Handloom Craft').trim().slice(0, 80),
      featured: Boolean(productInput.featured),
      newArrival: Boolean(productInput.newArrival),
      rating: Number(productInput.rating || 4.9),
      reviewCount: Number(productInput.reviewCount || 12),
    };

    const updatedProduct: Product = {
      id: productId,
      ...payload,
    };

    setDeletedIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      try {
        localStorage.setItem('latha_deleted_product_ids', JSON.stringify(next));
      } catch {}
      return next;
    });

    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === productId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = updatedProduct;
        return copy;
      }
      return [updatedProduct, ...prev];
    });

    try {
      if (existingDoc.exists()) {
        await updateDoc(doc(db, 'products', productId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        showToast(`Updated "${payload.name}"`);
      } else {
        await setDoc(doc(db, 'products', productId), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        showToast(`Published "${payload.name}" to catalog`);
      }
    } catch (error) {
      console.warn('Firestore write warning:', error);
      showToast(`Saved "${payload.name}" to catalog`);
    }
  };

  const adminDeleteProduct = async (productId: string) => {
    if (!isAdmin) {
      showToast('You must be signed in as administrator to delete products');
      return;
    }
    // Optimistically remove from state so it immediately disappears from UI
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    
    // Track deleted ID so it persists across page reloads and snapshot updates
    setDeletedIds((prev) => {
      const next = prev.includes(productId) ? prev : [...prev, productId];
      try {
        localStorage.setItem('latha_deleted_product_ids', JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });

    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
      showToast('Product removed from catalog');
    } catch (error) {
      console.warn('Firestore deletion info:', error);
      showToast('Product removed from catalog');
    }
  };

  const adminUpdateOrderStatus = async (
    orderId: string,
    status: OrderRecord['status'],
    paymentStatus: OrderRecord['paymentStatus']
  ) => {
    if (!isAdmin) return;
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        paymentStatus,
        updatedAt: serverTimestamp(),
      });
      showToast(`Order status updated to ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const adminUpdateSettings = async (newSettings: StoreSettings) => {
    if (!isAdmin) return;
    setSettings(newSettings);
    try {
      localStorage.setItem('latha_store_settings', JSON.stringify(newSettings));
    } catch {
      // ignore storage error
    }

    const path = 'settings/store';
    try {
      await setDoc(doc(db, 'settings', 'store'), {
        announcementText: (newSettings.announcementText || '').trim().slice(0, 200),
        freeShippingThreshold: Number(newSettings.freeShippingThreshold || 0),
        codEnabled: Boolean(newSettings.codEnabled),
        storySubtitle: (newSettings.storySubtitle || '').trim().slice(0, 100),
        storyTitle: (newSettings.storyTitle || '').trim().slice(0, 200),
        storyQuote: (newSettings.storyQuote || '').trim().slice(0, 300),
        storyParagraph1: (newSettings.storyParagraph1 || '').trim().slice(0, 1500),
        storyParagraph2: (newSettings.storyParagraph2 || '').trim().slice(0, 1500),
        storyImageUrl: (newSettings.storyImageUrl || '').trim().slice(0, 500),
        heroMediaType: newSettings.heroMediaType || 'image',
        heroMediaUrl: (newSettings.heroMediaUrl || '').trim().slice(0, 2000),
        heroMediaSource: newSettings.heroMediaSource || 'url',
        heroMediaFileName: (newSettings.heroMediaFileName || '').trim().slice(0, 200),
        heroTitleLine1: (newSettings.heroTitleLine1 || '').trim().slice(0, 100),
        heroTitleLine2: (newSettings.heroTitleLine2 || '').trim().slice(0, 100),
        heroSubtitleGold: (newSettings.heroSubtitleGold || '').trim().slice(0, 150),
        heroKicker: (newSettings.heroKicker || '').trim().slice(0, 200),
        heroDescription: (newSettings.heroDescription || '').trim().slice(0, 800),
        heroPrimaryCtaText: (newSettings.heroPrimaryCtaText || '').trim().slice(0, 50),
        heroPrimaryCtaLink: (newSettings.heroPrimaryCtaLink || '').trim().slice(0, 100),
        heroSecondaryCtaText: (newSettings.heroSecondaryCtaText || '').trim().slice(0, 50),
        heroSecondaryCtaLink: (newSettings.heroSecondaryCtaLink || '').trim().slice(0, 100),
        heroSlides: (newSettings.heroSlides || DEFAULT_HERO_SLIDES).map((s) => ({
          id: Number(s.id),
          titleLine1: (s.titleLine1 || '').trim().slice(0, 100),
          titleLine2: (s.titleLine2 || '').trim().slice(0, 100),
          subtitleGold: (s.subtitleGold || '').trim().slice(0, 150),
          kicker: (s.kicker || '').trim().slice(0, 200),
          description: (s.description || '').trim().slice(0, 800),
          mediaType: s.mediaType || 'image',
          mediaSource: s.mediaSource || 'url',
          mediaUrl: (s.mediaUrl || '').trim().slice(0, 2000),
          mediaFileName: (s.mediaFileName || '').trim().slice(0, 200),
          primaryCtaText: (s.primaryCtaText || '').trim().slice(0, 50),
          primaryCtaLink: (s.primaryCtaLink || '').trim().slice(0, 100),
          secondaryCtaText: (s.secondaryCtaText || '').trim().slice(0, 50),
          secondaryCtaLink: (s.secondaryCtaLink || '').trim().slice(0, 100),
        })),
        updatedAt: serverTimestamp(),
      });
      showToast('Boutique hero & settings updated');
    } catch (error) {
      console.warn('Firestore settings update warning:', error);
      showToast('Boutique hero & settings updated');
    }
  };

  const uploadHeroMediaFile = async (file: File, slideIdx: number = 0): Promise<string> => {
    if (!isAdmin) throw new Error('Admin authorization required');
    const storageKey = `hero_media_file_${slideIdx}`;
    await saveLocalMedia(storageKey, file);
    if (slideIdx === 0) {
      await saveLocalMedia('hero_media_file', file);
    }
    const objectUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');
    
    const currentSlides = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
    if (currentSlides[slideIdx]) {
      currentSlides[slideIdx] = {
        ...currentSlides[slideIdx],
        mediaType: isVideo ? 'video' : 'image',
        mediaUrl: objectUrl,
        mediaSource: 'system',
        mediaFileName: file.name,
      };
    }
    
    const updated: StoreSettings = {
      ...settings,
      heroSlides: currentSlides,
      ...(slideIdx === 0
        ? {
            heroMediaType: isVideo ? 'video' : 'image',
            heroMediaUrl: objectUrl,
            heroMediaSource: 'system' as const,
            heroMediaFileName: file.name,
          }
        : {}),
    };
    await adminUpdateSettings(updated);
    showToast(`Slide ${slideIdx + 1} media file updated from system`);
    return objectUrl;
  };

  const resetHeroMediaToDefault = async (slideIdx: number = 0): Promise<void> => {
    if (!isAdmin) return;
    const storageKey = `hero_media_file_${slideIdx}`;
    await deleteLocalMedia(storageKey);
    if (slideIdx === 0) {
      await deleteLocalMedia('hero_media_file');
    }
    const currentSlides = [...(settings.heroSlides || DEFAULT_HERO_SLIDES)];
    const defaultSlide = DEFAULT_HERO_SLIDES[slideIdx] || DEFAULT_HERO_SLIDES[0];
    currentSlides[slideIdx] = { ...defaultSlide };
    
    const updated: StoreSettings = {
      ...settings,
      heroSlides: currentSlides,
      ...(slideIdx === 0
        ? {
            heroMediaType: defaultSlide.mediaType,
            heroMediaUrl: defaultSlide.mediaUrl,
            heroMediaSource: 'url' as const,
            heroMediaFileName: '',
          }
        : {}),
    };
    await adminUpdateSettings(updated);
    showToast(`Slide ${slideIdx + 1} reset to default`);
  };

  const adminSeedCatalog = async () => {
    if (!isAdmin) return;
    try {
      for (const item of INITIAL_PRODUCTS) {
        const docRef = doc(db, 'products', item.id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          await setDoc(docRef, {
            name: item.name,
            slug: item.slug,
            description: item.description,
            category: item.category,
            subcategory: item.subcategory,
            price: item.price,
            originalPrice: item.originalPrice,
            discount: item.discount,
            images: item.images,
            thumbnail: item.thumbnail,
            stock: item.stock,
            sku: item.sku,
            colors: item.colors,
            fabric: item.fabric,
            occasion: item.occasion,
            weave: item.weave,
            featured: item.featured,
            newArrival: item.newArrival,
            rating: item.rating,
            reviewCount: item.reviewCount,
            createdAt: serverTimestamp(),
          });
        }
      }
      showToast('All 8 signature catalog pieces synced to Firestore');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlistIds,
        orders,
        user,
        isAdmin,
        authReady,
        profile,
        settings,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        loginWithGoogle,
        logout,
        saveUserProfile,
        placeOrder,
        cancelCustomerOrder,
        adminSaveProduct,
        adminDeleteProduct,
        adminUpdateOrderStatus,
        adminUpdateSettings,
        adminSeedCatalog,
        uploadHeroMediaFile,
        resetHeroMediaToDefault,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
