import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore, DEFAULT_HERO_SLIDES } from '../context/StoreContext';
import { BRAND_IMAGES, CURATED_COLLECTIONS, TESTIMONIALS } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { LotusOrnament } from '../components/Navbar';
import { parseHeroMedia } from '../utils/mediaEmbed';

const HERO_SLIDES = [
  {
    id: 0,
    titleLine1: 'HEIRLOOM SILK',
    titleLine2: 'DRAPES,',
    subtitleGold: 'HANDWOVEN IN KANCHIPURAM & KASHI.',
    kicker: 'PURE MULBERRY SILK · KORVAI ZARI · BRIDAL TROUSSEAU',
    description:
      'Each saree in the Latha archive is selected directly from master weaver looms for its lustrous drape and architectural gold zari.',
    image: BRAND_IMAGES.sareeBanarasiCrimson,
    primaryCtaText: 'SHOP SAREES',
    primaryCtaLink: '/sarees',
    secondaryCtaText: 'BRIDAL EDIT',
    secondaryCtaLink: '/collections/wedding-collection',
  },
  {
    id: 1,
    titleLine1: 'SACRED TEMPLE',
    titleLine2: 'JEWELRY,',
    subtitleGold: 'SCULPTED IN ANTIQUE GOLD & PEARLS.',
    kicker: 'LAKSHMI HARAMS · KEMP JHUMKAS · NIZAM KADAS',
    description:
      'Intricate South Indian Nakshi artistry hand-set with deep Kemp rubies and natural pearl clusters to complete your ceremonial look.',
    image: BRAND_IMAGES.jewelryLakshmiNecklace,
    primaryCtaText: 'EXPLORE JEWELRY',
    primaryCtaLink: '/jewelry',
    secondaryCtaText: 'SHOP JHUMKAS',
    secondaryCtaLink: '/jewelry?sub=Jhumkas',
  },
];

const INSTAGRAM_POSTS = [
  {
    image: BRAND_IMAGES.heroBridal,
    caption: 'Bridal Wine Banarasi & Lakshmi Haram styling',
  },
  {
    image: BRAND_IMAGES.sareeBanarasiCrimson,
    caption: 'Intricate Kadwa gold zari pallu detail',
  },
  {
    image: BRAND_IMAGES.jewelryTempleJhumka,
    caption: 'Handcrafted Kemp ruby & pearl temple jhumkas',
  },
  {
    image: BRAND_IMAGES.sareeKanchipuramEmerald,
    caption: 'Emerald Korvai Kanchipuram pure silk portrait',
  },
  {
    image: BRAND_IMAGES.jewelryLakshmiNecklace,
    caption: 'Maharani Goddess Lakshmi Nakshi necklace closeup',
  },
  {
    image: BRAND_IMAGES.jewelryKundanBangles,
    caption: 'Nizam filigree & Kundan pearl hinged kadas',
  },
];

