async function findParent() {
  const fileId = '1EhOWotbcCYxc3v3qwYDrCCXE0hgmELfp';
  const url = `https://drive.google.com/file/d/${fileId}/view`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Look for "GRUPO" or folder in html
  let p = 0;
  while ((p = html.toLowerCase().indexOf('grupo', p)) !== -1) {
    console.log('Found GRUPO at', p, ':', html.substring(Math.max(0, p - 60), Math.min(html.length, p + 100)));
    p += 5;
  }
}
findParent().catch(console.error);
