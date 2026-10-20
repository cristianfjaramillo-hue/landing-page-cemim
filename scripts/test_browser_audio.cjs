async function testBrowserAudioRequest() {
  const url = 'https://drive.usercontent.google.com/download?id=1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5&export=download&confirm=t';

  console.log('Testing GET request simulating browser audio element...');
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://landing-page-cemim.vercel.app/',
      'Origin': 'https://landing-page-cemim.vercel.app',
      'Accept': '*/*',
      'Range': 'bytes=0-'
    },
    redirect: 'manual'
  });

  console.log('Status:', res.status);
  console.log('Location:', res.headers.get('location'));
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Content-Length:', res.headers.get('content-length'));
  console.log('Set-Cookie:', res.headers.get('set-cookie'));
  console.log('Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));

  // What if redirected?
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get('location');
    console.log('Redirecting to:', loc);
    const res2 = await fetch(loc, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://landing-page-cemim.vercel.app/'
      }
    });
    console.log('Redirect Status:', res2.status, 'Content-Type:', res2.headers.get('content-type'));
  }
}

testBrowserAudioRequest();
