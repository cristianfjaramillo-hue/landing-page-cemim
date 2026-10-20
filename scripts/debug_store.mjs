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

const { getAllResources, addResource, deleteResourceById } = await import('../src/lib/resourceStore.js');
const { supabaseAdmin } = await import('../src/lib/supabase.js');

async function debugCheck() {
  console.log('supabaseAdmin exists?', !!supabaseAdmin);
  
  // Directly download and see what's in Supabase right now:
  const { data, error } = await supabaseAdmin.storage.from('cemim-multimedia').download('data/resources.json');
  console.log('Download error?', error);
  const text = await data.text();
  const parsed = JSON.parse(text);
  console.log('Direct download parsed length:', parsed.length);
  console.log('IDs in Supabase right now:', parsed.map(p => p.id));

  // Now let's try upload directly:
  const updated = [
    { id: 'test_item_999', title: 'Test 999', type: 'libro' },
    ...parsed
  ];
  console.log('Uploading updated list with length:', updated.length);
  const { data: upData, error: upError } = await supabaseAdmin.storage.from('cemim-multimedia').upload('data/resources.json', Buffer.from(JSON.stringify(updated)), {
    contentType: 'application/json',
    upsert: true
  });
  console.log('Upload result:', upData, 'Error:', upError);

  // Now immediately download:
  const { data: dl2, error: dlErr2 } = await supabaseAdmin.storage.from('cemim-multimedia').download('data/resources.json');
  const text2 = await dl2.text();
  const parsed2 = JSON.parse(text2);
  console.log('Downloaded immediately after upload length:', parsed2.length);
  console.log('First item ID:', parsed2[0]?.id);

  // Now cleanup:
  const cleaned = parsed2.filter(p => p.id !== 'test_item_999');
  await supabaseAdmin.storage.from('cemim-multimedia').upload('data/resources.json', Buffer.from(JSON.stringify(cleaned)), {
    contentType: 'application/json',
    upsert: true
  });
  console.log('Cleaned up!');
}

debugCheck();
