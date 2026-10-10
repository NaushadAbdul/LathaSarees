import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Package,
  ShoppingBag,
  Settings,
  Database,
  ShieldAlert,
  AlertTriangle,
  BookOpen,
  Eye,
  Search,
  ArrowLeft,
  CheckCircle2,
  Film,
  Video,
  UploadCloud,
  RotateCcw,
  Sparkles,
  Play,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore, OrderRecord, DEFAULT_HERO_SLIDES, HeroSlideConfig } from '../context/StoreContext';
import { BRAND_IMAGES, Product } from '../data/catalog';
import { parseHeroMedia, extractPinterestPinId, isPinterestUrl } from '../utils/mediaEmbed';

const PRESET_IMAGES = [
  { label: 'Crimson Banarasi Saree', url: BRAND_IMAGES.sareeBanarasiCrimson },
  { label: 'Emerald Kanchipuram Saree', url: BRAND_IMAGES.sareeKanchipuramEmerald },
  { label: 'Bridal Wine Zari Saree', url: BRAND_IMAGES.heroBridal },
  { label: 'Temple Kemp Jhumkas', url: BRAND_IMAGES.jewelryTempleJhumka },
  { label: 'Lakshmi Temple Necklace', url: BRAND_IMAGES.jewelryLakshmiNecklace },
  { label: 'Nizam Kundan Bangles', url: BRAND_IMAGES.jewelryKundanBangles },
];

const PRESET_HERO_VIDEOS = [
  {
    label: 'Signature Sarees Video (sareesvideo.mp4)',
    url: BRAND_IMAGES.sareesVideo,
  },
  {
    label: 'Royal Gold Jewelry Video (Woman_showcasing_gold_jewellery.mp4)',
    url: BRAND_IMAGES.jewelryVideo,
  },
  {
    label: 'Traditional Silk Loom Weaving (MP4)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-weaving-on-a-loom-41804-large.mp4',
  },
  {
    label: 'Royal Gold Jewelry & Gem Shimmer (MP4)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-golden-jewelry-pieces-41793-large.mp4',
  },
  {
    label: 'Crimson Silk Fabric Flowing Motion (MP4)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-red-silk-fabric-waving-in-the-wind-41913-large.mp4',
  },
];

const PRESET_HERO_IMAGES = [
  { label: 'Bridal Crimson Banarasi Silk', url: BRAND_IMAGES.heroBridal },
  { label: 'Royal Red Zari Trousseau', url: BRAND_IMAGES.sareeBanarasiCrimson },
  { label: 'Emerald Korvai Kanchipuram', url: BRAND_IMAGES.sareeKanchipuramEmerald },
  { label: 'Maharani Temple Lakshmi Haram', url: BRAND_IMAGES.jewelryLakshmiNecklace },
  { label: 'Antique Kemp Temple Jhumkas', url: BRAND_IMAGES.jewelryTempleJhumka },
  { label: 'Nizam Kundan Bangles', url: BRAND_IMAGES.jewelryKundanBangles },
];

const PRESET_PINTEREST_PINS = [
  {
    label: 'Traditional Loom Weaving Silk Drape Pin',
    url: 'https://in.pinterest.com/pin/31384528648409924/',
  },
  {
    label: 'Royal Bridal Saree Portrait Pin',
    url: 'https://www.pinterest.com/pin/84625458624935670/',
  },
];

