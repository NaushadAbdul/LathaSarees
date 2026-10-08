import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Heart,
  ShoppingBag,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  LogOut,
  Package,
  User as UserIcon,
  MessageCircle,
} from 'lucide-react';
import { useStore, OrderRecord } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { BRAND_IMAGES } from '../data/catalog';
import { LotusOrnament } from '../components/Navbar';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, settings, toggleWishlist } =
    useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee =
    subtotal === 0 || subtotal >= settings.freeShippingThreshold ? 0 : 199;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-[#F7F0E6] min-h-[75vh] py-12 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#33221C] mb-8">
          Your Shopping Bag
        </h1>

        {cart.length === 0 ? (
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-12 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 mx-auto text-[#B99A62] stroke-[1.3]" />
            <h2 className="font-serif-luxury text-3xl text-[#33221C]">
              Your collection is waiting.
            </h2>
            <p className="text-xs sm:text-sm text-[#806B5E] max-w-md mx-auto">
              Discover something beautiful from our handwoven sarees or temple jewelry archives to add to your bag.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                to="/sarees"
                className="px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs tracking-[0.16em] font-medium"
              >
                SHOP SAREES
              </Link>
              <Link
                to="/jewelry"
                className="px-6 py-3 border border-[#4A1C24] text-[#4A1C24] text-xs tracking-[0.16em] font-medium"
              >
                SHOP JEWELRY
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}_${item.selectedColor}`}
                  className="bg-[#FFFDFC] border border-[#B99A62]/30 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                >
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="w-24 h-32 bg-[#2C1814] shrink-0 overflow-hidden border border-[#B99A62]/25"
                  >
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#806B5E]">
                      {item.product.category} · {item.product.subcategory}
                    </p>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-serif-luxury text-xl text-[#33221C] hover:text-[#5A2630]"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[#806B5E] mt-1">
                      Selected Variant: <strong className="text-[#33221C]">{item.selectedColor}</strong>
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center border border-[#B99A62]/40 bg-[#F7F0E6]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-1 text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold tabular-nums">
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
                          className="px-3 py-1 text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          toggleWishlist(item.product.id);
                          removeFromCart(item.product.id, item.selectedColor);
                        }}
                        className="text-xs text-[#806B5E] hover:text-[#5A2630] flex items-center gap-1"
                      >
                        <Heart className="w-3.5 h-3.5" /> Move to Wishlist
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                        className="text-xs text-[#806B5E] hover:text-[#5A2630] flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right tabular-nums">
                    <p className="text-base font-semibold text-[#33221C]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-[#806B5E]">
                      ₹{item.product.price.toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 h-fit space-y-5">
              <h2 className="font-serif-luxury text-2xl text-[#33221C] border-b border-[#B99A62]/25 pb-3">
                Order Summary
              </h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#806B5E]">Subtotal</span>
                  <span className="font-medium tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#806B5E]">Insured Shipping</span>
                  <span className="font-medium tabular-nums">
                    {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#33221C] pt-3 border-t border-[#B99A62]/25 tabular-nums">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em] hover:bg-[#5A2630] transition-colors"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WishlistPage: React.FC = () => {
  const { products, wishlistIds } = useStore();
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="bg-[#F7F0E6] min-h-[75vh] py-12 px-4 sm:px-8">
      <div className="max-w-[1360px] mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#33221C]">
            Your Personal Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#806B5E] mt-2">
            Saved heirloom sarees and jewelry pieces for your upcoming celebrations.
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-[#FFFDFC] border border-[#B99A62]/30 p-12 text-center max-w-xl mx-auto space-y-4">
            <Heart className="w-10 h-10 mx-auto text-[#B99A62] stroke-[1.3]" />
            <h2 className="font-serif-luxury text-2xl text-[#33221C]">
              Your wishlist is currently empty.
            </h2>
            <p className="text-xs text-[#806B5E]">
              Tap the heart icon on any saree or temple jewelry piece to save it here.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs tracking-[0.16em]"
            >
              EXPLORE THE BOUTIQUE
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CheckoutPage: React.FC = () => {
  const { cart, profile, user, settings, placeOrder, showToast } = useStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(
    profile?.displayName || user?.displayName || ''
  );
  const [customerEmail, setCustomerEmail] = useState(
    profile?.email || user?.email || ''
  );
  const [customerPhone, setCustomerPhone] = useState(profile?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(profile?.addressLine || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [paymentMethod, setPaymentMethod] = useState<
    'Online Payment' | 'Cash on Delivery'
  >('Online Payment');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  React.useEffect(() => {
    if (profile) {
      setCustomerName((prev) => prev || profile.displayName);
      setCustomerEmail((prev) => prev || profile.email);
      setCustomerPhone((prev) => prev || profile.phone);
      setShippingAddress((prev) => prev || profile.addressLine);
      setCity((prev) => prev || profile.city);
      setState((prev) => prev || profile.state);
      setPincode((prev) => prev || profile.pincode);
    }
  }, [profile]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee =
    subtotal >= settings.freeShippingThreshold ? 0 : 199;
  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'LATHA10' || code === 'ROYAL10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      showToast(`Applied 10% privilege discount (₹${disc.toLocaleString('en-IN')})`);
    } else {
      showToast('Invalid privilege code. Try LATHA10 for 10% off.');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const order = await placeOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        state,
        pincode,
        paymentMethod,
        discountAmount,
      });
      setConfirmedOrder(order);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="bg-[#F7F0E6] min-h-[75vh] py-16 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto bg-[#FFFDFC] border border-[#B99A62]/40 p-8 sm:p-12 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#4A1C24] text-[#B99A62] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <p className="text-xs tracking-[0.2em] text-[#5A2630] font-semibold">
            ORDER CONFIRMED · {confirmedOrder.orderNumber}
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#33221C]">
            Thank you for shopping with Latha.
          </h1>
          <p className="text-xs sm:text-sm text-[#806B5E] leading-relaxed">
            Your order has been successfully placed and is being prepared at our boutique.
          </p>

          <div className="bg-[#F7F0E6] border border-[#B99A62]/30 p-6 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#806B5E]">Order Reference:</span>
              <span className="font-semibold text-[#33221C] tabular-nums">
                {confirmedOrder.orderNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#806B5E]">Patron Name:</span>
              <span className="font-medium text-[#33221C]">
                {confirmedOrder.customerName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#806B5E]">Delivery Address:</span>
              <span className="font-medium text-[#33221C] text-right">
                {confirmedOrder.shippingAddress}, {confirmedOrder.city} -{' '}
                {confirmedOrder.pincode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#806B5E]">Payment Method:</span>
              <span className="font-medium text-[#33221C]">
                {confirmedOrder.paymentMethod} ({confirmedOrder.paymentStatus})
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#B99A62]/25 text-sm font-semibold text-[#33221C] tabular-nums">
              <span>Amount Total:</span>
              <span>₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/account"
              className="px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs tracking-[0.16em] font-medium"
            >
              TRACK ORDER STATUS
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 border border-[#4A1C24] text-[#4A1C24] text-xs tracking-[0.16em] font-medium"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#F7F0E6] py-20 text-center">
        <h1 className="font-serif-luxury text-3xl text-[#33221C]">
          Your bag is empty
        </h1>
        <Link
          to="/shop"
          className="mt-4 inline-block px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs tracking-[0.16em]"
        >
          RETURN TO BOUTIQUE
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F0E6] py-12 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#33221C] mb-8">
          Boutique Checkout
        </h1>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Left: Shipping & Payment Steps */}
          <div className="lg:col-span-7 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8 space-y-6">
            <h2 className="font-serif-luxury text-2xl text-[#33221C] border-b border-[#B99A62]/25 pb-3">
              1. Patron & Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 focus:outline-none focus:border-[#4A1C24]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 focus:outline-none focus:border-[#4A1C24]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Mobile Number (for Delivery Updates) *
                </label>
                <input
                  type="tel"
                  required
                  minLength={6}
                  placeholder="+91 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 focus:outline-none focus:border-[#4A1C24]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  minLength={4}
                  maxLength={10}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 focus:outline-none focus:border-[#4A1C24]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium text-[#33221C] mb-1">
                  Complete Street Address / Apartment / Landmark *
                </label>
                <input
                  type="text"
                  required
                  minLength={5}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 focus:outline-none focus:border-[#4A1C24]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 focus:outline-none focus:border-[#4A1C24]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40 focus:outline-none focus:border-[#4A1C24]"
                />
              </div>
            </div>

            <h2 className="font-serif-luxury text-2xl text-[#33221C] border-b border-[#B99A62]/25 pb-3 pt-4">
              2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('Online Payment')}
                className={`p-4 border text-left transition-colors ${
                  paymentMethod === 'Online Payment'
                    ? 'border-[#4A1C24] bg-[#4A1C24] text-[#F7F0E6]'
                    : 'border-[#B99A62]/40 bg-[#F7F0E6] text-[#33221C]'
                }`}
              >
                <p className="font-semibold">Instant Online Payment (Razorpay / UPI / Card)</p>
                <p className="text-[11px] opacity-80 mt-1">
                  Immediate order confirmation & priority insured dispatch
                </p>
              </button>

              {settings.codEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 border text-left transition-colors ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#4A1C24] bg-[#4A1C24] text-[#F7F0E6]'
                      : 'border-[#B99A62]/40 bg-[#F7F0E6] text-[#33221C]'
                  }`}
                >
                  <p className="font-semibold">Cash on Delivery (COD)</p>
                  <p className="text-[11px] opacity-80 mt-1">
                    Pay in cash or UPI at your doorstep upon delivery
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8 h-fit space-y-5">
            <h2 className="font-serif-luxury text-2xl text-[#33221C] border-b border-[#B99A62]/25 pb-3">
              Your Curated Order ({cart.length})
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}_${item.selectedColor}`}
                  className="flex items-center justify-between gap-3 text-xs pb-3 border-b border-[#B99A62]/15"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-16 object-cover bg-[#2C1814]"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-[#33221C] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[#806B5E]">
                        {item.selectedColor} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Privilege Code */}
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Privilege Code (Try LATHA10)"
                className="flex-1 px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 border border-[#4A1C24] text-[#4A1C24] text-xs font-medium"
              >
                Apply
              </button>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-[#B99A62]/25 tabular-nums">
              <div className="flex justify-between text-[#806B5E]">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#806B5E]">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#5A2630] font-medium">
                  <span>Privilege Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-[#33221C] pt-2 border-t border-[#B99A62]/25">
                <span>Total Payable</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.18em] hover:bg-[#5A2630] transition-colors disabled:opacity-50"
            >
              {submitting
                ? 'CONFIRMING YOUR ORDER...'
                : `COMPLETE ORDER · ₹${finalTotal.toLocaleString('en-IN')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AccountPage: React.FC = () => {
  const {
    user,
    isAdmin,
    profile,
    orders,
    loginWithGoogle,
    logout,
    saveUserProfile,
    cancelCustomerOrder,
  } = useStore();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [addressLine, setAddressLine] = useState(profile?.addressLine || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setPhone(profile.phone);
      setAddressLine(profile.addressLine);
      setCity(profile.city);
      setState(profile.state);
      setPincode(profile.pincode);
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="bg-[#F7F0E6] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-[#FFFDFC] border border-[#B99A62]/40 p-8 sm:p-10 text-center space-y-6">
          <div className="flex justify-center text-[#B99A62]">
            <LotusOrnament className="w-10 h-6" />
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#33221C]">
            Patron Account Sign In
          </h1>
          <p className="text-xs text-[#806B5E] leading-relaxed">
            Sign in with your Google account to sync your personal wishlist, manage delivery addresses, and track your Latha Sarees & Jewelry orders in real time.
          </p>
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-3.5 px-6 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em] hover:bg-[#5A2630] transition-colors"
          >
            CONTINUE WITH GOOGLE
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveUserProfile({
      displayName,
      email: user.email || '',
      phone,
      addressLine,
      city,
      state,
      pincode,
    });
  };

  return (
    <div className="bg-[#F7F0E6] min-h-[75vh] py-12 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B99A62]/30 pb-6">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#5A2630] font-medium">
              WELCOME BACK
            </p>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#33221C]">
              {user.displayName || user.email}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-5 py-2.5 bg-[#B99A62] text-[#33221C] text-xs font-semibold tracking-[0.14em]"
              >
                OPEN ADMIN DASHBOARD
              </Link>
            )}
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 border border-[#4A1C24] text-[#4A1C24] text-xs font-medium flex items-center gap-1.5 hover:bg-[#EFE2D1]"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Saved Profile & Address */}
          <div className="lg:col-span-5 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8 h-fit">
            <h2 className="font-serif-luxury text-2xl text-[#33221C] flex items-center gap-2 mb-5">
              <UserIcon className="w-5 h-5 text-[#B99A62]" />
              Saved Delivery Profile
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                />
              </div>
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 7036623624"
                  className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                />
              </div>
              <div>
                <label className="block font-medium text-[#33221C] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#33221C] mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F0E6] border border-[#B99A62]/40"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.14em]"
              >
                SAVE PROFILE PREFERENCES
              </button>
            </form>
          </div>

          {/* Right: Order History */}
          <div className="lg:col-span-7 bg-[#FFFDFC] border border-[#B99A62]/35 p-6 sm:p-8 space-y-5">
            <h2 className="font-serif-luxury text-2xl text-[#33221C] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#B99A62]" />
              My Orders ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-[#806B5E]">
                  You have not placed any orders yet.
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-5 py-2.5 bg-[#4A1C24] text-[#F7F0E6] text-xs tracking-wider"
                >
                  Explore Sarees & Jewelry
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-[#F7F0E6] border border-[#B99A62]/30 space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#B99A62]/20 pb-2">
                      <div>
                        <span className="font-semibold text-[#33221C] tabular-nums">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[#806B5E] ml-2">
                          · Placed on {ord.createdAt}
                        </span>
                      </div>
                      <span className="font-semibold text-[#5A2630]">
                        Status: {ord.status}
                      </span>
                    </div>

                    <p className="text-[#33221C] font-medium">{ord.itemSummary}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[#806B5E]">
                        {ord.paymentMethod} ({ord.paymentStatus}) · Total:{' '}
                        <strong className="text-[#33221C] tabular-nums">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </strong>
                      </span>

                      {(ord.status === 'Pending' || ord.status === 'Confirmed') && (
                        <button
                          type="button"
                          onClick={() => cancelCustomerOrder(ord.id, ord)}
                          className="text-xs text-[#5A2630] underline hover:text-[#33221C]"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => (
  <div className="bg-[#F7F0E6] py-16 px-4 sm:px-8">
    <div className="max-w-[1200px] mx-auto space-y-14">
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center text-[#B99A62] mb-2">
          <LotusOrnament className="w-10 h-6" />
        </div>
        <p className="text-xs tracking-[0.22em] text-[#5A2630] font-semibold">
          OUR HERITAGE & PHILOSOPHY
        </p>
        <h1 className="font-serif-luxury text-4xl sm:text-6xl text-[#33221C] mt-2 text-balance">
          Crafted With Tradition. Curated For Today.
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <img
            src={BRAND_IMAGES.heroBridal}
            alt="Latha Sarees & Jewelry Heritage"
            referrerPolicy="no-referrer"
            className="w-full aspect-[4/3] object-cover border border-[#B99A62]/40 p-2 bg-[#FFFDFC]"
          />
        </div>
        <div className="lg:col-span-6 space-y-4 text-sm text-[#806B5E] leading-relaxed">
          <p className="text-[#33221C] font-serif-luxury text-2xl">
            Celebrating the timeless poetry of Indian handlooms and sacred temple jewelry.
          </p>
          <p>
            Founded with a devotion to authentic Indian textiles and traditional goldsmithing,{' '}
            <strong className="text-[#33221C]">Latha Sarees & Jewelry</strong> curates heirloom drapes and artisanal jewelry for women who cherish heritage with modern refinement.
          </p>
          <p>
            Every Banarasi and Kanchipuram saree in our collection is selected for the purity of its silk, the richness of its zari weave, and the grace of its drape. Our jewelry collection pairs these textiles with handcrafted Kemp ruby jhumkas, Goddess Lakshmi Nakshi harams, and Nizam kadas.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Thank you. Our boutique concierge will reach out shortly.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-[#F7F0E6] py-16 px-4 sm:px-8">
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <p className="text-xs tracking-[0.2em] text-[#5A2630] font-semibold">
            PERSONAL CONCIERGE
          </p>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#33221C]">
            Connect With Latha
          </h1>
          <p className="text-xs sm:text-sm text-[#806B5E] leading-relaxed">
            Whether you are curating a bridal trousseau, seeking styling guidance for a festive saree, or inquiring about custom delivery, our team is delighted to assist you.
          </p>

          <div className="space-y-4 pt-2 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#5A2630] mt-0.5" />
              <div>
                <p className="font-semibold text-[#33221C]">Direct Telephone & WhatsApp</p>
                <a
                  href="tel:+917036623624"
                  className="text-[#5A2630] font-medium hover:underline tabular-nums"
                >
                  +91 7036623624
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#5A2630] mt-0.5" />
              <div>
                <p className="font-semibold text-[#33221C]">Concierge Hours</p>
                <p className="text-[#806B5E]">Monday – Saturday · 10:00 AM to 8:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#5A2630] mt-0.5" />
              <div>
                <p className="font-semibold text-[#33221C]">Boutique Flagship</p>
                <p className="text-[#806B5E]">
                  Latha Sarees & Jewelry Studio, Jubilee Hills, Hyderabad, India
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/917036623624?text=Hello%20Latha%20Sarees%20%2F%20Jewelry%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.14em]"
          >
            <MessageCircle className="w-4 h-4 text-[#B99A62]" />
            CHAT ON WHATSAPP (+91 7036623624)
          </a>
        </div>

        <div className="lg:col-span-7 bg-[#FFFDFC] border border-[#B99A62]/35 p-8">
          <h2 className="font-serif-luxury text-2xl text-[#33221C] mb-6">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-[#33221C] mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40"
              />
            </div>
            <div>
              <label className="block font-medium text-[#33221C] mb-1">
                Email or Phone Number *
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40"
              />
            </div>
            <div>
              <label className="block font-medium text-[#33221C] mb-1">
                How May We Assist You? *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about the saree or jewelry piece you are looking for..."
                className="w-full px-3.5 py-2.5 bg-[#F7F0E6] border border-[#B99A62]/40"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em]"
            >
              SEND INQUIRY
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const FaqAndLegalPage: React.FC = () => (
  <div className="bg-[#F7F0E6] py-16 px-4 sm:px-8">
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#33221C]">
          Client Care, Policies & FAQs
        </h1>
        <p className="text-xs text-[#806B5E] mt-2">
          Everything you need to know about shipping, returns, silk care, and privacy at Latha Sarees & Jewelry.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 'How long does shipping take across India?',
            a: 'All in-stock sarees and jewelry orders are dispatched within 24–48 hours and delivered via insured express courier within 3–5 business days across India. Orders above ₹2,999 enjoy complimentary shipping.',
          },
          {
            q: 'Do your sarees come with a blouse piece?',
            a: 'Yes, all our Banarasi, Kanchipuram, and silk-organza sarees include an unstitched running or contrast zari-bordered blouse piece as detailed in the product description.',
          },
          {
            q: 'What is your return and exchange policy?',
            a: 'We offer a 7-day return or exchange window for unused, unworn pieces in their original packaging with tags intact. Please contact our concierge at +91 7036623624 to initiate a return.',
          },
          {
            q: 'How should I care for my handloom silk sarees and temple jewelry?',
            a: 'Preserve silk sarees in a breathable muslin cloth away from direct sunlight and dry clean only. Store temple jewelry in the provided velvet keepsake box and avoid direct contact with perfumes.',
          },
          {
            q: 'Privacy Policy & Terms of Service',
            a: 'Latha Sarees & Jewelry strictly protects your personal contact and shipping information. Customer data is isolated and used solely to fulfill orders and provide requested styling assistance.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#FFFDFC] border border-[#B99A62]/30 p-6 space-y-2"
          >
            <h2 className="font-serif-luxury text-xl font-semibold text-[#33221C]">
              {item.q}
            </h2>
            <p className="text-xs sm:text-sm text-[#806B5E] leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
