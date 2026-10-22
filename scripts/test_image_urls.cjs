const testId = '1poDxyuT-OJYaqYCacLntdfrXOcEgbtIj'; // PORTADA 3.png

async function testUrls() {
  const urls = [
    `https://drive.google.com/thumbnail?id=${testId}&sz=w1000`,
    `https://lh3.googleusercontent.com/d/${testId}=w1000`,
    `https://drive.usercontent.google.com/download?id=${testId}&export=view`,
    `https://drive.google.com/uc?export=view&id=${testId}`
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      console.log('--- URL:', u);
      console.log('Status:', res.status, 'Content-Type:', res.headers.get('content-type'), 'Length:', res.headers.get('content-length'));
    } catch (e) {
      console.log('--- URL:', u, 'Error:', e.message);
    }
  }
}
testUrls();
