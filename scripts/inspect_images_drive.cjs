const fs = require('fs');

async function inspectFolder() {
  const folderUrl = 'https://drive.google.com/drive/folders/1bHCzowe7EygXwKVafLKdZJe-JtvyYLWX?usp=sharing';
  console.log('Fetching Google Drive images folder...');

  const res = await fetch(folderUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  const html = await res.text();
  console.log('HTML length:', html.length);
  fs.writeFileSync('scripts/drive_images_folder.html', html);

  // Search for images
  const itemRegex = /aria-label="([^"]+?)"[\s\S]*?ssk='[^']*?:([a-zA-Z0-9_-]{20,})'/g;
  let match;
  const items = [];
  const seen = new Set();

  while ((match = itemRegex.exec(html)) !== null) {
    const rawName = match[1].trim();
    const rawId = match[2].trim().replace(/-0-.*$/, '').replace(/-0$/, '');
    if (!seen.has(rawId)) {
      seen.add(rawId);
      items.push({ id: rawId, name: rawName });
    }
  }

  // Alt regex
  const altRegex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+?)"/g;
  while ((match = altRegex.exec(html)) !== null) {
    const rawId = match[1];
    const rawName = match[2];
    if (!seen.has(rawId)) {
      seen.add(rawId);
      items.push({ id: rawId, name: rawName });
    }
  }

  console.log(`Found ${items.length} items in folder:`);
  items.forEach((item, idx) => console.log(idx + 1, item.id, item.name));
  fs.writeFileSync('scripts/drive_images_files.json', JSON.stringify(items, null, 2));
}

inspectFolder().catch(console.error);