export const Home: React.FC = () => {
  const { products, settings } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  // Dynamic slides supporting customization for ALL slides from settings.heroSlides
  const slides = useMemo(() => {
    if (settings.heroSlides && settings.heroSlides.length > 0) {
      return settings.heroSlides;
    }
    return [
      {
        ...HERO_SLIDES[0],
        mediaType: 'video' as const,
        mediaUrl: BRAND_IMAGES.sareesVideo,
      },
      {
        ...HERO_SLIDES[1],
        mediaType: 'video' as const,
        mediaUrl: BRAND_IMAGES.jewelryVideo,
      },
    ];
  }, [settings]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentHero = slides[activeSlide] || slides[0];
  const curatedProducts = products.slice(0, 5);

  return (
    <div className="bg-[#F7F0E6] text-[#33221C]">
      {/* ==================================================
          1. CINEMATIC HERO SECTION (Reference Inspired)
      ================================================== */}
      <section className="relative overflow-hidden bg-[#EFE2D1] border-b border-[#B99A62]/35">
        <div className="max-w-[1440px] mx-auto relative min-h-[520px] lg:min-h-[620px] flex flex-col lg:flex-row">
          {/* Left Decorative Indian Palace / Tapestry Border Pillar */}
          <div
            aria-hidden="true"
            className="hidden sm:flex w-12 lg:w-16 bg-[#4A1C24] border-r-2 border-[#B99A62] flex-col items-center justify-between py-6 shrink-0 select-none"
          >
            <div className="w-6 h-6 rounded-full border border-[#B99A62]/60 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#B99A62]" />
            </div>
            <div className="flex flex-col items-center gap-6 text-[#B99A62]/70">
              <LotusOrnament className="w-8 h-5 rotate-90" />
              <div className="w-px h-16 bg-[#B99A62]/40" />
              <LotusOrnament className="w-8 h-5 -rotate-90" />
              <div className="w-px h-16 bg-[#B99A62]/40" />
              <LotusOrnament className="w-8 h-5 rotate-90" />
            </div>
            <div className="w-6 h-6 rounded-full border border-[#B99A62]/60 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#B99A62]" />
            </div>
          </div>

          {/* Main Split Hero Content & Editorial Media */}
          <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Background Media on Desktop Right / Full Bleed */}
            <div className="lg:col-span-12 lg:absolute lg:inset-0 overflow-hidden bg-[#2C1814]">
              {(() => {
                const mediaInfo = parseHeroMedia(currentHero.mediaUrl, currentHero.mediaType as any);

                if (mediaInfo.type === 'pinterest' && mediaInfo.pinId) {
                  return (
                    <div className="w-full h-[400px] sm:h-[480px] lg:h-full flex items-center justify-center lg:justify-end lg:pr-14 py-4 z-0">
                      <iframe
                        src={`https://assets.pinterest.com/ext/embed.html?id=${mediaInfo.pinId}`}
                        title="Pinterest Showcase"
                        className="w-[280px] sm:w-[320px] lg:w-[360px] h-[390px] sm:h-[460px] lg:h-[580px] border-0 rounded-lg shadow-2xl bg-[#FFFDFC]"
                        scrolling="no"
                        allow="autoplay; encrypted-media"
                      />
                    </div>
                  );
                }

                if (mediaInfo.type === 'youtube' && mediaInfo.embedUrl) {
                  return (
                    <iframe
                      src={mediaInfo.embedUrl}
                      title="YouTube Showcase"
                      className="w-full h-[360px] sm:h-[440px] lg:h-full border-0 object-cover"
                      allow="autoplay; encrypted-media"
                    />
                  );
                }

                if (mediaInfo.type === 'video') {
                  return (
                    <video
                      key={currentHero.mediaUrl}
                      src={currentHero.mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-[360px] sm:h-[440px] lg:h-full object-cover object-top lg:object-right transition-all duration-700"
                    />
                  );
                }

                return (
                  <img
                    src={currentHero.mediaUrl}
                    alt={currentHero.titleLine1}
                    referrerPolicy="no-referrer"
                    className="w-full h-[360px] sm:h-[440px] lg:h-full object-cover object-top lg:object-right transition-all duration-700"
                  />
                );
              })()}
              {/* Soft Warm Ivory Editorial Gradient Scrim on Left for Flawless Text Legibility */}
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#F7F0E6] via-[#F7F0E6]/92 to-transparent w-[55%] pointer-events-none" />
            </div>

            {/* Left Editorial Typography Module */}
            <div className="relative z-10 lg:col-span-7 px-6 sm:px-12 lg:px-16 py-10 lg:py-20 bg-[#F7F0E6] lg:bg-transparent">
              {/* Subtle Scalloped Top-Left Arch Corner Accent */}
              <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#5A2630] font-medium mb-4">
                <span>LATHA SAREES & JEWELRY</span>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] font-normal tracking-[0.04em] text-[#33221C] text-balance">
                <span className="block">{currentHero.titleLine1}</span>
                <span className="block">{currentHero.titleLine2}</span>
                <span className="block text-[#B99A62] mt-1 font-medium">
                  {currentHero.subtitleGold}
                </span>
              </h1>

              {/* Unboxed Metadata Kicker Line */}
              <p className="mt-5 text-[11px] sm:text-xs tracking-[0.18em] text-[#33221C] font-medium">
                {currentHero.kicker}
              </p>

              <p className="mt-3 text-sm text-[#806B5E] max-w-lg leading-relaxed">
                {currentHero.description}
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={currentHero.primaryCtaLink}
                  className="px-7 py-3.5 bg-[#4A1C24] text-[#F7F0E6] text-xs font-medium tracking-[0.18em] hover:bg-[#5A2630] transition-colors whitespace-nowrap"
                >
                  {currentHero.primaryCtaText}
                </Link>
                <Link
                  to={currentHero.secondaryCtaLink}
                  className="px-6 py-3.5 border border-[#4A1C24] text-[#4A1C24] text-xs font-medium tracking-[0.18em] hover:bg-[#4A1C24] hover:text-[#F7F0E6] transition-colors whitespace-nowrap"
                >
                  {currentHero.secondaryCtaText}
                </Link>
              </div>
            </div>
          </div>

          {/* Left (<) Navigation Arrow Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-6 lg:left-20 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFDFC]/90 hover:bg-[#4A1C24] text-[#4A1C24] hover:text-[#F7F0E6] border border-[#B99A62]/60 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 -ml-0.5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Right (>) Navigation Arrow Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFDFC]/90 hover:bg-[#4A1C24] text-[#4A1C24] hover:text-[#F7F0E6] border border-[#B99A62]/60 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Slide Selector Controls at Bottom Center with < [Dots] > */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[#2C1814]/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#B99A62]/40 shadow-md">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="text-[#F7F0E6]/80 hover:text-[#B99A62] transition-colors p-0.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id ?? idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`View hero slide ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full border border-[#B99A62] transition-all cursor-pointer ${
                    activeSlide === idx ? 'bg-[#B99A62] scale-125' : 'bg-[#F7F0E6]/40 hover:bg-[#B99A62]/70'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="text-[#F7F0E6]/80 hover:text-[#B99A62] transition-colors p-0.5 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. CURATED FAVORITES ("OUR CURATED EDIT")
      ================================================== */}
      <section className="py-10 sm:py-14 px-4 sm:px-8 max-w-[1360px] mx-auto">
        {/* Ornamental Header with Gold Hairlines & Lotus */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-6">
            <div className="h-px bg-[#B99A62]/45 flex-1 max-w-xs" />
            <h2 className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.16em] text-[#33221C] font-normal">
              OUR CURATED EDIT
            </h2>
            <div className="h-px bg-[#B99A62]/45 flex-1 max-w-xs" />
          </div>
          <div className="flex justify-center mt-2 text-[#B99A62]">
            <LotusOrnament className="w-9 h-5" />
          </div>
        </div>

        {/* 5-Column Luxury Product Showcase matching Reference Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {curatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Centered Outlined CTA Button */}
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-block px-9 py-3 border border-[#33221C] text-[#33221C] text-xs font-medium tracking-[0.18em] hover:bg-[#4A1C24] hover:border-[#4A1C24] hover:text-[#F7F0E6] transition-colors whitespace-nowrap"
          >
            VIEW ENTIRE BOUTIQUE
          </Link>
        </div>
      </section>

      {/* ==================================================
          4. WHY SHOP WITH LATHA (4-Column Trust Strip)
      ================================================== */}
      <section className="bg-[#EFE2D1] border-y border-[#B99A62]/30 py-10 px-4 sm:px-8 mt-6">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#B99A62]/30">
          <div className="px-6 py-4 flex flex-col items-center text-center">
            <LotusOrnament className="w-10 h-6 text-[#B99A62] mb-3" />
            <h3 className="text-xs font-semibold tracking-[0.16em] text-[#33221C]">
              PREMIUM QUALITY
            </h3>
            <p className="text-xs text-[#806B5E] mt-1.5 max-w-[220px]">
              Curated pure silk handloom sarees and handcrafted temple jewelry
            </p>
          </div>

          <div className="px-6 py-4 flex flex-col items-center text-center">
            <Truck className="w-6 h-6 text-[#B99A62] stroke-[1.5] mb-3" />
            <h3 className="text-xs font-semibold tracking-[0.16em] text-[#33221C]">
              COMPLIMENTARY SHIPPING
            </h3>
            <p className="text-xs text-[#806B5E] mt-1.5 max-w-[220px]">
              Insured doorstep delivery across India on orders above ₹2,999
            </p>
          </div>

          <div className="px-6 py-4 flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-[#B99A62] stroke-[1.5] mb-3" />
            <h3 className="text-xs font-semibold tracking-[0.16em] text-[#33221C]">
              SECURE PAYMENTS
            </h3>
            <p className="text-xs text-[#806B5E] mt-1.5 max-w-[220px]">
              Safe checkout with UPI, Cards, NetBanking & Cash on Delivery
            </p>
          </div>

          <div className="px-6 py-4 flex flex-col items-center text-center">
            <Headphones className="w-6 h-6 text-[#B99A62] stroke-[1.5] mb-3" />
            <h3 className="text-xs font-semibold tracking-[0.16em] text-[#33221C]">
              BOUTIQUE SUPPORT
            </h3>
            <p className="text-xs text-[#806B5E] mt-1.5 max-w-[220px]">
              Personal assistance via Phone & WhatsApp at +91 7036623624
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. SPLIT PROMOTIONAL COLLECTION BANNERS (Reference Inspired)
      ================================================== */}
      <section className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 border-b border-[#B99A62]/30">
        {/* Left Banner: SAREES */}
        <div className="relative h-[340px] sm:h-[400px] overflow-hidden group bg-[#3D161E] border-b lg:border-b-0 lg:border-r border-[#B99A62]/40">
          <img
            src={BRAND_IMAGES.sareeBanarasiCrimson}
            alt="Latha Sarees Collection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-75 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3D161E]/95 via-[#3D161E]/65 to-transparent" />

          <div className="absolute inset-0 p-8 sm:p-14 flex flex-col justify-center items-start max-w-md">
            <span className="text-xs tracking-[0.22em] text-[#B99A62] font-medium">
              COLLECTION
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl tracking-[0.1em] text-[#F7F0E6] mt-1">
              SAREES
            </h2>
            <p className="text-xs sm:text-sm text-[#EFE2D1]/90 mt-3 leading-relaxed">
              Timeless Banarasi, Kanchipuram, and silk-organza drapes crafted for modern celebrations.
            </p>
            <Link
              to="/sarees"
              className="mt-6 px-6 py-2.5 bg-[#B99A62] text-[#33221C] text-xs font-semibold tracking-[0.16em] hover:bg-[#c9ab74] transition-colors whitespace-nowrap"
            >
              EXPLORE SAREES
            </Link>
          </div>
        </div>

        {/* Right Banner: JEWELRY */}
        <div className="relative h-[340px] sm:h-[400px] overflow-hidden group bg-[#2A150E]">
          <img
            src={BRAND_IMAGES.jewelryTempleJhumka}
            alt="Latha Indian Jewelry Collection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-80 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A150E]/95 via-[#2A150E]/65 to-transparent" />

          <div className="absolute inset-0 p-8 sm:p-14 flex flex-col justify-center items-start max-w-md">
            <span className="text-xs tracking-[0.22em] text-[#B99A62] font-medium">
              HEIRLOOM CRAFT
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl tracking-[0.1em] text-[#F7F0E6] mt-1">
              INDIAN JEWELRY
            </h2>
            <p className="text-xs sm:text-sm text-[#EFE2D1]/90 mt-3 leading-relaxed">
              Temple jhumkas, Lakshmi necklaces, and handcrafted kadas that complete every occasion.
            </p>
            <Link
              to="/jewelry"
              className="mt-6 px-6 py-2.5 bg-[#B99A62] text-[#33221C] text-xs font-semibold tracking-[0.16em] hover:bg-[#c9ab74] transition-colors whitespace-nowrap"
            >
              EXPLORE JEWELRY
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. FEATURED CURATED COLLECTIONS ("THE EDIT")
      ================================================== */}
      <section className="py-16 px-4 sm:px-8 max-w-[1360px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#5A2630] font-medium">
              CURATED FOR YOU
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#33221C] mt-1">
              Signature Seasonal Edits
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs tracking-[0.16em] text-[#5A2630] font-medium hover:underline flex items-center gap-1.5"
          >
            DISCOVER ALL COLLECTIONS <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              to={`/collections/${col.slug}`}
              className="group relative aspect-[3/4] overflow-hidden border border-[#B99A62]/30 bg-[#2C1814] flex flex-col justify-end"
            >
              <img
                src={col.image}
                alt={col.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="relative z-10 p-6 text-[#F7F0E6]">
                <p className="text-[11px] tracking-[0.16em] text-[#B99A62]">
                  {col.subtitle}
                </p>
                <h3 className="font-serif-luxury text-2xl mt-1">{col.title}</h3>
                <p className="text-xs text-[#EFE2D1]/80 mt-2 line-clamp-2">
                  {col.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-[#B99A62] font-medium mt-4">
                  DISCOVER COLLECTION →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================
          7. EDITORIAL BRAND STORY & PATRON REVIEWS
      ================================================== */}
      <section className="bg-[#EFE2D1]/60 border-y border-[#B99A62]/25 py-16 px-4 sm:px-8">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] border border-[#B99A62]/40 p-2 bg-[#FFFDFC]">
              <img
                src={BRAND_IMAGES.sareeKanchipuramEmerald}
                alt="Crafted with Tradition at Latha Sarees & Jewelry"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-[#5A2630] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#B99A62]" />
              <span>THE HOUSE OF LATHA</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#33221C] leading-tight text-balance">
              Crafted With Tradition. Curated For Today.
            </h2>

            <p className="text-sm sm:text-base text-[#806B5E] leading-relaxed">
              At <strong className="text-[#33221C] font-medium">Latha Sarees & Jewelry</strong>, we believe every celebration deserves an heirloom. Our sarees are sourced from heritage handloom clusters in Varanasi and Kanchipuram, while our temple jewelry honors centuries-old South Indian Nakshi and Kemp craftsmanship.
            </p>

            {/* Attributable Patron Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="p-5 bg-[#FFFDFC] border border-[#B99A62]/25 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-[#B99A62] mb-2">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#B99A62]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#33221C] leading-relaxed italic">
                      “{t.quote}”
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#B99A62]/15 text-[11px]">
                    <p className="font-semibold text-[#33221C]">{t.author}</p>
                    <p className="text-[#806B5E]">{t.role} · Verified Purchase</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          8. INSTAGRAM / SOCIAL LOOKBOOK GRID (Reference Inspired)
      ================================================== */}
      <section className="py-16 px-4 sm:px-8 max-w-[1360px] mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-6">
            <div className="h-px bg-[#B99A62]/45 flex-1 max-w-xs" />
            <h2 className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.16em] text-[#33221C] font-normal">
              FOLLOW THE LATHA EDIT
            </h2>
            <div className="h-px bg-[#B99A62]/45 flex-1 max-w-xs" />
          </div>
          <div className="flex justify-center mt-2 text-[#B99A62]">
            <LotusOrnament className="w-9 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <a
              key={idx}
              href="https://wa.me/917036623624?text=Hello%20Latha%20Sarees%20%2F%20Jewelry%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden border border-[#B99A62]/30 bg-[#2C1814]"
            >
              <img
                src={post.image}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                <span className="text-[11px] text-[#F7F0E6] leading-snug">
                  {post.caption}
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://wa.me/917036623624?text=Hello%20Latha%20Sarees%20%2F%20Jewelry%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-2.5 border border-[#33221C] text-[#33221C] text-xs font-medium tracking-[0.16em] hover:bg-[#4A1C24] hover:border-[#4A1C24] hover:text-[#F7F0E6] transition-colors"
          >
            @LATHA.SAREES.JEWELRY
          </a>
        </div>
      </section>
    </div>
  );
};
