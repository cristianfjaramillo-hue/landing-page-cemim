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

async function testStore() {
  console.log('--- 1. getAllResources ---');
  let list = await getAllResources(true);
  console.log('Initial list count:', list.length);

  console.log('--- 2. addResource test item ---');
  const testItem = await addResource({
    title: 'Recurso de Prueba Temporal',
    type: 'libro',
    author: 'Test Admin',
    category: 'Prueba',
    description: 'Item de prueba para verificar guardado y eliminacion',
    fileUrl: 'https://example.com/test.pdf',
    fileSize: '1.2 MB'
  });
  console.log('Created test item with id:', testItem.id);

  console.log('--- 3. verify item is in list ---');
  list = await getAllResources(true);
  const found = list.find(r => r.id === testItem.id);
  console.log('Item found in getAllResources?', !!found, 'Total list count now:', list.length);

  console.log('--- 4. deleteResourceById ---');
  const afterDelete = await deleteResourceById(testItem.id);
  console.log('After delete count:', afterDelete.length);

  console.log('--- 5. verify item was deleted from Supabase ---');
  list = await getAllResources(true);
  const foundAfter = list.find(r => r.id === testItem.id);
  console.log('Item still found after delete?', !!foundAfter, 'Final count:', list.length);
}

testStore();
