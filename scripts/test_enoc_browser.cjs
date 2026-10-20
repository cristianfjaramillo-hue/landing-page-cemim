async function testEnoc() {
  const url = 'https://drive.usercontent.google.com/download?id=1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG&export=download';

  console.log('Testing GET request for Enoc...');
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://landing-page-cemim.vercel.app/',
      'Origin': 'https://landing-page-cemim.vercel.app',
      'Accept': '*/*'
    }
  });

  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Content-Length:', res.headers.get('content-length'));
  console.log('Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));
}

testEnoc();
