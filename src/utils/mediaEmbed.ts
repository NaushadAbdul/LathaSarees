// Helper utility for parsing and embedding media links (Direct MP4/Image, Pinterest Pins, YouTube, Vimeo)

export interface MediaInfo {
  type: 'video' | 'image' | 'pinterest' | 'youtube' | 'vimeo';
  embedUrl?: string;
  pinId?: string;
  isDirectMedia: boolean;
}

export function extractPinterestPinId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();
  const pinMatch = clean.match(/\/pin\/(\d+)/i) || clean.match(/[?&]id=(\d+)/i);
  return pinMatch && pinMatch[1] ? pinMatch[1] : null;
}

export function isPinterestUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return /pinterest\.[a-z.]+|pin\.it|pinimg\.com/i.test(url);
}

export function parseHeroMedia(
  url: string,
  declaredType?: 'image' | 'video' | 'pinterest'
): MediaInfo {
  if (!url || typeof url !== 'string') {
    return {
      type: declaredType === 'pinterest' ? 'pinterest' : declaredType === 'video' ? 'video' : 'image',
      isDirectMedia: true,
    };
  }

  const clean = url.trim();

  // 1. Check for Pinterest Pin Page (e.g. https://in.pinterest.com/pin/31384528648409924/ or assets.pinterest.com embed)
  const pinId = extractPinterestPinId(clean);
  if (pinId) {
    return {
      type: 'pinterest',
      pinId,
      embedUrl: `https://assets.pinterest.com/ext/embed.html?id=${pinId}`,
      isDirectMedia: false,
    };
  }

  // 2. Direct video file (MP4, WebM, MOV, or Pinterest raw video CDN)
  if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(clean) || clean.includes('v1.pinimg.com/videos/')) {
    return { type: 'video', isDirectMedia: true };
  }

  // 3. YouTube link
  const ytMatch = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0`,
      isDirectMedia: false,
    };
  }

  // 4. Vimeo link
  const vimeoMatch = clean.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&loop=1&muted=1&background=1`,
      isDirectMedia: false,
    };
  }

  // 5. Direct image file, data URL, blob, or Pinterest raw image CDN
  if (
    /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(clean) ||
    clean.startsWith('data:image/') ||
    clean.startsWith('blob:') ||
    clean.includes('i.pinimg.com/')
  ) {
    return { type: 'image', isDirectMedia: true };
  }

  // Fallback to declared type
  if (declaredType === 'pinterest') {
    return { type: 'pinterest', isDirectMedia: false };
  }
  if (declaredType === 'video') {
    return { type: 'video', isDirectMedia: true };
  }
  return { type: 'image', isDirectMedia: true };
}
