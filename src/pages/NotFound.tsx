import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { LotusOrnament } from '../components/Navbar';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div className="bg-[#F7F0E6] min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-8 py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle gold circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-[#B99A62]/10" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-[#B99A62]/8" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full border border-[#B99A62]/6" />

        {/* Diagonal gold hairlines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#B99A62]/10 to-transparent rotate-12 origin-top" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#B99A62]/8 to-transparent -rotate-6 origin-top" />
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 text-center max-w-2xl mx-auto transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Lotus ornament */}
        <div className="flex justify-center text-[#B99A62] mb-6">
          <LotusOrnament className="w-12 h-7" />
        </div>

        {/* 404 number */}
        <div className="relative mb-4">
          <h1 className="font-serif-luxury text-[120px] sm:text-[160px] lg:text-[200px] leading-none font-normal tracking-[0.08em] text-[#B99A62]/15 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#F7F0E6]/80 backdrop-blur-sm px-8 py-3 border border-[#B99A62]/30">
              <span className="text-xs sm:text-sm tracking-[0.22em] text-[#5A2630] font-semibold">
                PAGE NOT FOUND
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#806B5E] leading-relaxed mb-3 max-w-lg mx-auto">
          The page you're looking for seems to have slipped away like silk through fingers.
        </p>
        <p className="text-sm text-[#806B5E]/70 mb-2">
          Requested path: <code className="text-xs bg-[#EFE2D1] px-2 py-0.5 rounded font-mono text-[#5A2630]">{location.pathname}</code>
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px bg-[#B99A62]/30 w-20" />
          <Sparkles className="w-4 h-4 text-[#B99A62]" />
          <div className="h-px bg-[#B99A62]/30 w-20" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group flex items-center gap-2.5 px-8 py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-semibold tracking-[0.16em] hover:bg-[#5A2630] transition-all duration-300 whitespace-nowrap"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            RETURN HOME
          </Link>

          <Link
            to="/shop"
            className="group flex items-center gap-2.5 px-8 py-3.5 border border-[#B99A62] text-[#33221C] text-xs font-semibold tracking-[0.16em] hover:bg-[#B99A62] hover:text-[#33221C] transition-all duration-300 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            BROWSE BOUTIQUE
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-[#B99A62]/20">
          <p className="text-[11px] tracking-[0.18em] text-[#806B5E] font-medium mb-5">
            POPULAR DESTINATIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Sarees', to: '/sarees' },
              { label: 'Jewelry', to: '/jewelry' },
              { label: 'Collections', to: '/shop' },
              { label: 'Our Story', to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-xs tracking-[0.1em] text-[#5A2630] bg-[#EFE2D1]/60 border border-[#B99A62]/20 hover:border-[#B99A62]/50 hover:bg-[#EFE2D1] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
