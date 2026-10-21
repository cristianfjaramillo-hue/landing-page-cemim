import { NextResponse } from 'next/server';
import { recordMetricEvent } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const name = searchParams.get('name') || 'documento.pdf';
    const typeParam = searchParams.get('type');

    if (!url) {
      return new Response('Parámetro URL requerido', { status: 400 });
    }

    const cleanName = (name || 'documento')
      .replace(/[^\w\s\u00C0-\u017F.-]/gi, '')
      .trim();

    const isAudio = cleanName.toLowerCase().endsWith('.mp3') || typeParam === 'audios';
    const isVideo = cleanName.toLowerCase().endsWith('.mp4') || typeParam === 'videos';
    const category = isAudio ? 'audios' : (isVideo ? 'videos' : 'libros');

    // Asynchronously record download metric without blocking the response
    recordMetricEvent('download', category).catch(() => {});

    const filename = cleanName.toLowerCase().endsWith('.pdf') || isAudio || isVideo
      ? cleanName
      : `${cleanName}.pdf`;

    // 1. Google Drive direct export URL
    let targetUrl = url;
    const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
    if (driveMatch) {
      targetUrl = `https://drive.usercontent.google.com/download?id=${driveMatch[1]}&export=download&confirm=t`;
    }

    // 2. Fetch upstream file (from Supabase Storage CDN or Google Drive)
    const upstreamRes = await fetch(targetUrl);
    if (!upstreamRes.ok) {
      return new Response(`Error al obtener archivo del almacenamiento: ${upstreamRes.statusText}`, {
        status: upstreamRes.status
      });
    }

    const headers = new Headers();
    // CRITICAL FOR IOS SAFARI & ANDROID:
    // When Content-Type is 'application/pdf', iOS Safari completely overrides Content-Disposition: attachment
    // and displays the PDF inside the browser window.
    // By forcing 'application/octet-stream', iOS Safari cannot preview the document and is forced to display
    // the native download confirmation dialog: "¿Deseas descargar 'archivo.pdf'?" saving directly to Files.
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
    headers.set('Access-Control-Allow-Origin', '*');

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
