async function testDriveAudioStreaming() {
  const id = '1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG';
  const url = `https://drive.google.com/uc?export=download&id=${id}`;

  console.log('Testing HEAD / Range on:', url);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Range: 'bytes=0-1024'
    },
    redirect: 'follow'
  });

  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Accept-Ranges:', res.headers.get('accept-ranges'));
  console.log('Content-Range:', res.headers.get('content-range'));
  console.log('Content-Length:', res.headers.get('content-length'));
  
  // Also check direct Google usercontent URL
  const directUrl = res.url;
  console.log('Final redirected URL starts with:', directUrl.substring(0, 80));
}

testDriveAudioStreaming();
