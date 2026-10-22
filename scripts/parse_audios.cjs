const fs = require('fs');
const html = fs.readFileSync('scripts/drive_audio_folder.html', 'utf8');

// Regex patterns
const itemRegex = /aria-label="([^"]+?)"[\s\S]*?ssk='[^']*?:([a-zA-Z0-9_-]{20,})'/g;
let match;
const items = [];
const seen = new Set();

while ((match = itemRegex.exec(html)) !== null) {
  const rawName = match[1].trim();
  const rawId = match[2].trim().replace(/-0-.*$/, '').replace(/-0$/, '');
  if (!seen.has(rawId) && (rawName.toLowerCase().includes('.mp3') || rawName.toLowerCase().includes('.wav') || rawName.toLowerCase().includes('.m4a') || rawName.toLowerCase().includes('audio'))) {
    seen.add(rawId);
    items.push({ id: rawId, name: rawName });
  }
}

// Alt regex
const altRegex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+?)"/g;
while ((match = altRegex.exec(html)) !== null) {
  const rawId = match[1];
  const rawName = match[2];
  if (!seen.has(rawId) && (rawName.toLowerCase().includes('.mp3') || rawName.toLowerCase().includes('.wav') || rawName.toLowerCase().includes('.m4a') || rawName.toLowerCase().includes('audio'))) {
    seen.add(rawId);
    items.push({ id: rawId, name: rawName });
  }
}

console.log('Total items found with audio filters:', items.length);
items.forEach((it, i) => console.log(i + 1, it.id, it.name));

// Also let's check any item regardless of name
const allItems = [];
const seenAll = new Set();
let matchAll;
const generalRegex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+?)"/g;
while ((matchAll = generalRegex.exec(html)) !== null) {
  const rawId = matchAll[1];
  const rawName = matchAll[2];
  if (!seenAll.has(rawId)) {
    seenAll.add(rawId);
    allItems.push({ id: rawId, name: rawName });
  }
}

console.log('\nTotal general items found in HTML:', allItems.length);
allItems.forEach((it, i) => console.log(i + 1, it.id, it.name));

fs.writeFileSync('scripts/extracted_audios_raw.json', JSON.stringify({ items, allItems }, null, 2));
