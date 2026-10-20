/**
 * CEMIM - Media Utility Helper
 * Normalizes media URLs (especially Google Drive links) for direct HTML5 audio & video playback
 */

export function getStreamableMediaUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim();

  // Match Google Drive ID from any format:
  // - https://drive.google.com/file/d/ID/view?usp=sharing
  // - https://drive.google.com/file/d/ID/view
  // - https://drive.google.com/open?id=ID
  // - https://drive.google.com/uc?id=ID
  // - https://drive.google.com/uc?export=download&id=ID
  // - https://drive.usercontent.google.com/download?id=ID
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
  
  if (driveMatch) {
    const fileId = driveMatch[1];
    // This endpoint provides high-speed CDN streaming with Content-Type: audio/mpeg and Access-Control-Allow-Origin: *
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  }

  return url;
}

export function getDriveEmbedUrl(url) {
  if (!url || typeof rawUrl !== 'string') return '';
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  return '';
}
