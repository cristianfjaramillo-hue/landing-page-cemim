import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const urlParam = searchParams.get('url');

    let fileId = id;
    if (!fileId && urlParam) {
      const match = urlParam.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]{20,})/);
      if (match) fileId = match[1];
    }

    // If it's not a Google Drive ID, and a direct URL was passed, redirect directly to it
    if (!fileId && urlParam) {
      return NextResponse.redirect(urlParam);
    }

    if (!fileId) {
      return new Response('Missing audio ID or URL', { status: 400 });
    }

    // Forward range header if present (for seeking / scrub bar)
    const clientRange = request.headers.get('range');

    // 1. Fetch initial download URL to check if it's direct or requires confirmation (files > 100MB)
    const initialUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const initialRes = await fetch(initialUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const cType = initialRes.headers.get('content-type') || '';
    let targetUrl = initialUrl;
    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    if (clientRange) {
      fetchHeaders['Range'] = clientRange;
    }

    // If Google returned HTML virus scan warning page
    if (cType.includes('text/html')) {
      const html = await initialRes.text();
      const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
      const confirmMatch = html.match(/name="confirm"\s+value="([^"]+)"/);
      const cookies = initialRes.headers.get('set-cookie');

      if (cookies) {
        fetchHeaders['Cookie'] = cookies.split(';')[0];
      }
      const uuid = uuidMatch ? uuidMatch[1] : '';
      const confirm = confirmMatch ? confirmMatch[1] : 't';
      targetUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=${confirm}&uuid=${uuid}`;
    }

    // 2. Fetch the actual audio stream
    const audioRes = await fetch(targetUrl, {
      headers: fetchHeaders,
      redirect: 'follow'
    });

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'audio/mpeg');
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Content-Disposition', 'inline');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Cache-Control', 'public, max-age=86400');

    if (audioRes.headers.get('content-length')) {
      responseHeaders.set('Content-Length', audioRes.headers.get('content-length'));
    }
    if (audioRes.headers.get('content-range')) {
      responseHeaders.set('Content-Range', audioRes.headers.get('content-range'));
    }

    const status = audioRes.status === 206 ? 206 : 200;

    return new Response(audioRes.body, {
      status,
      headers: responseHeaders
    });
  } catch (err) {
    console.error('Audio stream error:', err);
    return new Response('Audio stream error: ' + err.message, { status: 500 });
  }
}
