const https = require('https');

async function testDownload() {
  const cleanId = '1vaHojffWxc7Zd9LbXOUVbyEObMIMG0uy';
  const url = `https://drive.google.com/uc?export=download&id=${cleanId}`;
  console.log('Testing download from:', url);

  const res = await fetch(url, { redirect: 'follow' });
  console.log('Status:', res.status, 'Content-Type:', res.headers.get('content-type'), 'Content-Length:', res.headers.get('content-length'));
  const buf = Buffer.from(await res.arrayBuffer());
  console.log('Downloaded bytes:', buf.length, 'Starts with PDF?', buf.subarray(0, 5).toString('ascii'));
}

testDownload();
