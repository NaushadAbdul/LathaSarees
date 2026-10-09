import React, { useState, useMemo } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Heart,
  ShoppingBag,
  Star,
  Check,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Maximize2,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CURATED_COLLECTIONS, BRAND_IMAGES } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { LotusOrnament } from '../components/Navbar';

export const CatalogPage: React.FC<{
  fixedCategory?: 'Sarees' | 'Jewelry';
}> = ({ fixedCategory }) => {
  const { products } = useStore();
  const { slug: collectionSlug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const initialSub = searchParams.get('sub') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Sarees' | 'Jewelry'>(
    fixedCategory || 'All'
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSub);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [onlyNew, setOnlyNew] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>(
    'featured'
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync when route changes between /sarees, /jewelry, /shop
  React.useEffect(() => {
    setSelectedCategory(fixedCategory || 'All');
    const subParam = searchParams.get('sub');
    setSelectedSubcategory(subParam || 'All');
  }, [fixedCategory, searchParams]);

  const activeCollection = useMemo(() => {
    if (!collectionSlug) return null;
    return CURATED_COLLECTIONS.find((c) => c.slug === collectionSlug) || null;
  }, [collectionSlug]);

  const subcategories = useMemo(() => {
    const relevant = products.filter(
      (p) => selectedCategory === 'All' || p.category === selectedCategory
    );
    return ['All', ...Array.from(new Set(relevant.map((p) => p.subcategory)))];
  }, [products, selectedCategory]);

  const occasions = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map((p) => p.occasion)))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory)
          return false;
        if (selectedOccasion !== 'All' && p.occasion !== selectedOccasion) return false;
        if (p.price > maxPrice) return false;
        if (onlyNew && !p.newArrival) return false;
        if (collectionSlug) {
          if (collectionSlug === 'temple-jewelry') {
            return p.category === 'Jewelry';
          }
          if (p.collectionSlug && p.collectionSlug !== collectionSlug) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return Number(b.featured) - Number(a.featured);
      });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    selectedOccasion,
    maxPrice,
    onlyNew,
    collectionSlug,
    sortBy,
  ]);

  const pageTitle = activeCollection
    ? activeCollection.title
    : fixedCategory === 'Sarees'
    ? 'Handwoven Sarees'
    : fixedCategory === 'Jewelry'
    ? 'Temple & Fine Jewelry'
    : 'The Complete Latha Boutique';

  const pageSubtitle = activeCollection
    ? activeCollection.description
    : fixedCategory === 'Sarees'
    ? 'Pure mulberry Banarasi, Korvai Kanchipuram, and silk-organza drapes crafted for timeless celebrations.'
    : fixedCategory === 'Jewelry'
    ? 'Sacred Lakshmi temple harams, Kemp ruby jhumkas, and Nizam filigree kadas sculpted in antique gold.'
    : 'Explore our complete archive of heirloom Indian sarees and statement jewelry.';

  const resetFilters = () => {
    setSelectedCategory(fixedCategory || 'All');
    setSelectedSubcategory('All');
    setSelectedOccasion('All');
    setMaxPrice(25000);
    setOnlyNew(false);
    setSortBy('featured');
  };

  return (
    <div className="bg-[#F7F0E6] min-h-screen pb-20">
      {/* Editorial Category Header Banner */}
      <div
        className={`relative overflow-hidden border-b border-[#B99A62]/30 py-12 sm:py-18 px-4 sm:px-8 text-center transition-colors ${
          fixedCategory === 'Sarees'
            ? 'bg-[#2C1814] text-[#F7F0E6]'
            : 'bg-[#EFE2D1] text-[#33221C]'
        }`}
      >
        {fixedCategory === 'Sarees' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <video
              src={BRAND_IMAGES.sareesVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2C1814]/75 via-[#2C1814]/60 to-[#2C1814]/80" />
          </div>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex justify-center text-[#B99A62] mb-2">
            <LotusOrnament className="w-9 h-5" />
          </div>
          <p className="text-xs tracking-[0.22em] text-[#B99A62] font-semibold">
            LATHA SAREES & JEWELRY · HEIRLOOM ARCHIVE
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl mt-2 text-balance">
            {pageTitle}
          </h1>
          <p
            className={`text-xs sm:text-sm mt-3 leading-relaxed ${
              fixedCategory === 'Sarees' ? 'text-[#F7F0E6]/85' : 'text-[#806B5E]'
            }`}
          >
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Interactive Filter & Sort Control Bar */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#B99A62]/25">
          {/* Segmented Subcategory Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {!fixedCategory && (
              <>
                {(['All', 'Sarees', 'Jewelry'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubcategory('All');
                    }}
                    className={`px-4 py-2 text-xs font-medium tracking-[0.12em] transition-colors whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#4A1C24] text-[#F7F0E6]'
                        : 'bg-[#FFFDFC] text-[#33221C] border border-[#B99A62]/30 hover:border-[#4A1C24]'
                    }`}
                  >
                    {cat === 'All' ? 'All Categories' : cat}
                  </button>
                ))}
                <span className="text-[#B99A62] px-1">·</span>
              </>
            )}

            {subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedSubcategory === sub
                    ? 'bg-[#5A2630] text-[#F7F0E6]'
                    : 'bg-[#EFE2D1]/70 text-[#33221C] hover:bg-[#EFE2D1]'
                }`}
              >
                {sub === 'All' ? 'All Styles' : sub}
              </button>
            ))}
          </div>

          {/* Right Filter Button & Sort Dropdown */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="px-4 py-2 bg-[#FFFDFC] border border-[#B99A62]/40 text-xs font-medium text-[#33221C] flex items-center gap-2 hover:border-[#4A1C24] whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#5A2630]" />
              Refine ({filteredProducts.length})
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort products"
              className="px-3.5 py-2 bg-[#FFFDFC] border border-[#B99A62]/40 text-xs font-medium text-[#33221C] focus:outline-none focus:border-[#4A1C24]"
            >
              <option value="featured">Sort: Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {mobileFiltersOpen && (
          <div className="my-6 p-6 bg-[#FFFDFC] border border-[#B99A62]/35 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block font-semibold text-[#33221C] mb-2">
                Occasion
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setSelectedOccasion(occ)}
                    className={`px-3 py-1.5 border ${
                      selectedOccasion === occ
                        ? 'bg-[#4A1C24] text-[#F7F0E6] border-[#4A1C24]'
                        : 'border-[#B99A62]/30 text-[#33221C]'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#33221C] mb-2 tabular-nums">
                Maximum Price: ₹{maxPrice.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min={2500}
                max={25000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#4A1C24]"
              />
              <div className="flex justify-between text-[11px] text-[#806B5E] mt-1 tabular-nums">
                <span>₹2,500</span>
                <span>₹25,000</span>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyNew}
                  onChange={(e) => setOnlyNew(e.target.checked)}
                  className="accent-[#4A1C24]"
                />
                <span className="font-medium text-[#33221C]">
                  Show Only New Arrivals
                </span>
              </label>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 border border-[#4A1C24] text-[#4A1C24] hover:bg-[#EFE2D1] transition-colors"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="px-4 py-2 bg-[#4A1C24] text-[#F7F0E6]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <h2 className="font-serif-luxury text-3xl text-[#33221C]">
              No matching pieces in this filter selection.
            </h2>
            <p className="text-xs text-[#806B5E]">
              Reset your filters to view our full collection of handwoven sarees and jewelry.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs tracking-[0.14em] font-medium"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlistIds, showToast } = useStore();

  const product = useMemo(
    () => products.find((p) => p.slug === slug),
    [products, slug]
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<'desc' | 'details' | 'shipping' | null>(
    'desc'
  );
  const [fullscreenZoom, setFullscreenZoom] = useState(false);

  React.useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedColor(product.colors[0] || 'Default');
      setQuantity(1);
      setPincodeStatus(null);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="font-serif-luxury text-4xl text-[#33221C]">Piece Not Found</h1>
        <p className="text-xs text-[#806B5E] mt-2">
          The saree or jewelry piece you are looking for may have been archived.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs tracking-[0.16em]"
        >
          Return to Boutique
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setPincodeStatus(
      `Complimentary insured delivery available to PIN ${pincode}. Estimated arrival in 3–5 business days.`
    );
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor || product.colors[0], false);
    navigate('/checkout');
  };

  return (
    <div className="bg-[#F7F0E6] py-10 sm:py-14 px-4 sm:px-8">
      <div className="max-w-[1360px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#806B5E] mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-[#33221C]">
            Home
          </Link>
          <span>/</span>
          <Link
            to={product.category === 'Sarees' ? '/sarees' : '/jewelry'}
            className="hover:text-[#33221C]"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#33221C] truncate">{product.name}</span>
        </nav>

        {/* Contiguous Purchase Module Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Sticky Image Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-4">
            <div className="relative aspect-[3/4] bg-[#2C1814] border border-[#B99A62]/35 overflow-hidden">
              <img
                src={product.images[activeImageIdx] || product.thumbnail}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFullscreenZoom(true)}
                className="absolute bottom-4 right-4 p-2.5 bg-[#FFFDFC]/90 text-[#33221C] hover:bg-[#4A1C24] hover:text-[#F7F0E6] transition-colors"
                aria-label="Open fullscreen image zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-26 border overflow-hidden transition-all ${
                    activeImageIdx === idx
                      ? 'border-[#4A1C24] ring-1 ring-[#4A1C24]'
                      : 'border-[#B99A62]/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Purchase & Specification Module */}
          <div className="lg:col-span-6 bg-[#FFFDFC] border border-[#B99A62]/30 p-6 sm:p-10 space-y-6">
            <div>
              <div className="text-xs text-[#806B5E] flex items-center gap-2">
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.subcategory}</span>
                <span>·</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#33221C] mt-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-2.5 flex items-center gap-2 text-xs">
                <div className="flex items-center text-[#B99A62]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#B99A62]" />
                  ))}
                </div>
                <span className="font-medium text-[#33221C] tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[#806B5E] tabular-nums">
                  ({product.reviewCount} Verified Patron Reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3 tabular-nums pb-5 border-b border-[#B99A62]/25">
                <span className="text-2xl sm:text-3xl font-semibold text-[#33221C]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#806B5E] line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold text-[#5A2630]">
                      Save {product.discount}%
                    </span>
                  </>
                )}
                <span className="ml-auto text-[11px] text-[#5A2630] font-medium">
                  {product.stock <= 5
                    ? `Only ${product.stock} left in archive`
                    : 'In Stock & Ready to Ship'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#806B5E] leading-relaxed">
              {product.description}
            </p>

            {/* Color / Variant Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#33221C] mb-2">
                Color / Finish: <span className="font-normal text-[#806B5E]">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs border transition-colors ${
                      selectedColor === color
                        ? 'bg-[#4A1C24] text-[#F7F0E6] border-[#4A1C24]'
                        : 'bg-[#F7F0E6] text-[#33221C] border-[#B99A62]/40 hover:border-[#4A1C24]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Primary Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-stretch gap-3">
                <div className="flex items-center border border-[#B99A62]/50 bg-[#F7F0E6]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-3 text-sm hover:bg-[#EFE2D1]"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3.5 py-3 text-sm hover:bg-[#EFE2D1]"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, quantity, selectedColor, true)}
                  className="flex-1 py-3.5 px-6 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em] hover:bg-[#5A2630] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  ADD TO BAG
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Save to Wishlist"
                  className={`px-4 border transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'border-[#4A1C24] bg-[#4A1C24] text-[#B99A62]'
                      : 'border-[#B99A62]/50 text-[#33221C] hover:border-[#4A1C24]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#B99A62]' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 bg-[#B99A62] text-[#33221C] text-xs font-semibold tracking-[0.16em] hover:bg-[#c9ab74] transition-colors whitespace-nowrap"
                >
                  BUY IT NOW
                </button>

                <a
                  href={`https://wa.me/917036623624?text=${encodeURIComponent(
                    `Hello Latha Sarees / Jewelry, I would like to inquire about "${product.name}" (₹${product.price.toLocaleString('en-IN')}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 border border-[#4A1C24] text-[#4A1C24] text-xs font-medium tracking-[0.12em] hover:bg-[#EFE2D1] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Inquire on WhatsApp
                </a>
              </div>
            </div>

            {/* Check Delivery Availability by PIN Code */}
            <div className="p-4 bg-[#F7F0E6] border border-[#B99A62]/30 space-y-2">
              <label className="block text-xs font-semibold text-[#33221C]">
                Check Insured Delivery Availability
              </label>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN Code (e.g. 500034)"
                  className="flex-1 px-3 py-2 bg-[#FFFDFC] border border-[#B99A62]/40 text-xs focus:outline-none focus:border-[#4A1C24]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4A1C24] text-[#F7F0E6] text-xs font-medium tracking-wider"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-xs text-[#5A2630] font-medium flex items-center gap-1.5 pt-1">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  {pincodeStatus}
                </p>
              )}
            </div>

            {/* Key Specifications Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-[#F7F0E6]/60 border border-[#B99A62]/20">
                <span className="text-[#806B5E] block">Material / Fabric</span>
                <span className="font-medium text-[#33221C]">{product.fabric}</span>
              </div>
              <div className="p-3 bg-[#F7F0E6]/60 border border-[#B99A62]/20">
                <span className="text-[#806B5E] block">Craft / Weave</span>
                <span className="font-medium text-[#33221C]">{product.weave}</span>
              </div>
              <div className="p-3 bg-[#F7F0E6]/60 border border-[#B99A62]/20">
                <span className="text-[#806B5E] block">Occasion</span>
                <span className="font-medium text-[#33221C]">{product.occasion}</span>
              </div>
              <div className="p-3 bg-[#F7F0E6]/60 border border-[#B99A62]/20">
                <span className="text-[#806B5E] block">Care Instruction</span>
                <span className="font-medium text-[#33221C]">
                  {product.category === 'Sarees'
                    ? 'Professional Silk Dry Clean'
                    : 'Store in Velvet Keepsake Box'}
                </span>
              </div>
            </div>

            {/* Expandable Accordion Sections */}
            <div className="border-t border-[#B99A62]/25 divide-y divide-[#B99A62]/25 text-xs">
              <div>
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'desc' ? null : 'desc')}
                  className="w-full py-3.5 flex items-center justify-between font-semibold tracking-wider text-[#33221C]"
                >
                  <span>CRAFT & EDITORIAL NOTES</span>
                  {openSection === 'desc' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openSection === 'desc' && (
                  <p className="pb-4 text-[#806B5E] leading-relaxed">
                    {product.description} Each piece undergoes a 3-point quality inspection at Latha Sarees & Jewelry before being packed in our signature archival box.
                  </p>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSection(openSection === 'shipping' ? null : 'shipping')
                  }
                  className="w-full py-3.5 flex items-center justify-between font-semibold tracking-wider text-[#33221C]"
                >
                  <span>SHIPPING & RETURNS</span>
                  {openSection === 'shipping' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openSection === 'shipping' && (
                  <div className="pb-4 text-[#806B5E] space-y-2 leading-relaxed">
                    <p className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#5A2630]" />
                      Complimentary insured shipping across India on orders above ₹2,999.
                    </p>
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#5A2630]" />
                      7-day hassle-free exchange or return for unworn pieces with original tags intact.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Curations */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#B99A62]/30">
            <h2 className="font-serif-luxury text-3xl text-center text-[#33221C] mb-8">
              Complete Your Celebration Look
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Zoom Viewer */}
      {fullscreenZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setFullscreenZoom(false)}
        >
          <button
            type="button"
            onClick={() => setFullscreenZoom(false)}
            className="absolute top-6 right-6 p-3 bg-[#FFFDFC] text-[#33221C]"
            aria-label="Close fullscreen zoom"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={product.images[activeImageIdx] || product.thumbnail}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[90vw] object-contain border border-[#B99A62]/40"
          />
        </div>
      )}
    </div>
  );
};
