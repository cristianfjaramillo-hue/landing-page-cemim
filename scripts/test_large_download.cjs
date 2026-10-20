async function testLargeDownload() {
  const id = '1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5';
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  
  console.log('Step 1: Fetching initial page...');
  const res1 = await fetch(url);
  const cookieHeader = res1.headers.get('set-cookie');
  const html = await res1.text();

  // Extract form action and inputs
  const actionMatch = html.match(/action="([^"]+)"/);
  const formAction = actionMatch ? actionMatch[1] : 'https://drive.usercontent.google.com/download';

  const inputs = {};
  const inputRegex = /<input type="hidden" name="([^"]+)" value="([^"]*)"/g;
  let m;
  while ((m = inputRegex.exec(html)) !== null) {
    inputs[m[1]] = m[2];
  }
  console.log('Form inputs:', inputs);

  const queryParams = new URLSearchParams(inputs).toString();
  const downloadUrl = `${formAction}?${queryParams}`;
  console.log('Step 2: Downloading from:', downloadUrl);

  const headers = {};
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader.split(';')[0];
  }

  const res2 = await fetch(downloadUrl, { headers });
  console.log(`Status: ${res2.status}, Content-Type: ${res2.headers.get('content-type')}, Content-Length: ${res2.headers.get('content-length')}`);
}

testLargeDownload();
