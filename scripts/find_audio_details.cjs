const fs = require('fs');

async function findAudioDetails() {
  const res = await fetch('https://drive.google.com/drive/folders/1HLUEO2kHXZFz7hSITmAVtWYgynH-1BW2?usp=sharing', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  
  // Search for the ID 1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5
  const id1 = '1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5';
  let idx = html.indexOf(id1);
  if (idx !== -1) {
    console.log('--- Context around ID 1 ---');
    console.log(html.substring(Math.max(0, idx - 300), Math.min(html.length, idx + 400)));
  }

  // Look for data-id or drive file items in the HTML
  // Let's find all occurrences of strings like .mp3, .m4a, .wav, or general file extensions
  const extensions = ['.mp3', '.m4a', '.wav', '.ogg', '.aac', '.mp4', '.opus'];
  for (const ext of extensions) {
    let p = 0;
    while ((p = html.indexOf(ext, p)) !== -1) {
      console.log(`Found extension ${ext} at ${p}:`);
      console.log(html.substring(Math.max(0, p - 100), Math.min(html.length, p + 100)));
      p += ext.length;
    }
  }

  // Also look for ssk='5:auSv138:
  const auSvRegex = /ssk='5:auSv\d+:([a-zA-Z0-9_-]{20,})'/g;
  let m;
  const allIds = new Set();
  while ((m = auSvRegex.exec(html)) !== null) {
    const rawId = m[1].replace(/-0-.*$/, '').replace(/-0$/, '');
    allIds.add(rawId);
  }
  console.log('Unique auSv IDs:', Array.from(allIds));
}

findAudioDetails();
