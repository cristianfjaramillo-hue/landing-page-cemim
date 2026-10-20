async function checkCorsAndAudio() {
  const url = 'https://drive.usercontent.google.com/download?id=1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG&export=download';
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
}

checkCorsAndAudio();
