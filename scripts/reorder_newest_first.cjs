const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf8');
const getVar = (n) => (env.match(new RegExp('^' + n + '=(.*)$', 'm')) || [])[1]?.trim().replace(/^['"]|['"]$/g, '');
const url = getVar('SUPABASE_URL');
const serviceKey = getVar('SUPABASE_SERVICE_ROLE_KEY') || getVar('SUPABASE_ANON_KEY');
const bucket = 'cemim-multimedia';

const supabase = createClient(url, serviceKey);

async function reorder() {
  const current = JSON.parse(fs.readFileSync('data/resources.json', 'utf8'));

  const books = current.filter(r => r.type === 'libro');
  const audios = current.filter(r => r.type === 'audio');
  const videos = current.filter(r => r.type === 'video');

  // Sort books: Grupo 8 first, then custom res_ items, then g6, g5, g4, g3, g2, g1
  const g8Books = books.filter(b => b.id.includes('g8') || b.id.startsWith('res_') || b.createdAt >= '2026-10-20');
  const g6Books = books.filter(b => b.id.includes('g6') && !g8Books.includes(b));
  const g5Books = books.filter(b => b.id.includes('g5') && !g8Books.includes(b));
  const g4Books = books.filter(b => b.id.includes('g4') && !g8Books.includes(b));
  const g3Books = books.filter(b => b.id.includes('g3') && !g8Books.includes(b));
  const g2Books = books.filter(b => b.id.includes('g2') && !g8Books.includes(b));
  const g1Books = books.filter(b => !g8Books.includes(b) && !g6Books.includes(b) && !g5Books.includes(b) && !g4Books.includes(b) && !g3Books.includes(b) && !g2Books.includes(b));

  const sortedBooks = [
    ...g8Books,
    ...g6Books,
    ...g5Books,
    ...g4Books,
    ...g3Books,
    ...g2Books,
    ...g1Books
  ];

  console.log(`Reordered books total: ${sortedBooks.length}`);
  console.log(`Top 5 books on Page 1:`);
  sortedBooks.slice(0, 5).forEach((b, i) => console.log(`  ${i + 1}. [${b.id}] ${b.title} (${b.category})`));

  // Sort audios: MEC (the 20 newest) first, Mensajero, Minas, Job, Enoc
  const mecAudios = audios.filter(a => a.id.includes('mec'));
  const mensajeroAudios = audios.filter(a => a.id.includes('mensajero'));
  const minasAudios = audios.filter(a => a.id.includes('minas'));
  const otherAudios = audios.filter(a => !a.id.includes('mec') && !a.id.includes('mensajero') && !a.id.includes('minas'));

  const sortedAudios = [
    ...mecAudios,
    ...mensajeroAudios,
    ...minasAudios,
    ...otherAudios
  ];

  console.log(`\nReordered audios total: ${sortedAudios.length}`);
  console.log(`Top 5 audios on Page 1:`);
  sortedAudios.slice(0, 5).forEach((a, i) => console.log(`  ${i + 1}. [${a.id}] ${a.title} (${a.category})`));

  // Consolidated catalog
  const finalCatalog = [...sortedBooks, ...sortedAudios, ...videos];
  console.log(`\nTotal catalog count: ${finalCatalog.length}`);

  // Upload to Supabase Storage with cacheControl: 0
  const jsonBuf = Buffer.from(JSON.stringify(finalCatalog, null, 2), 'utf8');
  const { error: saveErr } = await supabase.storage.from(bucket).upload('data/resources.json', jsonBuf, {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveErr) {
    console.error('Error saving updated catalog to Supabase:', saveErr.message);
  } else {
    console.log('✅ Catalog successfully updated in Supabase Storage with newest-first ordering!');
  }

  // Save locally
  fs.writeFileSync('data/resources.json', JSON.stringify(finalCatalog, null, 2));
  fs.writeFileSync('src/data/initialResources.js', `export const initialResources = ${JSON.stringify(finalCatalog, null, 2)};\n`);
  console.log('✅ Local files updated.');
}

reorder().catch(console.error);
