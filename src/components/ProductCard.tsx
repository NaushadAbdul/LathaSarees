import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product, resolveAssetUrl } from '../data/catalog';
import { useStore } from '../context/StoreContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlistIds, setQuickViewProduct } = useStore();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);
  const rawImage =
    hovered && product.images.length > 1 ? product.images[1] : product.thumbnail;
  const displayImage = resolveAssetUrl(rawImage);

  return (
    <div
      className="group flex flex-col bg-[#FFFDFC] border border-[#B99A62]/25 transition-transform duration-200 hover:-translate-y-0.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Frame (72% visual priority, 3:4 aspect ratio) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#2C1814]">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {!imgError ? (
            <img
              src={displayImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#4A1C24] to-[#2B1216] text-[#EFE2D1]">
              <span className="font-serif-luxury text-lg tracking-widest text-[#B99A62] mb-1">
                LATHA
              </span>
              <span className="text-xs text-[#EFE2D1]/80">{product.name}</span>
            </div>
          )}
        </Link>

        {/* Maximum 1 subtle badge in top-left matching "NOUVEAU" in reference image */}
        {product.newArrival && (
          <span className="absolute top-3 left-3 bg-[#4A1C24] text-[#F7F0E6] text-[10px] tracking-[0.16em] px-2.5 py-1 font-medium">
            NEW
          </span>
        )}

        {/* Top-right Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center transition-colors ${
            isWishlisted
              ? 'bg-[#4A1C24] text-[#B99A62]'
              : 'bg-[#FFFDFC]/90 text-[#33221C] hover:bg-[#4A1C24] hover:text-[#F7F0E6]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#B99A62]' : ''}`} />
        </button>

        {/* Subtle Bottom Action Strip on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/75 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => addToCart(product, 1, product.colors[0], true)}
            className="flex-1 py-2 px-3 bg-[#4A1C24] text-[#F7F0E6] hover:bg-[#5A2630] text-[11px] font-medium tracking-[0.12em] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            aria-label="Quick view"
            className="p-2 bg-[#FFFDFC] text-[#33221C] hover:bg-[#EFE2D1] transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clean Unboxed Metadata & Centered Editorial Title/Price like Reference */}
      <div className="p-4 text-center flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-[#806B5E] mb-1 truncate">
            <span>{product.subcategory}</span>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            <span>{product.fabric}</span>
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="font-serif-luxury text-lg font-medium text-[#33221C] hover:text-[#5A2630] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 text-sm tabular-nums">
          <span className="font-semibold text-[#33221C]">
            ₹{Number(product.price || 0).toLocaleString('en-IN')}
          </span>
          {Number(product.originalPrice || 0) > Number(product.price || 0) && (
            <>
              <span className="text-xs text-[#806B5E] line-through">
                ₹{Number(product.originalPrice || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-[#5A2630] font-medium">
                {product.discount}% Off
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
