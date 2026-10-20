import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const name = searchParams.get('name') || 'documento.pdf';

    if (!url) {
      return new Response('Parámetro URL requerido', { status: 400 });
    }

    const cleanName = (name || 'documento')
      .replace(/[^\w\s\u00C0-\u017F.-]/gi, '')
      .trim();

    const filename = cleanName.toLowerCase().endsWith('.pdf')
      ? cleanName
      : `${cleanName}.pdf`;

    // 1. Supabase Storage: redirect directly with ?download=
    if (url.includes('supabase.co/storage/v1/object/public/')) {
      const base = url.replace(/[?&]download=[^&]*/, '');
      const sep = base.includes('?') ? '&' : '?';
      return NextResponse.redirect(`${base}${sep}download=${encodeURIComponent(filename)}`);
    }

    // 2. Google Drive: redirect to direct export download
    const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
    if (driveMatch) {
      const fileId = driveMatch[1];
      return NextResponse.redirect(`https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`);
    }

    // 3. Fallback: Fetch and stream with attachment headers
    const upstreamRes = await fetch(url);
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', upstreamRes.headers.get('content-type') || 'application/pdf');

    if (upstreamRes.headers.get('content-length')) {
      headers.set('Content-Length', upstreamRes.headers.get('content-length'));
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
