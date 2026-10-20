async function testStreamProxy() {
  const id = '1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5';
  console.log('Testing server-side stream resolution for ID:', id);

  const initialUrl = `https://drive.google.com/uc?export=download&id=${id}`;
  const res1 = await fetch(initialUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const cType = res1.headers.get('content-type') || '';
  console.log('Initial status:', res1.status, 'Content-Type:', cType);

  let targetUrl = initialUrl;
  let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  if (cType.includes('text/html')) {
    const html = await res1.text();
    const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
    const confirmMatch = html.match(/name="confirm"\s+value="([^"]+)"/);
    const cookies = res1.headers.get('set-cookie');
    if (cookies) {
      headers['Cookie'] = cookies.split(';')[0];
    }
    const uuid = uuidMatch ? uuidMatch[1] : '';
    const confirm = confirmMatch ? confirmMatch[1] : 't';
    targetUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=${confirm}&uuid=${uuid}`;
    console.log('Resolved target URL with UUID:', targetUrl);
  }

  const streamRes = await fetch(targetUrl, { headers });
  console.log('Stream status:', streamRes.status);
  console.log('Stream Content-Type:', streamRes.headers.get('content-type'));
  console.log('Stream Content-Length:', streamRes.headers.get('content-length'));

  const reader = streamRes.body.getReader();
  const { value } = await reader.read();
  reader.cancel();
  console.log('Successfully read first chunk of bytes:', value?.length, 'isMP3:', Buffer.from(value?.subarray(0, 3)).toString('ascii') === 'ID3');
}

testStreamProxy();
