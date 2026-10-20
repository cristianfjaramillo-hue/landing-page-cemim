async function checkPreview() {
  const url = 'https://drive.google.com/file/d/1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5/preview';
  const res = await fetch(url);
  console.log('Preview Status:', res.status);
  console.log('X-Frame-Options:', res.headers.get('x-frame-options'));
  console.log('Content-Security-Policy:', res.headers.get('content-security-policy'));
}
checkPreview();
