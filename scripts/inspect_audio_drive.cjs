const fs = require('fs');

async function inspectAudioDrive() {
  const folderUrl = 'https://drive.google.com/drive/folders/1HLUEO2kHXZFz7hSITmAVtWYgynH-1BW2?usp=sharing';
  console.log('Fetching Google Drive audio folder...');

  const res = await fetch(folderUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  console.log('HTML fetched, length:', html.length);

  // Search for audio extensions: .mp3, .wav, .m4a, .ogg, .aac, or any files
  const itemRegex = /aria-label="([^"]+?)\s+(?:Audio|MP3|Shared|PDF|Video)?[^"]*"[\s\S]*?ssk='[^']*?:([a-zA-Z0-9_-]{20,})'/g;
  let match;
  const files = [];
  const seen = new Set();

  while ((match = itemRegex.exec(html)) !== null) {
    const name = match[1].trim();
    const id = match[2].trim();
    if (!seen.has(id)) {
      seen.add(id);
      files.push({ id, name });
    }
  }

  console.log(`Matched with generic pattern: ${files.length}`);
  files.forEach((f, i) => console.log(`${i+1}. [${f.id}] "${f.name}"`));

  // If nothing found with pattern, search for .mp3 or similar
  if (files.length === 0) {
    let idx = 0;
    const samples = [];
    while ((idx = html.indexOf('.mp3', idx)) !== -1) {
      samples.push(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 100)));
      idx += 4;
      if (samples.length >= 5) break;
    }
    console.log('Samples around .mp3:');
    samples.forEach(s => console.log('---', s));
  }

  fs.writeFileSync('scripts/audio_drive_files.json', JSON.stringify(files, null, 2));
}

inspectAudioDrive();
