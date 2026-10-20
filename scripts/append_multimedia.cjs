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

async function mergeCatalog() {
  // 1. Download current resources (the 40 books)
  const resFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });

  const books = await resFetch.json();
  console.log(`Libros actuales en Supabase: ${books.length}`);

  const { initialResources } = await import('../src/data/initialResources.js');
  const audios = initialResources.filter(r => r.type === 'audio');
  const videos = initialResources.filter(r => r.type === 'video');

  console.log(`Audios a adjuntar: ${audios.length}`);
  console.log(`Videos a adjuntar: ${videos.length}`);

  const fullCatalog = [...books, ...audios, ...videos];
  console.log(`Total catálogo combinado: ${fullCatalog.length}`);

  // Save to Supabase Storage with cacheControl: 0
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(fullCatalog, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('Error al guardar en Supabase:', saveError.message);
    return;
  }

  // Update local file
  const localDataPath = path.join(__dirname, '..', 'data', 'resources.json');
  fs.writeFileSync(localDataPath, JSON.stringify(fullCatalog, null, 2), 'utf8');

  // Verify
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

  console.log(`✓ Verificación exitosa en Supabase:`);
  console.log(`  - Libros (PDF Drive): ${vBooks.length}`);
  console.log(`  - Cuentos en Audio: ${vAudios.length}`);
  console.log(`  - Videos: ${vVideos.length}`);
  console.log(`  - Total General: ${verified.length}`);
}

mergeCatalog();
