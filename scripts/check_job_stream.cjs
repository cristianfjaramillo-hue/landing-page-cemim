async function checkJobStream() {
  const url = 'https://drive.usercontent.google.com/download?id=1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5&export=download&confirm=t';
  console.log('Fetching head of:', url);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Content-Disposition:', res.headers.get('content-disposition'));
  console.log('Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));
  console.log('Content-Length:', res.headers.get('content-length'));
}

checkJobStream();
