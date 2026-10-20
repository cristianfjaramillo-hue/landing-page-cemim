const fs = require('fs');

async function testG2Downloads() {
  const files = JSON.parse(fs.readFileSync('scripts/drive_grupo2_files.json', 'utf8'));
  console.log('Total files in Grupo 2:', files.length);

  for (let i = 0; i < 3; i++) {
    const f = files[i];
    const url = `https://drive.google.com/uc?export=download&id=${f.id}`;
    const res = await fetch(url, { redirect: 'follow' });
    const buf = Buffer.from(await res.arrayBuffer());
    console.log(`[${i+1}] ${f.name} (ID: ${f.id}) - Status: ${res.status}, Size: ${(buf.length / 1024).toFixed(1)} KB, isPDF: ${buf.subarray(0, 4).toString('ascii') === '%PDF'}`);
  }
}

testG2Downloads();
