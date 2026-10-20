const fs = require('fs');

async function extractGrupo3() {
  const folderUrl = 'https://drive.google.com/drive/folders/1-QUdHHWSqny5WRhtwaxJL4TUDrLCf2HN?usp=sharing';
  console.log('Fetching Google Drive Grupo 3 folder...');

  const res = await fetch(folderUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  console.log('HTML fetched, length:', html.length);

  // Strategy 1: regex using aria-label and ssk
  const itemRegex = /aria-label="([^"]+?\.(?:pdf|PDF))[^"]*"[\s\S]*?ssk='[^']*?:([a-zA-Z0-9_-]{20,})'/g;
  let match;
  const files = [];
  const seen = new Set();

  while ((match = itemRegex.exec(html)) !== null) {
    const name = match[1].trim();
    const rawId = match[2].trim().replace(/-0-.*$/, '').replace(/-0$/, '');
    if (!seen.has(rawId)) {
      seen.add(rawId);
      files.push({ id: rawId, name });
    }
  }

  // Strategy 2: If strategy 1 got few items, check for _data_ or JSON embedded
  if (files.length < 5) {
    console.log('Trying alternative parsing...');
    const idNameRegex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+?\.(?:pdf|PDF))"/g;
    while ((match = idNameRegex.exec(html)) !== null) {
      const rawId = match[1];
      const name = match[2];
      if (!seen.has(rawId)) {
        seen.add(rawId);
        files.push({ id: rawId, name });
      }
    }
  }

  console.log(`Extracted ${files.length} PDF files from Grupo 3!`);
  files.forEach((f, idx) => console.log(`${idx + 1}. [${f.id}] ${f.name}`));

  fs.writeFileSync('scripts/drive_grupo3_files.json', JSON.stringify(files, null, 2));
}

extractGrupo3().catch(console.error);
