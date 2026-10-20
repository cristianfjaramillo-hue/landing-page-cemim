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

async function deleteAllBooks() {
  console.log('--- PASO 1: ELIMINANDO TODOS LOS LIBROS DE LA BASE DE DATOS ---');
  
  // 1. Download current resources from Supabase with cache-busting
  const resFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });

  let currentResources = [];
  if (resFetch.ok) {
    currentResources = await resFetch.json();
  }

  console.log(`Recursos totales antes de la eliminación: ${currentResources.length}`);
  const booksBefore = currentResources.filter(r => r.type === 'libro');
  const others = currentResources.filter(r => r.type !== 'libro');

  console.log(`Libros a eliminar: ${booksBefore.length}`);
  console.log(`Otros recursos conservados (audios/videos): ${others.length}`);

  // If there are no audios/videos in currentResources, let's include the standard audios and videos from initialResources
  let nonBookItems = others;
  if (nonBookItems.length === 0) {
    const { initialResources } = await import('../src/data/initialResources.js');
    nonBookItems = initialResources.filter(r => r.type !== 'libro');
    console.log(`Se preservan ${nonBookItems.length} recursos de audio y video.`);
  }

  // Save the new array (WITH ZERO BOOKS) to Supabase Storage
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(nonBookItems, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('Error al guardar en Supabase:', saveError.message);
    return;
  }

  // Also update local file
  const localDataPath = path.join(__dirname, '..', 'data', 'resources.json');
  fs.writeFileSync(localDataPath, JSON.stringify(nonBookItems, null, 2), 'utf8');

  // Verify
  const verifyRes = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });
  const verifiedItems = await verifyRes.json();
  const booksAfter = verifiedItems.filter(r => r.type === 'libro');

  console.log(`✓ Verificación completada:`);
  console.log(`  - Libros en la base de datos ahora: ${booksAfter.length}`);
  console.log(`  - Total de recursos restantes: ${verifiedItems.length}`);
  console.log('¡TODOS LOS LIBROS HAN SIDO ELIMINADOS CON ÉXITO!');
}

deleteAllBooks();
