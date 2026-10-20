/**
 * CEMIM - Media Utility Helper
 * Normalizes media URLs for seamless HTML5 audio & video playback, and direct downloads
 */

export function getStreamableMediaUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim();

  // If already pointing to our internal stream endpoint
  if (url.startsWith('/api/audio-stream')) return url;

  // Match Google Drive ID from any format:
  // - https://drive.google.com/file/d/ID/view?usp=sharing
  // - https://drive.google.com/file/d/ID/view
  // - https://drive.google.com/open?id=ID
  // - https://drive.google.com/uc?id=ID
  // - https://drive.usercontent.google.com/download?id=ID
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
  
  if (driveMatch) {
    const fileId = driveMatch[1];
    // Route through our dedicated streaming endpoint with Range/seeking support and automatic bypass of Google Drive virus scan warnings
    return `/api/audio-stream?id=${fileId}`;
  }

  return url;
}

export function getDriveEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  return '';
}

/**
 * Returns a direct download URL that forces the browser to download to disk
 * immediately without opening the PDF/file in browser viewer tabs.
 */
export function getDownloadUrl(rawUrl, title = '', defaultExt = 'pdf') {
  if (!rawUrl || typeof rawUrl !== 'string') return '#';
  const url = rawUrl.trim();

  // Sanitize title for filename
  let cleanTitle = (title || 'documento')
    .replace(/[^\w\s\u00C0-\u017F.-]/gi, '')
    .trim();

  const ext = defaultExt.replace(/^\./, '');
  if (!cleanTitle.toLowerCase().endsWith(`.${ext}`)) {
    cleanTitle = `${cleanTitle}.${ext}`;
  }

  // 1. Supabase Storage public URLs support ?download=filename natively
  // which instructs Supabase to send Content-Disposition: attachment
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    const base = url.replace(/[?&]download=[^&]*/, '');
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}download=${encodeURIComponent(cleanTitle)}`;
  }

  // 2. Google Drive links -> usercontent export download with confirmation
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  }

  // 3. Fallback to server download endpoint
  return `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(cleanTitle)}`;
}
