const https = require('https');
const fs = require('fs');

const folderUrl = 'https://drive.google.com/drive/folders/1aEQjfWyvSVbCAyOUezX-iUDj99qLdPWr?usp=sharing';

async function fetchDrive() {
  const res = await fetch(folderUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  console.log('HTML fetched, length:', html.length);

  // Search for file IDs and names in the Google Drive folder HTML
  // Google Drive embeds initial data in script tags or JS arrays
  const regex = /\["([a-zA-Z0-9_-]{25,50})",\["([^"]+\.pdf)"/g;
  let match;
  const files = [];
  while ((match = regex.exec(html)) !== null) {
    files.push({ id: match[1], name: match[2] });
  }

  console.log('Regex 1 found:', files.length);

  if (files.length === 0) {
    // Alternative regex for Drive JSON structure
    const regex2 = /\["([a-zA-Z0-9_-]{25,50})",\["([^"]+)"/g;
    const allMatches = [];
    while ((match = regex2.exec(html)) !== null) {
      if (match[2].toLowerCase().endsWith('.pdf')) {
        allMatches.push({ id: match[1], name: match[2] });
      }
    }
    console.log('Regex 2 found PDFs:', allMatches.length);
    if (allMatches.length > 0) {
      files.push(...allMatches);
    }
  }

  // Deduplicate by ID
  const unique = [];
  const seen = new Set();
  for (const f of files) {
    if (!seen.has(f.id)) {
      seen.add(f.id);
      unique.push(f);
    }
  }

  console.log('Unique PDF files found:', unique.length);
  unique.forEach((f, idx) => console.log(`${idx + 1}. [${f.id}] ${f.name}`));

  fs.writeFileSync('scripts/drive_files.json', JSON.stringify(unique, null, 2));
}

fetchDrive();
