const fs = require('fs');

async function inspectFolder(name, folderId) {
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  console.log(`\n========================================`);
  console.log(`Inspecting ${name} (ID: ${folderId})...`);
  
  const res = await fetch(folderUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  console.log(`HTML length: ${html.length}`);

  // Regex to extract all files
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

  // Also try alternative regex
  const altRegex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+?)"/g;
  while ((match = altRegex.exec(html)) !== null) {
    const rawId = match[1];
    const rawName = match[2];
    if (!seen.has(rawId)) {
      seen.add(rawId);
      items.push({ id: rawId, name: rawName });
    }
  }

  console.log(`Found ${items.length} items in ${name}:`);
  items.forEach((item, idx) => {
    console.log(` [${idx + 1}] [${item.id}] ${item.name}`);
  });

  return items;
}

async function run() {
  const g5 = await inspectFolder('GRUPO 5', '1pIHdGmK8loowXkM4UJYhlVhXJbdzvgmg');
  fs.writeFileSync('scripts/drive_grupo5_files.json', JSON.stringify(g5, null, 2));

  const g6 = await inspectFolder('GRUPO 6 / AUDIOTECA LINK', '1uYziO1l5m9HQejBWZ3woE8lPwqhHOZdu');
  fs.writeFileSync('scripts/drive_grupo6_files.json', JSON.stringify(g6, null, 2));

  // Also check previous audioteca folder just in case
  const prevAudio = await inspectFolder('PREV AUDIOTECA', '1HLUEO2kHXZFz7hSITmAVtWYgynH-1BW2');
  fs.writeFileSync('scripts/drive_prev_audioteca_files.json', JSON.stringify(prevAudio, null, 2));
}

run().catch(console.error);
