import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Search,
  ArrowRight,
  MessageCircle,
  PhoneCall,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { resolveAssetUrl } from '../data/catalog';

export const Overlays: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    settings,
    isSearchOpen,
    setIsSearchOpen,
    products,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    wishlistIds,
    toastMessage,
  } = useStore();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQvColor, setSelectedQvColor] = useState<string>('');
  const [supportExpanded, setSupportExpanded] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);

  const filteredSearchProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products.slice(0, 4);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.weave.toLowerCase().includes(q) ||
        p.occasion.toLowerCase().includes(q)
    );
  }, [searchQuery, products]);

  return (
    <>
      {/* 1. Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-[#F7F0E6] text-[#33221C] h-full flex flex-col justify-between border-l border-[#B99A62]/30 shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-[#B99A62]/25">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-luxury text-2xl font-semibold tracking-wider text-[#33221C]">
                  Your Shopping Bag
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[#806B5E] hover:text-[#33221C] transition-colors"
                  aria-label="Close shopping bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Complimentary Shipping Threshold Conversion Strip */}
              <div className="mt-4 bg-[#EFE2D1] p-3 border border-[#B99A62]/25 text-xs">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-[#33221C]">
                    You are{' '}
                    <span className="font-semibold text-[#5A2630] tabular-nums">
                      ₹{remainingForFreeShipping.toLocaleString('en-IN')}
                    </span>{' '}
                    away from complimentary insured shipping.
                  </p>
                ) : (
                  <p className="text-[#4A1C24] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5A2630] shrink-0" />
                    Your order qualifies for complimentary insured shipping.
                  </p>
                )}
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ShoppingBag className="w-10 h-10 mx-auto text-[#B99A62] stroke-[1.3]" />
                  <h3 className="font-serif-luxury text-2xl text-[#33221C]">
                    Your collection is waiting.
                  </h3>
                  <p className="text-xs text-[#806B5E] max-w-xs mx-auto">
                    Discover handwoven Banarasi silks, Kanchipuram drapes, and temple jewelry crafted for your next celebration.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/sarees');
                      }}
                      className="px-5 py-2.5 bg-[#4A1C24] text-[#F7F0E6] text-xs tracking-[0.14em] font-medium hover:bg-[#5A2630] transition-colors whitespace-nowrap"
                    >
                      Explore Sarees
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/jewelry');
                      }}
                      className="px-5 py-2.5 border border-[#4A1C24] text-[#4A1C24] text-xs tracking-[0.14em] font-medium hover:bg-[#EFE2D1] transition-colors whitespace-nowrap"
                    >
                      Explore Jewelry
                    </button>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}_${item.selectedColor}`}
                    className="flex gap-4 pb-5 border-b border-[#B99A62]/20"
                  >
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-20 h-26 shrink-0 bg-[#2C1814] border border-[#B99A62]/25 overflow-hidden"
                    >
                      <img
                        src={resolveAssetUrl(item.product.thumbnail)}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${item.product.id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-serif-luxury text-base font-medium text-[#33221C] hover:text-[#5A2630] line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                            className="text-[#806B5E] hover:text-[#5A2630] p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#806B5E] mt-0.5">
                          {item.selectedColor} · {item.product.subcategory}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#B99A62]/40 bg-[#FFFDFC]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.quantity - 1
                              )
                            }
                            className="p-1.5 text-[#33221C] hover:bg-[#EFE2D1]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 text-[#33221C] hover:bg-[#EFE2D1]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-[#33221C] tabular-nums">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#EFE2D1]/70 border-t border-[#B99A62]/30 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#806B5E]">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium text-[#33221C]">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#806B5E]">
                    <span>Shipping</span>
                    <span className="tabular-nums">
                      {remainingForFreeShipping === 0 ? 'Complimentary' : '₹199'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#33221C] pt-2 border-t border-[#B99A62]/25">
                    <span>Estimated Total</span>
                    <span className="tabular-nums">
                      ₹
                      {(
                        subtotal + (remainingForFreeShipping === 0 ? 0 : 199)
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/cart');
                    }}
                    className="py-3 px-4 border border-[#4A1C24] text-[#4A1C24] text-xs font-medium tracking-[0.14em] hover:bg-[#FFFDFC] transition-colors whitespace-nowrap"
                  >
                    View Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="py-3 px-4 bg-[#4A1C24] text-[#F7F0E6] text-xs font-medium tracking-[0.14em] hover:bg-[#5A2630] transition-colors whitespace-nowrap"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#33221C]/70 backdrop-blur-xs flex items-start justify-center pt-12 sm:pt-20 px-4">
          <div className="w-full max-w-3xl bg-[#F7F0E6] border border-[#B99A62]/40 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#B99A62]/30">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-[#5A2630]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Banarasi silk, Kanchipuram, Temple Jhumkas, Lakshmi Haram..."
                  className="w-full bg-transparent text-sm sm:text-base text-[#33221C] placeholder-[#806B5E] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-[#806B5E] hover:text-[#33221C]"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#806B5E]">Popular:</span>
              {['Banarasi', 'Kanchipuram', 'Jhumkas', 'Necklaces', 'Bangles', 'Bridal'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-[#EFE2D1] text-[#33221C] hover:bg-[#4A1C24] hover:text-[#F7F0E6] transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>

            {/* Matching Results */}
            <div className="mt-6">
              <p className="text-xs text-[#806B5E] mb-3">
                {searchQuery.trim()
                  ? `Showing ${filteredSearchProducts.length} matching pieces`
                  : 'Curated Highlights'}
              </p>

              {filteredSearchProducts.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-serif-luxury text-xl text-[#33221C]">
                    No matching pieces found for “{searchQuery}”.
                  </p>
                  <p className="text-xs text-[#806B5E] mt-1">
                    Try searching for Silk, Banarasi, Kanchipuram, Jhumka, or Necklace.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredSearchProducts.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 p-3 bg-[#FFFDFC] border border-[#B99A62]/20 hover:border-[#5A2630] transition-colors"
                    >
                      <img
                        src={resolveAssetUrl(item.thumbnail)}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-cover bg-[#2C1814] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-[#806B5E]">
                          {item.category} · {item.subcategory}
                        </p>
                        <h4 className="font-serif-luxury text-base font-medium text-[#33221C] truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs font-semibold text-[#5A2630] tabular-nums mt-1">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#806B5E] shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#F7F0E6] border border-[#B99A62]/40 shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#FFFDFC] text-[#33221C] flex items-center justify-center hover:bg-[#4A1C24] hover:text-[#F7F0E6] transition-colors"
              aria-label="Close quick view"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-[#2C1814] aspect-[3/4] md:aspect-auto">
              <img
                src={resolveAssetUrl(quickViewProduct.images?.[0] || quickViewProduct.thumbnail)}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div>
                <p className="text-xs text-[#806B5E]">
                  {quickViewProduct.category} · {quickViewProduct.subcategory}
                </p>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#33221C] mt-1">
                  {quickViewProduct.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-3 tabular-nums">
                  <span className="text-xl font-semibold text-[#33221C]">
                    ₹{quickViewProduct.price.toLocaleString('en-IN')}
                  </span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-sm text-[#806B5E] line-through">
                      ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-[#5A2630] font-medium">
                    {quickViewProduct.discount}% Off
                  </span>
                </div>

                <p className="text-xs text-[#806B5E] leading-relaxed mt-4">
                  {quickViewProduct.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[#B99A62]/25 space-y-2 text-xs">
                  <p>
                    <span className="text-[#806B5E]">Craft / Material:</span>{' '}
                    <span className="font-medium text-[#33221C]">{quickViewProduct.fabric}</span>
                  </p>
                  <p>
                    <span className="text-[#806B5E]">Weave / Finish:</span>{' '}
                    <span className="font-medium text-[#33221C]">{quickViewProduct.weave}</span>
                  </p>
                  <p>
                    <span className="text-[#806B5E]">Occasion:</span>{' '}
                    <span className="font-medium text-[#33221C]">{quickViewProduct.occasion}</span>
                  </p>
                </div>

                {/* Color Selection */}
                <div className="mt-4">
                  <p className="text-xs text-[#806B5E] mb-2">Select Variant:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((color) => {
                      const active =
                        (selectedQvColor || quickViewProduct.colors[0]) === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedQvColor(color)}
                          className={`px-3 py-1.5 text-xs border transition-colors ${
                            active
                              ? 'border-[#4A1C24] bg-[#4A1C24] text-[#F7F0E6]'
                              : 'border-[#B99A62]/40 bg-[#FFFDFC] text-[#33221C]'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(
                        quickViewProduct,
                        1,
                        selectedQvColor || quickViewProduct.colors[0],
                        true
                      );
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 px-4 bg-[#4A1C24] text-[#F7F0E6] text-xs font-medium tracking-[0.14em] hover:bg-[#5A2630] transition-colors whitespace-nowrap"
                  >
                    Add to Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className="p-3 border border-[#B99A62]/40 text-[#33221C] hover:border-[#4A1C24]"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlistIds.includes(quickViewProduct.id)
                          ? 'fill-[#5A2630] text-[#5A2630]'
                          : ''
                      }`}
                    />
                  </button>
                </div>
                <Link
                  to={`/product/${quickViewProduct.id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="block text-center text-xs text-[#5A2630] hover:underline font-medium"
                >
                  View Full Editorial Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-5 z-50 bg-[#4A1C24] text-[#F7F0E6] border border-[#B99A62]/50 px-4 py-3 shadow-lg text-xs flex items-center gap-2.5 max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-[#B99A62] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 5. Floating WhatsApp & Boutique Concierge Widget (+91 7036623624) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {supportExpanded && (
          <div className="bg-[#FFFDFC] border border-[#B99A62]/40 shadow-xl p-4 w-72 text-xs space-y-3 mb-1">
            <div className="flex items-center justify-between border-b border-[#B99A62]/20 pb-2">
              <div>
                <p className="font-serif-luxury text-base font-semibold text-[#33221C]">
                  Latha Boutique Concierge
                </p>
                <p className="text-[11px] text-[#806B5E]">
                  Direct Saree & Jewelry Styling Support
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSupportExpanded(false)}
                className="text-[#806B5E] hover:text-[#33221C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <a
              href="https://wa.me/917036623624?text=Hello%20Latha%20Sarees%20%2F%20Jewelry%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#4A1C24] text-[#F7F0E6] hover:bg-[#5A2630] transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4 text-[#B99A62]" />
              Chat on WhatsApp
            </a>

            <a
              href="tel:+917036623624"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 border border-[#4A1C24] text-[#4A1C24] hover:bg-[#EFE2D1] transition-colors font-medium tabular-nums"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Call +91 7036623624
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSupportExpanded((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4A1C24] text-[#F7F0E6] border border-[#B99A62]/50 shadow-lg hover:bg-[#5A2630] transition-colors text-xs font-medium tracking-wider"
          aria-label="WhatsApp and Boutique Concierge"
        >
          <MessageCircle className="w-4 h-4 text-[#B99A62]" />
          <span>Boutique Concierge</span>
        </button>
      </div>
    </>
  );
};
