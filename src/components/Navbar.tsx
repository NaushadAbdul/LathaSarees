import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  User as UserIcon,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LotusOrnament: React.FC<{ className?: string }> = ({ className = 'w-8 h-5' }) => (
  <svg
    viewBox="0 0 64 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M32 4C28 12 24 18 24 24C24 28.4 27.6 32 32 32C36.4 32 40 28.4 40 24C40 18 36 12 32 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M24 26C17 24 12 18 11 11C18 12 23 17 25 23"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M40 26C47 24 52 18 53 11C46 12 41 17 39 23"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M20 30C12 30 6 26 3 20C10 20 16 23 21 28"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M44 30C52 30 58 26 61 20C54 20 48 23 43 28"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

export const Navbar: React.FC = () => {
  const {
    cart,
    wishlistIds,
    settings,
    setIsCartOpen,
    setIsSearchOpen,
    user,
    isAdmin,
  } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const totalBagItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Slim Top Announcement Bar (<= 36px height) */}
      <div className="bg-[#3D161E] text-[#F7F0E6] border-b border-[#B99A62]/25 text-[11px] tracking-[0.14em] px-4 py-2">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4">
          <span className="hidden md:inline text-[#EFE2D1]/80 whitespace-nowrap">
            +91 7036623624
          </span>
          <p className="text-center mx-auto truncate font-medium">
            {settings.announcementText}
          </p>
          <span className="hidden md:inline text-[#B99A62] whitespace-nowrap">
            INR (₹)
          </span>
        </div>
      </div>

      {/* Main Header — Strict 3-Zone Top Bar Contract */}
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
          scrolled
            ? 'bg-[#4A1C24]/98 text-[#F7F0E6] border-[#B99A62]/30 shadow-sm'
            : 'bg-[#4A1C24] text-[#F7F0E6] border-[#B99A62]/20'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Zone 1: Single Text Element Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#F7F0E6] hover:text-[#B99A62] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/"
              className="font-serif-luxury text-2xl sm:text-3xl font-semibold tracking-[0.22em] text-[#F7F0E6] hover:text-[#B99A62] transition-colors whitespace-nowrap"
            >
              LATHA
            </Link>
          </div>

          {/* Zone 2: 5 Clean Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-8 text-xs tracking-[0.18em] font-medium text-[#EFE2D1]"
          >
            <Link
              to="/"
              className={`py-1 transition-colors whitespace-nowrap border-b ${
                location.pathname === '/'
                  ? 'text-[#B99A62] border-[#B99A62]'
                  : 'border-transparent hover:text-[#B99A62]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/sarees"
              className={`py-1 transition-colors whitespace-nowrap border-b ${
                location.pathname === '/sarees'
                  ? 'text-[#B99A62] border-[#B99A62]'
                  : 'border-transparent hover:text-[#B99A62]'
              }`}
            >
              Sarees
            </Link>
            <Link
              to="/jewelry"
              className={`py-1 transition-colors whitespace-nowrap border-b ${
                location.pathname === '/jewelry'
                  ? 'text-[#B99A62] border-[#B99A62]'
                  : 'border-transparent hover:text-[#B99A62]'
              }`}
            >
              Jewelry
            </Link>
            <Link
              to="/collections/wedding-collection"
              className={`py-1 transition-colors whitespace-nowrap border-b ${
                location.pathname.startsWith('/collections')
                  ? 'text-[#B99A62] border-[#B99A62]'
                  : 'border-transparent hover:text-[#B99A62]'
              }`}
            >
              Collections
            </Link>
            <Link
              to="/about"
              className={`py-1 transition-colors whitespace-nowrap border-b ${
                location.pathname === '/about'
                  ? 'text-[#B99A62] border-[#B99A62]'
                  : 'border-transparent hover:text-[#B99A62]'
              }`}
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              className={`hidden xl:inline-block py-1 transition-colors whitespace-nowrap border-b ${
                location.pathname === '/contact'
                  ? 'text-[#B99A62] border-[#B99A62]'
                  : 'border-transparent hover:text-[#B99A62]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#F7F0E6] hover:text-[#B99A62] transition-colors"
              aria-label="Search sarees and jewelry"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </button>

            <Link
              to="/wishlist"
              className="relative p-2 text-[#F7F0E6] hover:text-[#B99A62] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.6]" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-0.5 w-4 h-4 rounded-full bg-[#B99A62] text-[#33221C] text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => navigate(user ? '/account' : '/login')}
              className="p-2 text-[#F7F0E6] hover:text-[#B99A62] transition-colors flex items-center gap-1.5"
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5 stroke-[1.6]" />
              {isAdmin && (
                <span className="hidden sm:inline text-[11px] text-[#B99A62] font-medium">
                  Admin
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#F7F0E6] hover:text-[#B99A62] transition-colors flex items-center gap-1.5"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              <span className="w-5 h-5 rounded-full bg-[#B99A62] text-[#33221C] text-[11px] font-semibold flex items-center justify-center tabular-nums">
                {totalBagItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-[#F7F0E6] text-[#33221C] h-full flex flex-col justify-between p-6 z-10 border-r border-[#B99A62]/30">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#B99A62]/25">
                <span className="font-serif-luxury text-2xl font-semibold tracking-[0.2em] text-[#4A1C24]">
                  LATHA
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#33221C] hover:text-[#5A2630]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col space-y-4 text-sm font-medium">
                <Link to="/" className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]">
                  Home
                </Link>
                <Link to="/sarees" className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]">
                  Sarees Collection
                </Link>
                <Link to="/jewelry" className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]">
                  Temple & Fine Jewelry
                </Link>
                <Link to="/shop" className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]">
                  New Arrivals & Full Boutique
                </Link>
                <Link
                  to="/collections/wedding-collection"
                  className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]"
                >
                  Bridal & Wedding Edit
                </Link>
                <Link to="/wishlist" className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]">
                  Saved Wishlist ({wishlistIds.length})
                </Link>
                <Link to="/account" className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]">
                  My Account & Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="py-2 border-b border-[#B99A62]/15 text-[#5A2630] font-semibold flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Boutique Admin Console
                  </Link>
                )}
                <Link to="/about" className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]">
                  Our Heritage
                </Link>
                <Link to="/contact" className="py-2 border-b border-[#B99A62]/15 hover:text-[#5A2630]">
                  Contact & Styling Support
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#B99A62]/25 text-xs text-[#806B5E] space-y-2">
              <p className="font-medium text-[#33221C]">Direct Styling Concierge</p>
              <a
                href="tel:+917036623624"
                className="flex items-center gap-2 text-[#5A2630] font-medium hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 7036623624
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const Footer: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast('Thank you for joining The Latha Private Edit.');
    setEmail('');
  };

  return (
    <footer className="bg-[#4A1C24] text-[#F7F0E6] border-t border-[#B99A62]/30">
      {/* Top Newsletter & Brand Crest Row — Directly Inspired by Reference Footer */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-14 pb-10 border-b border-[#B99A62]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Brand Emblem */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <LotusOrnament className="w-10 h-6 text-[#B99A62] mb-1.5" />
            <Link
              to="/"
              className="font-serif-luxury text-3xl tracking-[0.22em] text-[#F7F0E6] font-semibold"
            >
              LATHA
            </Link>
            <span className="text-[11px] tracking-[0.24em] text-[#B99A62] mt-1">
              SAREES & JEWELRY
            </span>
          </div>

          {/* Center Newsletter */}
          <div className="lg:col-span-6 text-center">
            <h3 className="font-serif-luxury text-xl sm:text-2xl tracking-[0.08em] text-[#F7F0E6] mb-1.5">
              Be The First To Discover What’s New
            </h3>
            <p className="text-xs text-[#EFE2D1]/80 mb-5">
              Receive private previews of handloom silk arrivals, bridal edits, and heirloom jewelry.
            </p>
            <form
              onSubmit={handleNewsletter}
              className="max-w-md mx-auto flex items-stretch border border-[#B99A62]/50 bg-[#3B141B]"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-transparent text-xs text-[#F7F0E6] placeholder-[#EFE2D1]/50 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#B99A62] text-[#33221C] text-xs font-semibold tracking-[0.14em] hover:bg-[#c9ab74] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Right Social & Direct Contact */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right">
            <p className="text-xs tracking-[0.18em] text-[#B99A62] mb-2">
              BOUTIQUE CONCIERGE
            </p>
            <a
              href="tel:+917036623624"
              className="font-serif-luxury text-xl text-[#F7F0E6] hover:text-[#B99A62] transition-colors tabular-nums"
            >
              +91 7036623624
            </a>
            <div className="flex items-center gap-3 mt-3 text-xs text-[#EFE2D1]/80">
              <a
                href="https://wa.me/917036623624?text=Hello%20Latha%20Sarees%20%2F%20Jewelry%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 border border-[#B99A62]/40 hover:border-[#B99A62] hover:text-[#B99A62] transition-colors whitespace-nowrap"
              >
                WhatsApp
              </a>
              <Link
                to="/contact"
                className="px-3 py-1 border border-[#B99A62]/40 hover:border-[#B99A62] hover:text-[#B99A62] transition-colors whitespace-nowrap"
              >
                Book Video Call
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Column Links Row */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        <div>
          <h4 className="font-serif-luxury text-base tracking-[0.14em] text-[#B99A62] mb-4">
            Boutique
          </h4>
          <ul className="space-y-2.5 text-[#EFE2D1]/80">
            <li>
              <Link to="/sarees" className="hover:text-[#B99A62] transition-colors">
                Banarasi & Kanchipuram Sarees
              </Link>
            </li>
            <li>
              <Link to="/jewelry" className="hover:text-[#B99A62] transition-colors">
                Temple Jhumkas & Necklaces
              </Link>
            </li>
            <li>
              <Link to="/jewelry?sub=Bangles" className="hover:text-[#B99A62] transition-colors">
                Antique Kadas & Bangles
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#B99A62] transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/collections/wedding-collection" className="hover:text-[#B99A62] transition-colors">
                The Bridal Edit
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-luxury text-base tracking-[0.14em] text-[#B99A62] mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-[#EFE2D1]/80">
            <li>
              <Link to="/contact" className="hover:text-[#B99A62] transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/account/orders" className="hover:text-[#B99A62] transition-colors">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-[#B99A62] transition-colors">
                Shipping & Delivery Policy
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-[#B99A62] transition-colors">
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-[#B99A62] transition-colors">
                Care Instructions & FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-luxury text-base tracking-[0.14em] text-[#B99A62] mb-4">
            Information
          </h4>
          <ul className="space-y-2.5 text-[#EFE2D1]/80">
            <li>
              <Link to="/about" className="hover:text-[#B99A62] transition-colors">
                About Latha Sarees & Jewelry
              </Link>
            </li>
            <li>
              <Link to="/faq?tab=privacy" className="hover:text-[#B99A62] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/faq?tab=terms" className="hover:text-[#B99A62] transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif-luxury text-base tracking-[0.14em] text-[#B99A62] mb-4">
            About The House
          </h4>
          <p className="text-[#EFE2D1]/80 leading-relaxed mb-4">
            Latha Sarees & Jewelry celebrates India’s handloom textile heritage and sacred temple jewelry craftsmanship with curated pieces for timeless celebrations.
          </p>
          <p className="text-[#B99A62] font-medium">
            Direct Telephone: +91 7036623624
          </p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-[#B99A62]/20 py-5 px-4 sm:px-8 text-[11px] text-[#EFE2D1]/65">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Latha Sarees & Jewelry. All rights reserved.</p>
          <p className="tracking-wider">
            UPI · Razorpay · Visa · Mastercard · Cash on Delivery
          </p>
        </div>
      </div>
    </footer>
  );
};
