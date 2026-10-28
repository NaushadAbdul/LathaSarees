import { Product, resolveAssetUrl, BRAND_IMAGES } from '../data/catalog';
import { OrderRecord } from '../context/StoreContext';

export interface ResolvedOrderItem {
  raw: string;
  name: string;
  variant: string;
  quantity: number;
  imageUrl: string;
  matchedProduct?: Product;
}

/**
 * Parses and extracts structured items and their corresponding product thumbnails
 * from an order's itemSummary and catalog products list.
 */
export function parseOrderItems(
  itemSummary: string = '',
  products: Product[] = []
): ResolvedOrderItem[] {
  if (!itemSummary || typeof itemSummary !== 'string') return [];

  // Items in itemSummary are delimited by ' · '
  const segments = itemSummary
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) return [];

  return segments.map((seg) => {
    // Expected patterns:
    // "ProductName (Color Variant) × Quantity"
    // "ProductName (Color Variant)"
    // "ProductName × Quantity"
    // "ProductName"
    const regex = /^(.*?)(?:\s*\((.*?)\))?(?:\s*×\s*(\d+))?$/;
    const match = seg.match(regex);

    const name = (match && match[1] ? match[1].trim() : seg).trim();
    const variant = (match && match[2] ? match[2].trim() : '').trim();
    const quantity = match && match[3] ? parseInt(match[3], 10) : 1;

    const lowerName = name.toLowerCase();

    // 1. Exact name match
    let matched = products.find(
      (p) => p.name.trim().toLowerCase() === lowerName
    );

    // 2. Contains match
    if (!matched) {
      matched = products.find(
        (p) =>
          p.name.toLowerCase().includes(lowerName) ||
          lowerName.includes(p.name.toLowerCase())
      );
    }

    // 3. Sanitized alphanumeric match
    if (!matched) {
      const cleanLowerName = lowerName.replace(/[^a-z0-9]/g, '');
      if (cleanLowerName) {
        matched = products.find(
          (p) =>
            p.slug.replace(/[^a-z0-9]/g, '') === cleanLowerName ||
            p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanLowerName
        );
      }
    }

    // 4. Token / keyword match (e.g. matches words with length >= 4)
    if (!matched) {
      const tokens = lowerName.split(/\s+/).filter((t) => t.length >= 4);
      if (tokens.length > 0) {
        matched = products.find((p) => {
          const pLower = p.name.toLowerCase();
          return tokens.some((token) => pLower.includes(token));
        });
      }
    }

    // 5. Category-based fallback if known keywords match
    let resolvedImg = matched?.thumbnail || matched?.images?.[0] || '';
    if (!resolvedImg) {
      if (lowerName.includes('saree') || lowerName.includes('silk') || lowerName.includes('brocade')) {
        resolvedImg = BRAND_IMAGES.sareeBanarasiCrimson;
      } else if (lowerName.includes('neck') || lowerName.includes('jhumka') || lowerName.includes('jewel') || lowerName.includes('bangle')) {
        resolvedImg = BRAND_IMAGES.jewelryTempleJhumka;
      } else {
        resolvedImg = BRAND_IMAGES.heroBridal;
      }
    }

    return {
      raw: seg,
      name: name || 'Boutique Piece',
      variant,
      quantity: isNaN(quantity) || quantity <= 0 ? 1 : quantity,
      imageUrl: resolveAssetUrl(resolvedImg),
      matchedProduct: matched,
    };
  });
}

/**
 * Resolves the primary visual image for an order record.
 */
export function getOrderPrimaryImage(
  order: OrderRecord,
  products: Product[] = []
): string {
  if (order.productImage) {
    return resolveAssetUrl(order.productImage);
  }
  const items = parseOrderItems(order.itemSummary, products);
  return items[0]?.imageUrl || resolveAssetUrl(BRAND_IMAGES.heroBridal);
}
