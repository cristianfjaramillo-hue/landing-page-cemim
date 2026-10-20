async function testAudioDownload() {
  const file1 = { id: '1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG', name: 'Enoc.mp3' };
  const file2 = { id: '1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5', name: 'Job.mp3' };

  for (const f of [file1, file2]) {
    console.log(`Testing download for ${f.name} (ID: ${f.id})...`);
    const url = `https://drive.google.com/uc?export=download&id=${f.id}`;
    const res = await fetch(url, { redirect: 'follow' });
    console.log(`Status: ${res.status}, Content-Type: ${res.headers.get('content-type')}, Content-Length: ${res.headers.get('content-length')}`);
    
    // Check if it's an HTML confirmation page or audio binary
    const cType = res.headers.get('content-type') || '';
    if (cType.includes('text/html')) {
      const html = await res.text();
      console.log(`Received HTML warning page (length ${html.length}). Looking for confirm code...`);
      const confirmMatch = html.match(/confirm=([a-zA-Z0-9_-]+)/) || html.match(/name="confirm"\s+value="([^"]+)"/);
      console.log('Confirm match:', confirmMatch ? confirmMatch[1] : 'none');
      if (confirmMatch) {
        const confirmUrl = `https://drive.google.com/uc?export=download&confirm=${confirmMatch[1]}&id=${f.id}`;
        console.log('Trying with confirm URL...');
        const resConfirm = await fetch(confirmUrl, { redirect: 'follow' });
        console.log(`Confirm status: ${resConfirm.status}, Content-Type: ${resConfirm.headers.get('content-type')}`);
      }
    } else {
      console.log(`Direct audio binary stream!`);
    }
  }
}

testAudioDownload();
