import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
env.split('\n').forEach(line => {
  const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const { supabaseAdmin } = await import('../src/lib/supabase.js');

async function testCacheBusting() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Let's test fetch with cache busting:
  const directUrl = `${url}/storage/v1/object/cemim-multimedia/data/resources.json?t=${Date.now()}`;
  const res = await fetch(directUrl, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache'
    }
  });
  const data = await res.json();
  console.log('Direct fetch with cache buster count:', data.length);
  console.log('First item ID:', data[0]?.id);

  // Now upload with cacheControl: '0'
  const updated = [
    { id: 'test_item_live_' + Date.now(), title: 'Live Test', type: 'libro' },
    ...data
  ];

  const up = await supabaseAdmin.storage.from('cemim-multimedia').upload('data/resources.json', Buffer.from(JSON.stringify(updated, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });
  console.log('Upload result:', up);

  // Now fetch with cache buster again:
  const res2 = await fetch(`${url}/storage/v1/object/cemim-multimedia/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache'
    }
  });
  const data2 = await res2.json();
  console.log('Fetch after upload count:', data2.length);
  console.log('First item ID after upload:', data2[0]?.id);

  // Now delete the test item and re-save
  const cleaned = data2.filter(i => !i.id.startsWith('test_item_live_'));
  await supabaseAdmin.storage.from('cemim-multimedia').upload('data/resources.json', Buffer.from(JSON.stringify(cleaned, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });
  console.log('Cleaned back to:', cleaned.length);

  // Verify cleaned
  const res3 = await fetch(`${url}/storage/v1/object/cemim-multimedia/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache'
    }
  });
  const data3 = await res3.json();
  console.log('Final verified count:', data3.length);
}

testCacheBusting();
