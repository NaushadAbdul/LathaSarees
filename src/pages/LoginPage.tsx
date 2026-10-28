import React, { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Heart,
  Clock,
  AlertCircle,
  MessageCircle,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LotusOrnament } from '../components/Navbar';

export const LoginPage: React.FC = () => {
  const {
    user,
    authReady,
    isLoggingIn,
    authError,
    clearAuthError,
    loginWithGoogle,
  } = useStore();

  useEffect(() => {
    // Clear any previous transient auth errors when mounting the login page
    clearAuthError();
  }, []);

  // If session is already authenticated, redirect smoothly to Patron Account Dashboard
  if (authReady && user) {
    return <Navigate to="/account" replace />;
  }

  // Graceful, branded session resolving state
  if (!authReady) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[#F7F0E6]">
        <div className="max-w-md w-full bg-[#FFFDFC] border border-[#B99A62]/40 p-10 text-center space-y-4 shadow-lg animate-pulse">
          <div className="flex justify-center text-[#B99A62]">
            <LotusOrnament className="w-10 h-6" />
          </div>
          <span className="text-[11px] tracking-[0.2em] font-medium text-[#5A2630] uppercase">
            Latha Sarees & Jewelry
          </span>
          <h2 className="font-serif-luxury text-2xl text-[#33221C]">
            Verifying Patron Credentials...
          </h2>
          <p className="text-xs text-[#806B5E]">
            Establishing secure connection to boutique services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F0E6]">
      <div className="max-w-4xl w-full bg-[#FFFDFC] border border-[#B99A62]/35 shadow-2xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Latha Heritage & Patron Privileges */}
        <div className="lg:col-span-5 bg-[#4A1C24] text-[#F7F0E6] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#B99A62]/25 relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2 text-[#B99A62]">
              <LotusOrnament className="w-8 h-5" />
              <span className="text-[11px] tracking-[0.22em] font-medium uppercase">
                Boutique Archive
              </span>
            </div>

            <div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#FFFDFC] leading-tight">
                Patron Privileges
              </h2>
              <p className="text-xs text-[#EFE2D1]/80 mt-2 leading-relaxed">
                Welcome to the private sanctuary of Latha Sarees & Jewelry. Access heirloom drapes, antique temple jewelry, and personalized concierge care.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <Heart className="w-4 h-4 text-[#B99A62] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#F7F0E6]">Personalized Wishlist</p>
                  <p className="text-[11px] text-[#EFE2D1]/70">
                    Sync your preferred mulberry silks and kemp jhumkas across devices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#B99A62] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#F7F0E6]">Real-Time Order Tracking</p>
                  <p className="text-[11px] text-[#EFE2D1]/70">
                    Follow the status of your handloom parcel from loom to ceremonial doorstep.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#B99A62] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#F7F0E6]">Saved Delivery Addresses</p>
                  <p className="text-[11px] text-[#EFE2D1]/70">
                    Effortless one-click boutique checkout with insured shipping across India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#B99A62] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#F7F0E6]">Master Weaver Direct Access</p>
                  <p className="text-[11px] text-[#EFE2D1]/70">
                    Exclusive previews of limited bridal editions and festive releases.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#B99A62]/20 mt-8 relative z-10 text-[11px] text-[#EFE2D1]/60 flex items-center justify-between">
            <span>Authentic Handloom Certified</span>
            <span className="text-[#B99A62]">Est. 2026</span>
          </div>

          {/* Decorative watermark */}
          <div className="absolute -bottom-10 -right-10 text-[#5A2630]/40 pointer-events-none select-none">
            <LotusOrnament className="w-56 h-36" />
          </div>
        </div>

        {/* Right Column: Google Sign-In Card */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-[#FFFDFC]">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] tracking-[0.2em] font-medium text-[#5A2630] uppercase">
                Secure Patron Access
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#33221C]">
                Sign In to Your Account
              </h1>
              <p className="text-xs text-[#806B5E] leading-relaxed">
                Continue with your Google account for instantaneous, password-free access to your Latha orders and saved preferences.
              </p>
            </div>

            {/* Error Notification Banner */}
            {authError && (
              <div className="p-4 bg-[#FBF0EE] border border-[#D97706]/40 text-xs text-[#33221C] space-y-1 relative">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                  <div className="flex-1 pr-6">
                    <p className="font-semibold text-[#B91C1C]">Authentication Notice</p>
                    <p className="text-[11px] text-[#5A2630] leading-relaxed mt-0.5">{authError}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAuthError}
                  className="absolute top-3 right-3 text-[#806B5E] hover:text-[#33221C]"
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={loginWithGoogle}
                className={`w-full py-3.5 px-6 border border-[#B99A62]/60 bg-[#FFFDFC] text-[#33221C] hover:bg-[#F7F0E6] text-xs font-semibold tracking-[0.12em] transition-all flex items-center justify-center gap-3 shadow-sm ${
                  isLoggingIn ? 'opacity-70 cursor-wait' : 'hover:border-[#4A1C24] cursor-pointer'
                }`}
              >
                {isLoggingIn ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-[#5A2630]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>CONNECTING TO GOOGLE AUTH...</span>
                  </>
                ) : (
                  <>
                    {/* Official Multi-colored Google G Icon */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>CONTINUE WITH GOOGLE</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#806B5E] leading-relaxed pt-1">
                By signing in, you agree to Latha Sarees & Jewelry’s{' '}
                <Link to="/faq" className="underline hover:text-[#33221C]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/faq" className="underline hover:text-[#33221C]">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Concierge & Security Footer */}
          <div className="pt-6 border-t border-[#B99A62]/20 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-[#806B5E]">Need assistance placing an order?</span>
              <a
                href="https://wa.me/917036623624?text=Hello%20Latha%20Boutique%2C%20I%20need%20assistance%20signing%20in%20or%20placing%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5A2630] font-semibold flex items-center gap-1.5 hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#B99A62]" />
                WhatsApp Concierge
              </a>
            </div>

            <p className="text-[10px] text-[#806B5E] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B99A62] shrink-0" />
              <span>
                Protected by Firebase SSL encryption. Your personal credentials remain strictly confidential.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
