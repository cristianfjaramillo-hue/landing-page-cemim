const fs = require('fs');
const path = require('path');

const files = JSON.parse(fs.readFileSync('scripts/drive_files.json', 'utf8'));
console.log('Total files to check:', files.length);

async function testBatch() {
  for (let i = 0; i < Math.min(5, files.length); i++) {
    const f = files[i];
    const cleanId = f.id.replace(/-0-16$/, '');
    const url = `https://drive.google.com/uc?export=download&id=${cleanId}`;
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const buf = Buffer.from(await res.arrayBuffer());
      const isPdf = buf.subarray(0, 5).toString('ascii').startsWith('%PDF');
      console.log(`[${i+1}] ${f.name} (ID: ${cleanId}): status=${res.status}, size=${(buf.length/1024).toFixed(1)} KB, isPdf=${isPdf}`);
    } catch (err) {
      console.error(`Error on ${f.name}:`, err.message);
    }
  }
}

testBatch();
