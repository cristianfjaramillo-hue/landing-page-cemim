const fs = require('fs');

function cleanTitle(raw) {
  return raw
    .replace(/\.pdf\s*PDF\s*Shared/i, '')
    .replace(/\.pdf$/i, '')
    .replace(/^LIBRO\.?\s*/i, '')
    .replace(/^[\d\.\s-]+/, '')
    .trim();
}

const g5 = JSON.parse(fs.readFileSync('scripts/drive_grupo5_files.json', 'utf8'))
  .filter(f => f.name.toLowerCase().includes('.pdf'));

const g6 = JSON.parse(fs.readFileSync('scripts/drive_grupo6_files.json', 'utf8'))
  .filter(f => f.name.toLowerCase().includes('.pdf'));

console.log('--- Grupo 5 Cleaned Titles ---');
g5.forEach((f, i) => console.log(`${i+1}. "${cleanTitle(f.name)}"`));

console.log('\n--- Grupo 6 Cleaned Titles ---');
g6.forEach((f, i) => console.log(`${i+1}. "${cleanTitle(f.name)}"`));
