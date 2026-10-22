const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scripts/extracted_audios_raw.json', 'utf8')).items;

async function checkFiles() {
  console.log(`Checking ${raw.length} files...`);
  const results = [];

  for (let i = 0; i < raw.length; i++) {
    const f = raw[i];
    const url = `https://drive.usercontent.google.com/download?id=${f.id}&export=download&confirm=t`;
    
    let sizeBytes = 0;
    try {
      const headRes = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const len = headRes.headers.get('content-length');
      if (len) {
        sizeBytes = parseInt(len, 10);
      }
    } catch (e) {}

    // If HEAD didn't give content-length or was redirect, do a ranged GET
    if (!sizeBytes) {
      try {
        const rangeRes = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Range': 'bytes=0-10'
          }
        });
        const cr = rangeRes.headers.get('content-range');
        if (cr) {
          const match = cr.match(/\/(\d+)/);
          if (match) sizeBytes = parseInt(match[1], 10);
        }
      } catch (e) {}
    }

    const sizeMb = sizeBytes > 0 ? (sizeBytes / (1024 * 1024)).toFixed(2) + ' MB' : 'Desconocido';
    console.log(`[${i + 1}/${raw.length}] ID: ${f.id} | Size: ${sizeMb} | Name: ${f.name}`);
    results.push({
      id: f.id,
      name: f.name,
      sizeBytes,
      fileSize: sizeMb
    });

    await new Promise(r => setTimeout(r, 100));
  }

  fs.writeFileSync('scripts/audio_files_with_sizes.json', JSON.stringify(results, null, 2));
}

checkFiles().catch(console.error);
