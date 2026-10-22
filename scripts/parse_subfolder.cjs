const fs = require('fs');
const html = fs.readFileSync('scripts/drive_subfolder.html', 'utf8');

// Check window['_DRIVE_ivd']
let ivdMatch = html.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
if (ivdMatch) {
  const rawIvd = ivdMatch[1].replace(/\\x([0-9A-Fa-f]{2})/g, (m, c) => String.fromCharCode(parseInt(c, 16))).replace(/\\\//g, '/');
  console.log('Found ivd data length:', rawIvd.length);
  try {
    const parsed = JSON.parse(rawIvd);
    console.log('Parsed ivd root length:', parsed.length);
    if (parsed[0]) {
      parsed[0].forEach((item, idx) => {
        console.log(idx + 1, 'ID:', item[0], 'Name:', item[2], 'Mime:', item[3]);
      });
    }
  } catch (e) {
    console.error('Failed to parse ivd:', e.message);
  }
}

// Regex search for items
const altRegex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+?)"/g;
let match;
const items = [];
const seen = new Set();
while ((match = altRegex.exec(html)) !== null) {
  const rawId = match[1];
  const rawName = match[2];
  if (!seen.has(rawId)) {
    seen.add(rawId);
    items.push({ id: rawId, name: rawName });
  }
}

console.log('\nItems from altRegex:', items.length);
items.forEach((it, i) => console.log(i + 1, it.id, it.name));
