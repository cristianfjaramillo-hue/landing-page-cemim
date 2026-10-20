async function testRangeStreaming() {
  const id = '1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5';
  
  // 1. Get resolved target URL
  const initialUrl = `https://drive.google.com/uc?export=download&id=${id}`;
  const res1 = await fetch(initialUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });

  const html = await res1.text();
  const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
  const confirmMatch = html.match(/name="confirm"\s+value="([^"]+)"/);
  const cookies = res1.headers.get('set-cookie');
  const uuid = uuidMatch ? uuidMatch[1] : '';
  const confirm = confirmMatch ? confirmMatch[1] : 't';
  const targetUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=${confirm}&uuid=${uuid}`;

  // 2. Request Range: bytes=1000000-2000000 (seeking)
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Range': 'bytes=1000000-2000000'
  };
  if (cookies) headers['Cookie'] = cookies.split(';')[0];

  const rangeRes = await fetch(targetUrl, { headers });
  console.log('Range status:', rangeRes.status);
  console.log('Content-Type:', rangeRes.headers.get('content-type'));
  console.log('Content-Range:', rangeRes.headers.get('content-range'));
  console.log('Content-Length:', rangeRes.headers.get('content-length'));
}

testRangeStreaming();