export const AdminDashboard: React.FC<{
  initialTab?: 'products' | 'add-product' | 'hero' | 'orders' | 'story' | 'settings';
}> = ({ initialTab = 'products' }) => {
  const {
    user,
    isAdmin,
    loginWithGoogle,
    products,
    orders,
    settings,
    adminSaveProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    adminUpdateSettings,
    adminSeedCatalog,
    uploadHeroMediaFile,
    resetHeroMediaToDefault,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'products' | 'add-product' | 'hero' | 'orders' | 'story' | 'settings'
  >(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Product Form State (Clean by default - admin fills only what they know)
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Sarees' | 'Jewelry'>('Sarees');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [fabric, setFabric] = useState('');
  const [occasion, setOccasion] = useState('');
  const [weave, setWeave] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);

  // Catalog Browsing & Search State
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilter, setCatalogFilter] = useState<'All' | 'Sarees' | 'Jewelry'>('All');

  // Settings State
  const [announcementText, setAnnouncementText] = useState(
    settings.announcementText
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    settings.freeShippingThreshold
  );
  const [codEnabled, setCodEnabled] = useState(settings.codEnabled);

  // Story / Brand Heritage State
  const [storySubtitle, setStorySubtitle] = useState(
    settings.storySubtitle || 'OUR HERITAGE & PHILOSOPHY'
  );
  const [storyTitle, setStoryTitle] = useState(
    settings.storyTitle || 'Crafted With Tradition. Curated For Today.'
  );
  const [storyQuote, setStoryQuote] = useState(
    settings.storyQuote || 'Celebrating the timeless poetry of Indian handlooms and sacred temple jewelry.'
  );
  const [storyParagraph1, setStoryParagraph1] = useState(
    settings.storyParagraph1 || 'Founded with a devotion to authentic Indian textiles and traditional goldsmithing, Latha Sarees & Jewelry curates heirloom drapes and artisanal jewelry for women who cherish heritage with modern refinement.'
  );
  const [storyParagraph2, setStoryParagraph2] = useState(
    settings.storyParagraph2 || 'Every Banarasi and Kanchipuram saree in our collection is selected for the purity of its silk, the richness of its zari weave, and the grace of its drape. Our jewelry collection pairs these textiles with handcrafted Kemp ruby jhumkas, Goddess Lakshmi Nakshi harams, and Nizam kadas.'
  );
  const [storyImageUrl, setStoryImageUrl] = useState(
    settings.storyImageUrl || BRAND_IMAGES.heroBridal
  );

  // Hero Section State & Multi-Slide Selection
  const [selectedHeroSlideIdx, setSelectedHeroSlideIdx] = useState(0);

  const getSlideConfig = (slideIdx: number): HeroSlideConfig => {
    const list = settings.heroSlides && settings.heroSlides.length > 0
      ? settings.heroSlides
      : DEFAULT_HERO_SLIDES;
    return list[slideIdx] || DEFAULT_HERO_SLIDES[slideIdx] || DEFAULT_HERO_SLIDES[0];
  };

  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video' | 'pinterest'>(
    settings.heroMediaType || 'image'
  );
  const [heroMediaSource, setHeroMediaSource] = useState<'url' | 'system'>(
    settings.heroMediaSource || 'url'
  );
  const [heroMediaUrl, setHeroMediaUrl] = useState(
    settings.heroMediaUrl || BRAND_IMAGES.heroBridal
  );
  const [heroMediaFileName, setHeroMediaFileName] = useState(
    settings.heroMediaFileName || ''
  );
  const [heroTitleLine1, setHeroTitleLine1] = useState(
    settings.heroTitleLine1 || 'HEIRLOOM SILK'
  );
  const [heroTitleLine2, setHeroTitleLine2] = useState(
    settings.heroTitleLine2 || 'DRAPES,'
  );
  const [heroSubtitleGold, setHeroSubtitleGold] = useState(
    settings.heroSubtitleGold || 'HANDWOVEN IN KANCHIPURAM & KASHI.'
  );
  const [heroKicker, setHeroKicker] = useState(
    settings.heroKicker || 'PURE MULBERRY SILK · KORVAI ZARI · BRIDAL TROUSSEAU'
  );
  const [heroDescription, setHeroDescription] = useState(
    settings.heroDescription ||
      'Each saree in the Latha archive is selected directly from master weaver looms for its lustrous drape and architectural gold zari.'
  );
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState(
    settings.heroPrimaryCtaText || 'SHOP SAREES'
  );
  const [heroPrimaryCtaLink, setHeroPrimaryCtaLink] = useState(
    settings.heroPrimaryCtaLink || '/sarees'
  );
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState(
    settings.heroSecondaryCtaText || 'BRIDAL EDIT'
  );
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState(
    settings.heroSecondaryCtaLink || '/collections/wedding-collection'
  );

  useEffect(() => {
    setAnnouncementText(settings.announcementText);
    setFreeShippingThreshold(settings.freeShippingThreshold);
    setCodEnabled(settings.codEnabled);
    if (settings.storySubtitle) setStorySubtitle(settings.storySubtitle);
    if (settings.storyTitle) setStoryTitle(settings.storyTitle);
    if (settings.storyQuote) setStoryQuote(settings.storyQuote);
    if (settings.storyParagraph1) setStoryParagraph1(settings.storyParagraph1);
    if (settings.storyParagraph2) setStoryParagraph2(settings.storyParagraph2);
    if (settings.storyImageUrl) setStoryImageUrl(settings.storyImageUrl);

    const targetSlide = getSlideConfig(selectedHeroSlideIdx);
    setHeroMediaType(targetSlide.mediaType || 'image');
    setHeroMediaSource(targetSlide.mediaSource || 'url');
    setHeroMediaUrl(targetSlide.mediaUrl || '');
    setHeroMediaFileName(targetSlide.mediaFileName || '');
    setHeroTitleLine1(targetSlide.titleLine1 || '');
    setHeroTitleLine2(targetSlide.titleLine2 || '');
    setHeroSubtitleGold(targetSlide.subtitleGold || '');
    setHeroKicker(targetSlide.kicker || '');
    setHeroDescription(targetSlide.description || '');
    setHeroPrimaryCtaText(targetSlide.primaryCtaText || '');
    setHeroPrimaryCtaLink(targetSlide.primaryCtaLink || '');
    setHeroSecondaryCtaText(targetSlide.secondaryCtaText || '');
    setHeroSecondaryCtaLink(targetSlide.secondaryCtaLink || '');
  }, [settings, selectedHeroSlideIdx]);

  if (!user) {
    return (
      <div className="bg-[#F7F0E6] min-h-[75vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FFFDFC] border border-[#B99A62]/40 p-8 text-center space-y-5">
          <ShieldAlert className="w-10 h-10 text-[#5A2630] mx-auto" />
          <h1 className="font-serif-luxury text-3xl text-[#33221C]">
            Boutique Admin Portal
          </h1>
          <p className="text-xs text-[#806B5E]">
            Sign in with the authorized administrator Google account to manage products, inventory, orders, and announcement settings.
          </p>
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em]"
          >
            SIGN IN AS ADMINISTRATOR
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-[#F7F0E6] min-h-[75vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FFFDFC] border border-[#B99A62]/40 p-8 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-[#5A2630] mx-auto" />
          <h1 className="font-serif-luxury text-3xl text-[#33221C]">
            Restricted Access
          </h1>
          <p className="text-xs text-[#806B5E]">
            Signed in as <strong>{user.email}</strong>. Only verified boutique administrators can modify catalog and order records.
          </p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled' && o.status !== 'Returned')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const filteredCatalog = products.filter((p) => {
    const matchesCat = catalogFilter === 'All' ? true : p.category === catalogFilter;
    const q = catalogSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setName(p.name || '');
    setCategory(p.category || 'Sarees');
    setSubcategory(p.subcategory || '');
    setPrice(p.price ?? '');
    setOriginalPrice(p.originalPrice ?? '');
    setStock(p.stock !== undefined ? p.stock : '');
    setSku(p.sku || '');
    setFabric(p.fabric || '');
    setOccasion(p.occasion || '');
    setWeave(p.weave || '');
    setColorsInput(p.colors ? p.colors.join(', ') : '');
    setThumbnail(p.thumbnail || '');
    setDescription(p.description || '');
    setFeatured(p.featured ?? false);
    setNewArrival(p.newArrival ?? false);
    setActiveTab('add-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(undefined);
    setName('');
    setCategory('Sarees');
    setSubcategory('');
    setPrice('');
    setOriginalPrice('');
    setStock('');
    setSku('');
    setFabric('');
    setOccasion('');
    setWeave('');
    setColorsInput('');
    setThumbnail('');
    setDescription('');
    setFeatured(false);
    setNewArrival(true);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setThumbnail(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert('Please enter at least a Product Name.');
      return;
    }

    const numPrice = price !== '' && !isNaN(Number(price)) ? Number(price) : 0;
    const numOriginalPrice =
      originalPrice !== '' && !isNaN(Number(originalPrice))
        ? Number(originalPrice)
        : numPrice;
    const calcDiscount =
      numOriginalPrice > numPrice && numOriginalPrice > 0
        ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
        : 0;

    const slug =
      trimmedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `prod-${Date.now()}`;

    const finalSku =
      sku.trim() ||
      `LTH-${category === 'Sarees' ? 'SAR' : 'JWL'}-${Math.floor(100 + Math.random() * 900)}`;
    const finalSubcategory =
      subcategory.trim() || (category === 'Sarees' ? 'Saree' : 'Jewelry');
    const finalThumbnail =
      thumbnail.trim() ||
      (category === 'Sarees'
        ? BRAND_IMAGES.sareeBanarasiCrimson
        : BRAND_IMAGES.jewelryTempleJhumka);
    const finalColors = colorsInput.trim()
      ? colorsInput.split(',').map((c) => c.trim()).filter(Boolean)
      : ['Standard'];
    const finalStock =
      stock !== '' && !isNaN(Number(stock)) ? Number(stock) : 1;

    await adminSaveProduct({
      id: editingId,
      name: trimmedName,
      slug,
      description: description.trim() || trimmedName,
      category,
      subcategory: finalSubcategory,
      price: numPrice,
      originalPrice: numOriginalPrice,
      discount: calcDiscount,
      images: [finalThumbnail],
      thumbnail: finalThumbnail,
      stock: finalStock,
      sku: finalSku,
      colors: finalColors,
      fabric: fabric.trim() || 'Handcrafted',
      occasion: occasion.trim() || 'Festive & Occasion',
      weave: weave.trim() || 'Artisanal',
      featured,
      newArrival,
      rating: 4.9,
      reviewCount: 15,
    });
    resetForm();
    setActiveTab('products');
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminUpdateSettings({
      ...settings,
      announcementText,
      freeShippingThreshold: Number(freeShippingThreshold),
      codEnabled,
    });
  };

  const handleSaveStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminUpdateSettings({
      ...settings,
      storySubtitle,
      storyTitle,
      storyQuote,
      storyParagraph1,
      storyParagraph2,
      storyImageUrl,
    });
  };

  const handleSaveHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentSlides = [
      ...(settings.heroSlides && settings.heroSlides.length > 0
        ? settings.heroSlides
        : DEFAULT_HERO_SLIDES),
    ];
    currentSlides[selectedHeroSlideIdx] = {
      id: selectedHeroSlideIdx,
      titleLine1: heroTitleLine1,
      titleLine2: heroTitleLine2,
      subtitleGold: heroSubtitleGold,
      kicker: heroKicker,
      description: heroDescription,
      mediaType: heroMediaType,
      mediaSource: heroMediaSource,
      mediaUrl: heroMediaUrl,
      mediaFileName: heroMediaFileName,
      primaryCtaText: heroPrimaryCtaText,
      primaryCtaLink: heroPrimaryCtaLink,
      secondaryCtaText: heroSecondaryCtaText,
      secondaryCtaLink: heroSecondaryCtaLink,
    };

    await adminUpdateSettings({
      ...settings,
      heroSlides: currentSlides,
      ...(selectedHeroSlideIdx === 0
        ? {
            heroMediaType,
            heroMediaSource,
            heroMediaUrl,
            heroMediaFileName,
            heroTitleLine1,
            heroTitleLine2,
            heroSubtitleGold,
            heroKicker,
            heroDescription,
            heroPrimaryCtaText,
            heroPrimaryCtaLink,
            heroSecondaryCtaText,
            heroSecondaryCtaLink,
          }
        : {}),
    });
  };

  const handleHeroSystemFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const isVid = file.type.startsWith('video');
      const url = await uploadHeroMediaFile(file, selectedHeroSlideIdx);
      setHeroMediaUrl(url);
      setHeroMediaType(isVid ? 'video' : 'image');
      setHeroMediaSource('system');
      setHeroMediaFileName(file.name);
    } catch (err) {
      console.error('File upload error:', err);
    }
  };

  const handleResetHeroMedia = async () => {
    if (window.confirm(`Reset Hero Slide ${selectedHeroSlideIdx + 1} back to signature boutique defaults?`)) {
      await resetHeroMediaToDefault(selectedHeroSlideIdx);
      const defaultSlide = DEFAULT_HERO_SLIDES[selectedHeroSlideIdx] || DEFAULT_HERO_SLIDES[0];
      setHeroMediaType(defaultSlide.mediaType);
      setHeroMediaSource(defaultSlide.mediaSource || 'url');
      setHeroMediaUrl(defaultSlide.mediaUrl);
      setHeroMediaFileName('');
      setHeroTitleLine1(defaultSlide.titleLine1);
      setHeroTitleLine2(defaultSlide.titleLine2);
      setHeroSubtitleGold(defaultSlide.subtitleGold);
      setHeroKicker(defaultSlide.kicker);
      setHeroDescription(defaultSlide.description);
      setHeroPrimaryCtaText(defaultSlide.primaryCtaText);
      setHeroPrimaryCtaLink(defaultSlide.primaryCtaLink);
      setHeroSecondaryCtaText(defaultSlide.secondaryCtaText);
      setHeroSecondaryCtaLink(defaultSlide.secondaryCtaLink);
    }
  };

  return (
    <div className="bg-[#F7F0E6] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-[1360px] mx-auto space-y-8">
        {/* Top Header & Sync Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B99A62]/30 pb-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#5A2630] font-semibold">
              LATHA SAREES & JEWELRY · MANAGEMENT
            </p>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#33221C]">
              Boutique Admin Console
            </h1>
          </div>

          <button
            type="button"
            disabled
            className="px-5 py-2.5 bg-[#B99A62]/40 text-[#33221C]/50 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 cursor-not-allowed select-none opacity-60"
            title="Sync disabled"
          >
            <Database className="w-4 h-4" />
            Sync Signature Catalog to Firestore
          </button>
        </div>

        {/* KPI Statistics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5">
            <span className="text-xs text-[#806B5E]">Total Revenue</span>
            <p className="font-serif-luxury text-3xl font-semibold text-[#33221C] mt-1">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5">
            <span className="text-xs text-[#806B5E]">Total Orders</span>
            <p className="font-serif-luxury text-3xl font-semibold text-[#33221C] mt-1">
              {orders.length}
            </p>
          </div>
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5">
            <span className="text-xs text-[#806B5E]">Catalog Pieces</span>
            <p className="font-serif-luxury text-3xl font-semibold text-[#33221C] mt-1">
              {products.length}
            </p>
          </div>
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5">
            <span className="text-xs text-[#806B5E] flex items-center gap-1">
              Low Stock Pieces (≤ 5)
              {lowStockCount > 0 && (
                <AlertTriangle className="w-3.5 h-3.5 text-[#5A2630]" />
              )}
            </span>
            <p className="font-serif-luxury text-3xl font-semibold text-[#5A2630] mt-1">
              {lowStockCount}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#B99A62]/30 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Manage Sarees & Jewelry ({products.length})
          </button>

          <button
            type="button"
            onClick={() => {
              if (editingId) resetForm();
              setActiveTab('add-product');
            }}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'add-product'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Products
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'hero'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <Film className="w-4 h-4" />
            Edit Hero Section
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <Package className="w-4 h-4" />
            Manage Orders ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'story'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Edit "Our Story" & Brand
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.14em] flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#4A1C24] text-[#F7F0E6]'
                : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30'
            }`}
          >
            <Settings className="w-4 h-4" />
            Store Announcement & Settings
          </button>
        </div>

        {/* TAB 1: ACTIVE CATALOG BROWSER & MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-[#FFFDFC] border border-[#B99A62]/35 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B99A62]/20 pb-5">
                <div>
                  <h2 className="font-serif-luxury text-2xl text-[#33221C] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#B99A62]" />
                    Active Catalog ({products.length})
                  </h2>
                  <p className="text-xs text-[#806B5E] mt-1">
                    Manage live sarees, temple jewelry, stock counts, and store visibility.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('add-product');
                  }}
                  className="px-5 py-2.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.14em] hover:bg-[#5A2630] flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Products
                </button>
              </div>

              {/* Search & Filter Strip */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#806B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search by title, SKU, fabric, craft..."
                    className="w-full pl-9 pr-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C] placeholder:text-[#806B5E]/70"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {(['All', 'Sarees', 'Jewelry'] as const).map((cat) => {
                    const count =
                      cat === 'All'
                        ? products.length
                        : products.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCatalogFilter(cat)}
                        className={`px-3 py-1.5 border text-xs font-medium transition-colors ${
                          catalogFilter === cat
                            ? 'bg-[#4A1C24] text-[#F7F0E6] border-[#4A1C24]'
                            : 'bg-[#F7F0E6] text-[#33221C] border-[#B99A62]/40 hover:bg-[#EFE2D1]'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catalog Items Table / Rows */}
              {filteredCatalog.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#F7F0E6]/50 border border-dashed border-[#B99A62]/30">
                  <p className="text-xs text-[#806B5E]">
                    {catalogSearch || catalogFilter !== 'All'
                      ? 'No items match your search filter.'
                      : 'No products in the catalog yet.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('add-product');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-wider hover:bg-[#5A2630]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Products
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#B99A62]/20 border border-[#B99A62]/20 bg-[#FFFDFC]">
                  {filteredCatalog.map((item) => {
                    const discount =
                      item.originalPrice > item.price
                        ? Math.round(
                            ((item.originalPrice - item.price) / item.originalPrice) * 100
                          )
                        : 0;

                    return (
                      <div
                        key={item.id}
                        className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-[#F7F0E6]/30 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-20 object-cover bg-[#2C1814] border border-[#B99A62]/30 shrink-0"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-serif-luxury text-base font-medium text-[#33221C]">
                                {item.name}
                              </span>
                              {item.newArrival && (
                                <span className="px-1.5 py-0.5 bg-[#4A1C24] text-[#F7F0E6] text-[10px] font-semibold uppercase tracking-wider">
                                  NEW
                                </span>
                              )}
                              {item.featured && (
                                <span className="px-1.5 py-0.5 bg-[#B99A62]/20 text-[#5A2630] border border-[#B99A62]/40 text-[10px] font-semibold tracking-wider">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <p className="text-[#806B5E]">
                              <span className="font-medium text-[#33221C]">
                                {item.category}
                              </span>{' '}
                              · {item.subcategory} · SKU: {item.sku} · {item.fabric}
                            </p>
                            <p className="text-[#33221C]/80 line-clamp-1 text-[11px]">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Price & Stock Section */}
                        <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-[#B99A62]/20">
                          <div className="text-right">
                            <p className="font-serif-luxury text-base font-semibold text-[#33221C] tabular-nums">
                              ₹{item.price.toLocaleString('en-IN')}
                            </p>
                            {item.originalPrice > item.price && (
                              <p className="text-[11px] text-[#806B5E] tabular-nums">
                                <span className="line-through">
                                  ₹{item.originalPrice.toLocaleString('en-IN')}
                                </span>{' '}
                                <span className="text-[#5A2630] font-medium">
                                  ({discount}% OFF)
                                </span>
                              </p>
                            )}
                          </div>

                          <div className="min-w-[90px] text-center">
                            {item.stock > 5 ? (
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-semibold rounded-sm">
                                Stock: {item.stock}
                              </span>
                            ) : item.stock > 0 ? (
                              <span className="px-2 py-1 bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-semibold rounded-sm flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-700" />
                                {item.stock} left
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-rose-50 text-rose-800 border border-rose-300 text-[11px] font-semibold rounded-sm">
                                Sold Out
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditProduct(item)}
                              className="px-3 py-1.5 border border-[#B99A62]/50 text-[#33221C] hover:bg-[#EFE2D1] flex items-center gap-1.5 font-medium transition-colors"
                              title="Edit product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => adminDeleteProduct(item.id)}
                              className="p-1.5 border border-[#B99A62]/40 text-[#5A2630] hover:bg-rose-50 transition-colors"
                              title="Delete product"
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED ADD / EDIT PRODUCTS */}
        {activeTab === 'add-product' && (
          <div className="space-y-6">
            {/* Header Notification if Editing */}
            {editingId && (
              <div className="p-4 bg-[#EFE2D1] border border-[#B99A62]/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#33221C]">
                  <Edit3 className="w-4 h-4 text-[#5A2630]" />
                  <span>
                    Currently editing: <strong>{name}</strong> (SKU: {sku})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('products');
                  }}
                  className="text-xs font-semibold text-[#5A2630] underline hover:text-[#33221C]"
                >
                  Cancel Edit & Return to Catalog
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Product Form */}
              <div className="lg:col-span-7 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#B99A62]/25 pb-3">
                  <div>
                    <h2 className="font-serif-luxury text-2xl text-[#33221C] flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#B99A62]" />
                      {editingId ? 'Edit Product Details' : 'Add Products to Catalog'}
                    </h2>
                    <p className="text-xs text-[#806B5E] mt-0.5">
                      {editingId
                        ? 'Update information, pricing, or imagery for this piece.'
                        : 'Fill out the form below to publish a new piece to the live boutique.'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveProductSubmit} noValidate className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Royal Silk Saree, Gold Haram..."
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value as 'Sarees' | 'Jewelry')
                        }
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                      >
                        <option value="Sarees">Sarees</option>
                        <option value="Jewelry">Jewelry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Subcategory <span className="text-[#806B5E] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        placeholder="e.g. Banarasi, Kanchipuram, Jhumkas..."
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) =>
                          setPrice(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="e.g. 12900"
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 tabular-nums text-[#33221C]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Original MRP (₹) <span className="text-[#806B5E] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={originalPrice}
                        onChange={(e) =>
                          setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="Defaults to price"
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 tabular-nums text-[#33221C]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Stock Qty <span className="text-[#806B5E] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={stock}
                        onChange={(e) =>
                          setStock(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="Defaults to 1"
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 tabular-nums text-[#33221C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Fabric / Material <span className="text-[#806B5E] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={fabric}
                        onChange={(e) => setFabric(e.target.value)}
                        placeholder="e.g. Pure Silk, Gold Plated Brass..."
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Weave / Craft <span className="text-[#806B5E] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={weave}
                        onChange={(e) => setWeave(e.target.value)}
                        placeholder="e.g. Handloom Zari, Temple Nakshi..."
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        SKU Code <span className="text-[#806B5E] font-normal">(Optional - auto-generated)</span>
                      </label>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="Leave blank to auto-generate"
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Colors <span className="text-[#806B5E] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={colorsInput}
                        onChange={(e) => setColorsInput(e.target.value)}
                        placeholder="e.g. Red, Maroon, Gold"
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Product Image <span className="text-[#806B5E] font-normal">(Optional)</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        <label className="px-3 py-2 bg-[#4A1C24] text-[#F7F0E6] text-xs cursor-pointer hover:bg-[#5A2630] flex items-center gap-1.5 shrink-0 transition-colors">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProductImageUpload}
                            className="hidden"
                          />
                        </label>
                        <select
                          value={thumbnail}
                          onChange={(e) => setThumbnail(e.target.value)}
                          className="flex-1 min-w-[180px] px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-xs text-[#33221C]"
                        >
                          <option value="">-- Or Choose Preset Image (Optional) --</option>
                          {PRESET_IMAGES.map((img) => (
                            <option key={img.label} value={img.url}>
                              {img.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        placeholder="Or paste an image web link (https://...)"
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#33221C] mb-1">
                      Description <span className="text-[#806B5E] font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional notes or description about this piece..."
                      className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#33221C]"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="accent-[#4A1C24]"
                      />
                      <span>Featured on Home Page</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newArrival}
                        onChange={(e) => setNewArrival(e.target.checked)}
                        className="accent-[#4A1C24]"
                      />
                      <span>"NEW" Badge</span>
                    </label>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em] hover:bg-[#5A2630] transition-colors"
                    >
                      {editingId ? 'UPDATE PRODUCT & SAVE' : 'PUBLISH PRODUCT TO CATALOG'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setActiveTab('products');
                        }}
                        className="px-5 py-3.5 border border-[#B99A62]/40 text-[#33221C] text-xs font-semibold tracking-wider hover:bg-[#EFE2D1]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right: Live Boutique Card Preview */}
              <div className="lg:col-span-5 sticky top-6 space-y-4">
                <div className="bg-[#FFFDFC] border border-[#B99A62]/35 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#B99A62]/20 pb-3">
                    <h3 className="font-serif-luxury text-base font-medium text-[#33221C] flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#B99A62]" />
                      Storefront Card Preview
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#806B5E]">
                      Live
                    </span>
                  </div>

                  <div className="bg-[#FFFDFC] border border-[#B99A62]/25 overflow-hidden shadow-sm max-w-sm mx-auto">
                    <div className="relative aspect-[3/4] bg-[#2C1814] overflow-hidden">
                      <img
                        src={thumbnail || (category === 'Sarees' ? BRAND_IMAGES.sareeBanarasiCrimson : BRAND_IMAGES.jewelryTempleJhumka)}
                        alt={name || 'Preview'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                        {newArrival && (
                          <span className="bg-[#4A1C24] text-[#F7F0E6] text-[10px] font-semibold tracking-widest px-2 py-0.5">
                            NEW
                          </span>
                        )}
                        {Number(originalPrice) > Number(price) && Number(originalPrice) > 0 && (
                          <span className="bg-[#B99A62] text-[#1E110E] text-[10px] font-semibold tracking-wider px-2 py-0.5">
                            {Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[#806B5E] text-[11px]">
                        <span>{category} {subcategory ? `· ${subcategory}` : ''}</span>
                        <span>{fabric || 'Handcrafted'}</span>
                      </div>

                      <h4 className="font-serif-luxury text-lg text-[#33221C] line-clamp-1">
                        {name || 'Untitled Piece'}
                      </h4>

                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-semibold text-[#33221C] tabular-nums">
                          ₹{Number(price || 0).toLocaleString('en-IN')}
                        </span>
                        {Number(originalPrice) > Number(price) && Number(originalPrice) > 0 && (
                          <span className="text-xs text-[#806B5E] line-through tabular-nums">
                            ₹{Number(originalPrice || 0).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#B99A62]/20 flex items-center justify-between text-[11px]">
                        <span className="text-[#806B5E]">SKU: {sku || 'Auto-generated'}</span>
                        <span className={Number(stock || 1) > 0 ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
                          {Number(stock || 1) > 0 ? `Stock: ${stock || 1}` : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#806B5E] text-center italic">
                    This preview shows how customers will see your piece in the boutique catalog.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEDICATED CINEMATIC HERO CUSTOMIZER */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form & Controls */}
              <div className="lg:col-span-7 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#B99A62]/20 pb-4">
                  <div>
                    <h2 className="font-serif-luxury text-2xl text-[#33221C] flex items-center gap-2">
                      <Film className="w-5 h-5 text-[#B99A62]" />
                      Hero Section Customizer
                    </h2>
                    <p className="text-xs text-[#806B5E] mt-1">
                      Customize the boutique entrance banner with high-definition photography or cinematic video.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetHeroMedia}
                    className="inline-flex items-center gap-1.5 text-xs text-[#5A2630] font-medium hover:underline shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default
                  </button>
                </div>

                {/* Multi-Slide Switcher Tabs */}
                <div className="p-4 bg-[#F7F0E6] border border-[#B99A62]/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#33221C] uppercase tracking-wider text-[11px]">
                        Select Hero Slide to Customize:
                      </p>
                      <p className="text-[11px] text-[#806B5E]">
                        Switch between slides to customize media, texts, and buttons for each slide.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#4A1C24] text-[#F7F0E6] rounded-xs uppercase tracking-wider self-start sm:self-auto">
                      Editing Slide {selectedHeroSlideIdx + 1} of 3
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {[
                      { idx: 0, title: 'Slide 1: Main Feature', theme: 'General / Timeless Elegance' },
                      { idx: 1, title: 'Slide 2: Sarees Edit', theme: 'Heirloom Silk Drapes' },
                      { idx: 2, title: 'Slide 3: Jewelry Edit', theme: 'Sacred Temple Jewelry' },
                    ].map((tab) => (
                      <button
                        key={tab.idx}
                        type="button"
                        onClick={() => setSelectedHeroSlideIdx(tab.idx)}
                        className={`p-3 text-left border transition-all cursor-pointer ${
                          selectedHeroSlideIdx === tab.idx
                            ? 'bg-[#4A1C24] text-[#F7F0E6] border-[#4A1C24] shadow-sm ring-1 ring-[#B99A62]'
                            : 'bg-[#FFFDFC] text-[#33221C] border-[#B99A62]/35 hover:bg-[#EFE2D1]'
                        }`}
                      >
                        <div className="font-semibold text-xs flex items-center justify-between">
                          <span>{tab.title}</span>
                          {selectedHeroSlideIdx === tab.idx && (
                            <span className="text-[9px] bg-[#B99A62] text-[#1E110E] px-1.5 py-0.2 rounded-xs font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-[10px] mt-1 truncate ${
                            selectedHeroSlideIdx === tab.idx ? 'text-[#F7F0E6]/80' : 'text-[#806B5E]'
                          }`}
                        >
                          {tab.theme}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSaveHeroSubmit} noValidate className="space-y-6 text-xs">
                  {/* Media Format & Source Selection */}
                  <div className="p-4 bg-[#F7F0E6] border border-[#B99A62]/30 space-y-4">
                    <p className="font-semibold text-[#33221C] uppercase tracking-wider text-[11px]">
                      1. Hero Media Format & Source
                    </p>

                    {/* Media Type Toggle: Image vs Video */}
                    <div>
                      <label className="block text-[#806B5E] mb-1.5 font-medium">
                        Media Format:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setHeroMediaType('image');
                            if (!heroMediaUrl || isPinterestUrl(heroMediaUrl)) {
                              setHeroMediaUrl(BRAND_IMAGES.heroBridal);
                            }
                          }}
                          className={`py-2.5 px-2 border flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider transition-colors ${
                            heroMediaType === 'image'
                              ? 'bg-[#4A1C24] text-[#F7F0E6] border-[#4A1C24]'
                              : 'bg-[#FFFDFC] text-[#33221C] border-[#B99A62]/40 hover:bg-[#EFE2D1]'
                          }`}
                        >
                          <ImageIcon className="w-4 h-4 shrink-0" />
                          <span>Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHeroMediaType('video');
                            if (!heroMediaUrl || isPinterestUrl(heroMediaUrl)) {
                              setHeroMediaUrl(PRESET_HERO_VIDEOS[0].url);
                            }
                          }}
                          className={`py-2.5 px-2 border flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider transition-colors ${
                            heroMediaType === 'video'
                              ? 'bg-[#4A1C24] text-[#F7F0E6] border-[#4A1C24]'
                              : 'bg-[#FFFDFC] text-[#33221C] border-[#B99A62]/40 hover:bg-[#EFE2D1]'
                          }`}
                        >
                          <Video className="w-4 h-4 shrink-0" />
                          <span>Video</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHeroMediaType('pinterest');
                            if (!heroMediaUrl || !isPinterestUrl(heroMediaUrl)) {
                              setHeroMediaUrl('https://in.pinterest.com/pin/31384528648409924/');
                            }
                          }}
                          className={`py-2.5 px-2 border flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider transition-colors ${
                            heroMediaType === 'pinterest'
                              ? 'bg-[#E60023] text-white border-[#E60023]'
                              : 'bg-[#FFFDFC] text-[#33221C] border-[#B99A62]/40 hover:bg-[#EFE2D1]'
                          }`}
                        >
                          <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                          <span>Pinterest Pin</span>
                        </button>
                      </div>
                    </div>

                    {/* Media Source Toggle: URL Link vs System File */}
                    <div>
                      <label className="block text-[#806B5E] mb-1.5 font-medium">
                        Source Selection:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setHeroMediaSource('url')}
                          className={`py-2 px-3 border text-center text-xs font-medium transition-colors ${
                            heroMediaSource === 'url'
                              ? 'bg-[#B99A62] text-[#1E110E] border-[#B99A62]'
                              : 'bg-[#FFFDFC] text-[#33221C] border-[#B99A62]/40'
                          }`}
                        >
                          Web URL / Link Preset
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroMediaSource('system')}
                          className={`py-2 px-3 border text-center text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                            heroMediaSource === 'system'
                              ? 'bg-[#B99A62] text-[#1E110E] border-[#B99A62]'
                              : 'bg-[#FFFDFC] text-[#33221C] border-[#B99A62]/40'
                          }`}
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          Upload from System Files
                        </button>
                      </div>
                    </div>

                    {/* When Source is URL */}
                    {heroMediaSource === 'url' && (
                      <div className="space-y-3 pt-2 border-t border-[#B99A62]/20">
                        {heroMediaType === 'pinterest' ? (
                          <>
                            <div>
                              <label className="block font-medium text-[#33221C] mb-1">
                                Pinterest Presets
                              </label>
                              <select
                                value={heroMediaUrl}
                                onChange={(e) => setHeroMediaUrl(e.target.value)}
                                className="w-full px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/40"
                              >
                                {PRESET_PINTEREST_PINS.map((pin) => (
                                  <option key={pin.label} value={pin.url}>
                                    Preset: {pin.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium text-[#33221C] mb-1">
                                Enter Any Pinterest Pin Link (URL)
                              </label>
                              <input
                                type="text"
                                value={heroMediaUrl}
                                onChange={(e) => setHeroMediaUrl(e.target.value)}
                                placeholder="https://in.pinterest.com/pin/31384528648409924/ or Pin link"
                                className="w-full px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/40"
                              />
                            </div>
                          </>
                        ) : heroMediaType === 'image' ? (
                          <>
                            <div>
                              <label className="block font-medium text-[#33221C] mb-1">
                                Studio Image Presets
                              </label>
                              <select
                                value={heroMediaUrl}
                                onChange={(e) => setHeroMediaUrl(e.target.value)}
                                className="w-full px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/40"
                              >
                                {PRESET_HERO_IMAGES.map((img) => (
                                  <option key={img.label} value={img.url}>
                                    Preset: {img.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium text-[#33221C] mb-1">
                                Or Enter Custom Image URL Link (or Pinterest Pin)
                              </label>
                              <input
                                type="text"
                                value={heroMediaUrl}
                                onChange={(e) => setHeroMediaUrl(e.target.value)}
                                placeholder="Image URL, path (e.g. /assets/...), or Pinterest Pin"
                                className="w-full px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/40"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block font-medium text-[#33221C] mb-1">
                                Cinematic Video Presets
                              </label>
                              <select
                                value={heroMediaUrl}
                                onChange={(e) => setHeroMediaUrl(e.target.value)}
                                className="w-full px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/40"
                              >
                                {PRESET_HERO_VIDEOS.map((vid) => (
                                  <option key={vid.label} value={vid.url}>
                                    Preset: {vid.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium text-[#33221C] mb-1">
                                Or Enter Custom Video Link (MP4, YouTube, or Pinterest Pin URL)
                              </label>
                              <input
                                type="text"
                                value={heroMediaUrl}
                                onChange={(e) => setHeroMediaUrl(e.target.value)}
                                placeholder="Video URL, MP4 path (e.g. /assets/sareesvideo.mp4), YouTube, or Pinterest Pin"
                                className="w-full px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/40"
                              />
                            </div>
                          </>
                        )}

                        {/* Automatic Pinterest Detection Feedback Banner */}
                        {(() => {
                          const detectedPinId = extractPinterestPinId(heroMediaUrl);
                          if (detectedPinId) {
                            return (
                              <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-sm text-xs flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <CheckCircle2 className="w-4 h-4 text-[#E60023]" />
                                  Pinterest Pin detected (ID: <strong>{detectedPinId}</strong>)
                                </span>
                                <span className="text-[10px] bg-[#E60023] text-white px-2 py-0.5 rounded-full font-bold">
                                  Auto-Embedded
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    {/* When Source is System Files */}
                    {heroMediaSource === 'system' && (
                      <div className="space-y-3 pt-2 border-t border-[#B99A62]/20">
                        <label className="block font-medium text-[#33221C] mb-1">
                          Select Video or Image from System Files
                        </label>
                        <div className="border-2 border-dashed border-[#B99A62]/50 p-6 bg-[#FFFDFC] text-center hover:bg-[#F7F0E6]/50 transition-colors cursor-pointer relative">
                          <input
                            type="file"
                            accept="video/*,image/*"
                            onChange={handleHeroSystemFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <UploadCloud className="w-8 h-8 text-[#B99A62] mx-auto mb-2" />
                          <p className="font-semibold text-[#33221C]">
                            Click or drag a file to upload from your computer
                          </p>
                          <p className="text-[#806B5E] text-[11px] mt-1">
                            Videos (MP4, WebM, MOV) or Images (JPG, PNG, WebP)
                          </p>
                        </div>

                        {heroMediaFileName && (
                          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-sm flex items-center justify-between text-xs">
                            <span className="font-medium truncate">
                              ✓ System file loaded: <strong>{heroMediaFileName}</strong>
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-200">
                              {heroMediaType}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Editorial Headlines & Copy */}
                  <div className="space-y-4">
                    <p className="font-semibold text-[#33221C] uppercase tracking-wider text-[11px]">
                      2. Editorial Headlines & Copywriting
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-[#33221C] mb-1">
                          Headline Line 1 *
                        </label>
                        <input
                          type="text"
                          value={heroTitleLine1}
                          onChange={(e) => setHeroTitleLine1(e.target.value)}
                          placeholder="e.g. HEIRLOOM SILK"
                          className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#33221C] mb-1">
                          Headline Line 2 *
                        </label>
                        <input
                          type="text"
                          value={heroTitleLine2}
                          onChange={(e) => setHeroTitleLine2(e.target.value)}
                          placeholder="e.g. ELEGANCE,"
                          className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Gold Accent Subtitle Line *
                      </label>
                      <input
                        type="text"
                        value={heroSubtitleGold}
                        onChange={(e) => setHeroSubtitleGold(e.target.value)}
                        placeholder="e.g. PRECIOUS & WOVEN FOR YOU."
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-[#5A2630] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Category / Craft Kicker Line *
                      </label>
                      <input
                        type="text"
                        value={heroKicker}
                        onChange={(e) => setHeroKicker(e.target.value)}
                        placeholder="SAREES · TEMPLE JEWELRY · JHUMKAS · NECKLACES"
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#33221C] mb-1">
                        Editorial Story Description *
                      </label>
                      <textarea
                        rows={3}
                        value={heroDescription}
                        onChange={(e) => setHeroDescription(e.target.value)}
                        placeholder="Discover handwoven Banarasi and Kanchipuram silks..."
                        className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                      />
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-4">
                    <p className="font-semibold text-[#33221C] uppercase tracking-wider text-[11px]">
                      3. Call to Action Buttons
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-[#33221C] mb-1">
                          Primary Button Text
                        </label>
                        <input
                          type="text"
                          value={heroPrimaryCtaText}
                          onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
                          placeholder="DISCOVER THE COLLECTION"
                          className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#33221C] mb-1">
                          Primary Button Link
                        </label>
                        <input
                          type="text"
                          value={heroPrimaryCtaLink}
                          onChange={(e) => setHeroPrimaryCtaLink(e.target.value)}
                          placeholder="/shop"
                          className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-[#33221C] mb-1">
                          Secondary Button Text
                        </label>
                        <input
                          type="text"
                          value={heroSecondaryCtaText}
                          onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                          placeholder="EXPLORE JEWELRY"
                          className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#33221C] mb-1">
                          Secondary Button Link
                        </label>
                        <input
                          type="text"
                          value={heroSecondaryCtaLink}
                          onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
                          placeholder="/jewelry"
                          className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em] hover:bg-[#5A2630] transition-colors shadow-md"
                    >
                      SAVE SLIDE {selectedHeroSlideIdx + 1} SETTINGS
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Storefront Hero Preview */}
              <div className="lg:col-span-5 sticky top-6 space-y-4">
                <div className="bg-[#FFFDFC] border border-[#B99A62]/35 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#B99A62]/20 pb-3">
                    <h3 className="font-serif-luxury text-base font-medium text-[#33221C] flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#B99A62]" />
                      Slide {selectedHeroSlideIdx + 1} Live Preview
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      {extractPinterestPinId(heroMediaUrl)
                        ? 'Pinterest Pin Live'
                        : heroMediaType === 'video'
                        ? 'Video Playing'
                        : 'Live Image'}
                    </span>
                  </div>

                  {/* Mockup Frame */}
                  <div className="border border-[#B99A62]/40 bg-[#EFE2D1] overflow-hidden shadow-sm relative min-h-[360px] flex flex-col justify-between">
                    {/* Background Media */}
                    <div className="absolute inset-0 bg-[#2C1814] overflow-hidden">
                      {(() => {
                        const previewMedia = parseHeroMedia(heroMediaUrl, heroMediaType);

                        if (previewMedia.type === 'pinterest' && previewMedia.pinId) {
                          return (
                            <div className="w-full h-full flex items-center justify-end pr-2 py-2">
                              <iframe
                                src={`https://assets.pinterest.com/ext/embed.html?id=${previewMedia.pinId}`}
                                title="Pinterest Live Preview"
                                className="w-[200px] h-[340px] border-0 rounded-md shadow-lg bg-white"
                                scrolling="no"
                              />
                            </div>
                          );
                        }

                        if (previewMedia.type === 'youtube' && previewMedia.embedUrl) {
                          return (
                            <iframe
                              src={previewMedia.embedUrl}
                              title="YouTube Preview"
                              className="w-full h-full border-0 object-cover"
                            />
                          );
                        }

                        if (previewMedia.type === 'video') {
                          return (
                            <video
                              key={heroMediaUrl}
                              src={heroMediaUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover object-right"
                            />
                          );
                        }

                        return (
                          <img
                            src={heroMediaUrl}
                            alt="Hero Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-right"
                          />
                        );
                      })()}
                      {/* Ivory Gradient Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F7F0E6] via-[#F7F0E6]/90 to-transparent w-[65%] pointer-events-none" />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 p-5 max-w-[70%] space-y-3">
                      <p className="text-[9px] tracking-[0.2em] text-[#5A2630] font-semibold">
                        LATHA SAREES & JEWELRY
                      </p>

                      <div className="font-serif-luxury text-xl sm:text-2xl leading-tight text-[#33221C]">
                        <div>{heroTitleLine1 || 'HEIRLOOM SILK'}</div>
                        <div>{heroTitleLine2 || 'DRAPES,'}</div>
                        <div className="text-[#B99A62] text-sm sm:text-base font-medium mt-0.5">
                          {heroSubtitleGold || 'HANDWOVEN IN KANCHIPURAM & KASHI.'}
                        </div>
                      </div>

                      <p className="text-[9px] tracking-wider text-[#33221C] font-medium line-clamp-1">
                        {heroKicker}
                      </p>

                      <p className="text-[11px] text-[#806B5E] leading-relaxed line-clamp-2">
                        {heroDescription}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-[#4A1C24] text-[#F7F0E6] text-[9px] font-semibold tracking-wider">
                          {heroPrimaryCtaText || 'DISCOVER'}
                        </span>
                        <span className="px-3 py-1.5 border border-[#4A1C24] text-[#4A1C24] text-[9px] font-semibold tracking-wider bg-white/40">
                          {heroSecondaryCtaText || 'EXPLORE'}
                        </span>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="relative z-10 p-2.5 bg-[#FFFDFC]/90 border-t border-[#B99A62]/20 flex items-center justify-between text-[10px] text-[#806B5E]">
                      <span>Source: {heroMediaSource === 'system' ? 'System File' : 'URL Link'}</span>
                      <span>Format: {heroMediaType.toUpperCase()}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#806B5E] text-center italic">
                    Customers visiting the homepage will see this exact cinematic banner presentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFFDFC] border border-[#B99A62]/35 p-6 space-y-4">
            <h2 className="font-serif-luxury text-2xl text-[#33221C]">
              Customer Orders ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <p className="text-xs text-[#806B5E] py-8 text-center">
                No customer orders recorded in Firestore yet.
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-[#F7F0E6] border border-[#B99A62]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-[#33221C] tabular-nums">
                        {ord.orderNumber} · {ord.customerName} ({ord.customerPhone})
                      </p>
                      <p className="text-[#806B5E]">
                        {ord.shippingAddress}, {ord.city}, {ord.state} - {ord.pincode}
                      </p>
                      <p className="text-[#33221C] font-medium">{ord.itemSummary}</p>
                      <p className="text-[#5A2630] font-semibold tabular-nums">
                        Total: ₹{ord.totalAmount.toLocaleString('en-IN')} ·{' '}
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          adminUpdateOrderStatus(
                            ord.id,
                            e.target.value as OrderRecord['status'],
                            ord.paymentStatus
                          )
                        }
                        className="px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/50 text-xs font-medium"
                      >
                        {[
                          'Pending',
                          'Confirmed',
                          'Processing',
                          'Shipped',
                          'Out for Delivery',
                          'Delivered',
                          'Cancelled',
                          'Returned',
                        ].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OUR STORY & BRAND HERITAGE */}
        {activeTab === 'story' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-6 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-serif-luxury text-2xl text-[#33221C] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#B99A62]" />
                  Edit "Our Story" & Brand Narrative
                </h2>
                <p className="text-xs text-[#806B5E] mt-1">
                  Updates reflect instantly on the public <strong className="text-[#33221C]">Our Story (/about)</strong> page.
                </p>
              </div>

              <form onSubmit={handleSaveStorySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Tagline / Eyebrow Subtitle
                  </label>
                  <input
                    type="text"
                    required
                    value={storySubtitle}
                    onChange={(e) => setStorySubtitle(e.target.value)}
                    placeholder="OUR HERITAGE & PHILOSOPHY"
                    className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="Crafted With Tradition. Curated For Today."
                    className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Heritage Philosophy Quote / Callout
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={storyQuote}
                    onChange={(e) => setStoryQuote(e.target.value)}
                    placeholder="Celebrating the timeless poetry of Indian handlooms and sacred temple jewelry."
                    className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 resize-y"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Story Paragraph 1 (Founding Story & Vision)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={storyParagraph1}
                    onChange={(e) => setStoryParagraph1(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 resize-y leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Story Paragraph 2 (Artisan Weaves & Temple Jewelry)
                  </label>
                  <textarea
                    rows={4}
                    value={storyParagraph2}
                    onChange={(e) => setStoryParagraph2(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 resize-y leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    Featured Heritage Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={storyImageUrl}
                    onChange={(e) => setStoryImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] text-[#806B5E] self-center">Presets:</span>
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => setStoryImageUrl(img.url)}
                        className="text-[10px] px-2 py-1 bg-[#EFE2D1] text-[#33221C] border border-[#B99A62]/30 hover:bg-[#B99A62]/20"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em] hover:bg-[#5A2630] transition-colors"
                >
                  SAVE & PUBLISH OUR STORY
                </button>
              </form>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-6 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8 space-y-6 h-fit">
              <div className="flex items-center justify-between border-b border-[#B99A62]/25 pb-3">
                <span className="text-xs font-semibold tracking-wider text-[#5A2630] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> LIVE PREVIEW (As seen by customers)
                </span>
                <a
                  href="/about"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#B99A62] hover:underline"
                >
                  Open /about in new tab ↗
                </a>
              </div>

              <div className="border border-[#B99A62]/30 p-6 bg-[#F7F0E6] space-y-6">
                <div className="text-center space-y-1">
                  <p className="text-[10px] tracking-[0.2em] text-[#5A2630] font-semibold uppercase">
                    {storySubtitle || 'OUR HERITAGE & PHILOSOPHY'}
                  </p>
                  <h3 className="font-serif-luxury text-2xl text-[#33221C]">
                    {storyTitle || 'Crafted With Tradition. Curated For Today.'}
                  </h3>
                </div>

                <div className="space-y-4">
                  <img
                    src={storyImageUrl}
                    alt="Heritage Preview"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[16/10] object-cover border border-[#B99A62]/40 p-1 bg-[#FFFDFC]"
                  />

                  <p className="text-[#33221C] font-serif-luxury text-base">
                    "{storyQuote}"
                  </p>

                  <p className="text-xs text-[#806B5E] leading-relaxed whitespace-pre-line">
                    {storyParagraph1}
                  </p>

                  {storyParagraph2 && (
                    <p className="text-xs text-[#806B5E] leading-relaxed whitespace-pre-line">
                      {storyParagraph2}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STORE ANNOUNCEMENT & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8">
            <h2 className="font-serif-luxury text-2xl text-[#33221C] mb-5">
              Top Announcement Bar & Checkout Settings
            </h2>
            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Top Announcement Bar Text
                </label>
                <input
                  type="text"
                  required
                  minLength={5}
                  maxLength={200}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40"
                />
              </div>

              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Complimentary Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 tabular-nums"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={(e) => setCodEnabled(e.target.checked)}
                  className="accent-[#4A1C24]"
                />
                <span className="font-medium text-[#33221C]">
                  Enable Cash on Delivery (COD) at Checkout
                </span>
              </label>

              <button
                type="submit"
                className="px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em]"
              >
                SAVE STORE SETTINGS
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
