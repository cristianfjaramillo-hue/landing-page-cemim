const fs = require('fs');

async function extractFiles() {
  const res = await fetch('https://drive.google.com/drive/folders/1aEQjfWyvSVbCAyOUezX-iUDj99qLdPWr?usp=sharing', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();

  // Pattern: aria-label="FILENAME.pdf PDF..." ... ssk='...auSv...:FILE_ID'
  // Or match the container:
  const itemRegex = /aria-label="([^"]+?\.(?:pdf|PDF))[^"]*"[\s\S]*?ssk='[^']*?:([a-zA-Z0-9_-]{20,})'/g;
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

  console.log(`Extracted ${files.length} PDF files!`);
  files.forEach((f, idx) => console.log(`${idx + 1}. [${f.id}] ${f.name}`));

  fs.writeFileSync('scripts/drive_files.json', JSON.stringify(files, null, 2));
}

extractFiles();
