import { NextResponse } from 'next/server';
import { recordMetricEvent } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get('url');
    const name = searchParams.get('name') || 'archivo';
    const typeParam = searchParams.get('type');

    if (!rawUrl) {
      return new Response('Parámetro URL requerido', { status: 400 });
    }

    let cleanName = (name || 'archivo')
      .replace(/[^\w\s\u00C0-\u017F.-]/gi, '')
      .trim();

    const isAudio = cleanName.toLowerCase().endsWith('.mp3') || typeParam === 'audios';
    const isVideo = cleanName.toLowerCase().endsWith('.mp4') || typeParam === 'videos';
    const category = isAudio ? 'audios' : (isVideo ? 'videos' : 'libros');

    // Asynchronously record download metric without blocking the response
    recordMetricEvent('download', category).catch(() => {});

    const expectedExt = isAudio ? '.mp3' : (isVideo ? '.mp4' : '.pdf');
    if (!cleanName.toLowerCase().endsWith(expectedExt)) {
      cleanName = `${cleanName}${expectedExt}`;
    }
    const filename = cleanName;

    // 1. Detect and resolve Google Drive File ID from any possible URL format
    let targetUrl = rawUrl.trim();
    const driveMatch = targetUrl.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=|audio-stream\?id=|[?&]id=)([a-zA-Z0-9_-]{20,})/);

    let fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    if (driveMatch) {
      const fileId = driveMatch[1];
      targetUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
    } else if (targetUrl.startsWith('/')) {
      // Relative URL fallback: resolve against current origin
      targetUrl = new URL(targetUrl, request.url).toString();
    }

    // 2. Fetch upstream file (from Supabase Storage CDN or Google Drive)
    let upstreamRes = await fetch(targetUrl, {
      headers: fetchHeaders,
      redirect: 'follow'
    });

    // If Google returned an HTML page (e.g. virus scan confirmation for large files > 100MB)
    const cType = upstreamRes.headers.get('content-type') || '';
    if (cType.includes('text/html') && driveMatch) {
      const fileId = driveMatch[1];
      const html = await upstreamRes.text();
      const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
      const confirmMatch = html.match(/name="confirm"\s+value="([^"]+)"/);
      const cookies = upstreamRes.headers.get('set-cookie');

      if (cookies) {
        fetchHeaders['Cookie'] = cookies.split(';')[0];
      }
      const uuid = uuidMatch ? uuidMatch[1] : '';
      const confirm = confirmMatch ? confirmMatch[1] : 't';
      const confirmedUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=${confirm}&uuid=${uuid}`;

      upstreamRes = await fetch(confirmedUrl, {
        headers: fetchHeaders,
        redirect: 'follow'
      });
    }

    if (!upstreamRes.ok) {
      return new Response(`Error al obtener archivo del almacenamiento: ${upstreamRes.statusText}`, {
        status: upstreamRes.status
      });
    }

    const headers = new Headers();
    // Force application/octet-stream to prevent iOS Safari from hijacking the navigation and displaying the PDF/media in-browser.
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Accept-Ranges', 'bytes');

    const contentLength = upstreamRes.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new Response(upstreamRes.body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error en /api/download:', error);
    return new Response('Error procesando descarga: ' + error.message, { status: 500 });
  }
}
