const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
const getVar = (n) => (env.match(new RegExp('^' + n + '=(.*)$', 'm')) || [])[1]?.trim().replace(/^['"]|['"]$/g, '');
const url = getVar('SUPABASE_URL');
const serviceKey = getVar('SUPABASE_SERVICE_ROLE_KEY') || getVar('SUPABASE_ANON_KEY');
const bucket = 'cemim-multimedia';

const supabase = createClient(url, serviceKey);

async function removeSampleMedia() {
  console.log('--- ELIMINANDO AUDIOS Y VIDEOS DE MUESTRA ---');

  // 1. Download current resources from Supabase with cache-busting
  const resFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });

  const all = await resFetch.json();
  console.log(`Total de recursos actuales en Supabase: ${all.length}`);

  // Keep ONLY books
  const booksOnly = all.filter(r => r.type === 'libro');
  console.log(`Libros conservados: ${booksOnly.length}`);
  console.log(`Audios y videos eliminados: ${all.length - booksOnly.length}`);

  // 2. Upload to Supabase Storage with cacheControl: 0
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(booksOnly, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('Error al guardar en Supabase:', saveError.message);
    return;
  }

  // 3. Update local data/resources.json
  const localDataPath = path.join(__dirname, '..', 'data', 'resources.json');
  fs.writeFileSync(localDataPath, JSON.stringify(booksOnly, null, 2), 'utf8');

  // 4. Update src/data/initialResources.js so it also contains only the real books
  const initialResourcesPath = path.join(__dirname, '..', 'src', 'data', 'initialResources.js');
  const code = `export const initialResources = ${JSON.stringify(booksOnly, null, 2)};\n`;
  fs.writeFileSync(initialResourcesPath, code, 'utf8');

  // 5. Verify Supabase
  const verifyRes = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });
  const verified = await verifyRes.json();
  const vBooks = verified.filter(r => r.type === 'libro');
  const vAudios = verified.filter(r => r.type === 'audio');
  const vVideos = verified.filter(r => r.type === 'video');

  console.log('\n--- VERIFICACIÓN EN SUPABASE ---');
  console.log(`Total Libros: ${vBooks.length}`);
  console.log(`Total Audios: ${vAudios.length}`);
  console.log(`Total Videos: ${vVideos.length}`);
  console.log(`Total General en Catálogo: ${verified.length}`);
}

removeSampleMedia();
