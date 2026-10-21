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
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
  
  if (driveMatch) {
    const fileId = driveMatch[1];
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
 * Returns a server-proxied download URL that forces the browser (especially iOS Safari and Android)
 * to download to disk via application/octet-stream rather than opening in the inline PDF/media viewer.
 */
export function getDownloadUrl(rawUrl, title = '', defaultExt = 'pdf') {
  if (!rawUrl || typeof rawUrl !== 'string') return '#';
  const url = rawUrl.trim();

  let cleanTitle = (title || 'documento')
    .replace(/[^\w\s\u00C0-\u017F.-]/gi, '')
    .trim();

  const ext = defaultExt.replace(/^\./, '');
  if (!cleanTitle.toLowerCase().endsWith(`.${ext}`)) {
    cleanTitle = `${cleanTitle}.${ext}`;
  }

  const category = defaultExt === 'mp3' ? 'audios' : (defaultExt === 'mp4' ? 'videos' : 'libros');

  // Always route through /api/download to guarantee application/octet-stream and Content-Disposition: attachment,
  // preventing iOS Safari from hijacking the navigation and displaying the PDF in-browser.
  return `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(cleanTitle)}&type=${encodeURIComponent(category)}`;
}

/**
 * Client-side robust file download handler for Mobile (iOS Safari & Android) and Desktop.
 * Uses Blob with forced 'application/octet-stream' to trigger native OS download dialogs,
 * with automatic fallback to server streaming endpoint.
 */
export async function downloadFile(fileUrl, title = '', defaultExt = 'pdf', setDownloading = null) {
  if (!fileUrl) return;

  const category = defaultExt === 'mp3' ? 'audios' : (defaultExt === 'mp4' ? 'videos' : 'libros');
  trackMetric('download', category);

  let cleanTitle = (title || 'archivo')
    .replace(/[^\w\s\u00C0-\u017F.-]/gi, '')
    .trim();

  const ext = defaultExt.replace(/^\./, '');
  if (!cleanTitle.toLowerCase().endsWith(`.${ext}`)) {
    cleanTitle = `${cleanTitle}.${ext}`;
  }

  const serverDownloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(cleanTitle)}&type=${category}`;

  if (typeof window === 'undefined') return;

  if (setDownloading) setDownloading(true);

  try {
    // Determine fastest fetch route: direct CDN for Supabase, or /api/download for cross-origin sources
    const fetchUrl = fileUrl.includes('supabase.co/storage/v1/object/public/')
      ? fileUrl
      : serverDownloadUrl;

    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);

    const blob = await response.blob();

    // Force binary octet-stream so iOS Safari and Android cannot render it inline in the tab
    const octetBlob = new Blob([blob], { type: 'application/octet-stream' });
    const blobUrl = window.URL.createObjectURL(octetBlob);

    // Create temporary link and click
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = cleanTitle;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      try {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      } catch (e) {}
      if (setDownloading) setDownloading(false);
    }, 1500);

  } catch (err) {
    console.warn('Direct blob download error, falling back to server download stream:', err);
    if (setDownloading) setDownloading(false);
    // Fallback: navigate directly to server download endpoint with application/octet-stream
    window.location.href = serverDownloadUrl;
  }
}

/**
 * Sends a lightweight analytics event to record page views or downloads
 * @param {'page_view' | 'download'} type
 * @param {'libros' | 'audios' | 'videos'} [category]
 */
export function trackMetric(type, category = 'libros') {
  try {
    if (typeof window !== 'undefined') {
      const payload = JSON.stringify({ type, category });
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', blob);
      } else {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    }
  } catch (e) {
    // Non-blocking telemetry
  }
}
