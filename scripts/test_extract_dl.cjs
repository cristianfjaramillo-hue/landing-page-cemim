async function testExtractAndDl() {
  const id = '1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5';
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  
  console.log('Fetching initial warning page...');
  const res1 = await fetch(url);
  const cookies = res1.headers.get('set-cookie');
  const html = await res1.text();

  // Match inputs
  const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
  const confirmMatch = html.match(/name="confirm"\s+value="([^"]+)"/);
  const actionMatch = html.match(/action="([^"]+)"/);

  console.log('UUID:', uuidMatch ? uuidMatch[1] : 'none');
  console.log('Confirm:', confirmMatch ? confirmMatch[1] : 'none');
  console.log('Action:', actionMatch ? actionMatch[1] : 'none');

  if (uuidMatch) {
    const finalUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=${confirmMatch ? confirmMatch[1] : 't'}&uuid=${uuidMatch[1]}`;
    console.log('Download URL:', finalUrl);

    const headers = {};
    if (cookies) {
      headers['Cookie'] = cookies.split(';')[0];
    }
    const res2 = await fetch(finalUrl, { headers });
    console.log('Final download status:', res2.status, 'Content-Type:', res2.headers.get('content-type'), 'Content-Length:', res2.headers.get('content-length'));
    
    // Read first chunk to verify audio
    const reader = res2.body.getReader();
    const { value } = await reader.read();
    reader.cancel();
    console.log('Read first bytes:', value?.length, 'Buffer prefix (hex):', Buffer.from(value?.subarray(0, 4)).toString('hex'));
  }
}

testExtractAndDl();
