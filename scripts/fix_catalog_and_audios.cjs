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

async function cleanAndFixCatalog() {
  console.log('Fetching current catalog from Supabase...');
  const resFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });

  const catalog = await resFetch.json();
  console.log('Current catalog total items:', catalog.length);

  // Filter out accidental test book "PRUEBA DE AUDIO"
  const cleanList = catalog.filter(item => {
    if (item.title === 'PRUEBA DE AUDIO' && item.type === 'libro') return false;
    return true;
  });

  // Keep the 40 real books
  const books = cleanList.filter(item => item.type === 'libro');
  console.log(`Books count: ${books.length}`);

  // Create the 2 real verified audio items from the user's Drive folder with exact durations & streamable URLs
  const audioJob = {
    id: 'audio-job-1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5',
    driveId: '1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5',
    type: 'audio',
    title: 'La Historia de JOB: La Prueba de Fe Más Grande del Antiguo Testamento',
    author: 'CEMIM Mangayacu - Audioteca',
    category: 'Historias Bíblicas',
    description: 'Relato bíblico en audio sobre la prueba, fe inquebrantable y restauración de Job. Un mensaje profundo para tiempos de dificultad.',
    duration: '1h 13m',
    fileSize: '133.9 MB',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5&export=download&confirm=t',
    coverUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-04-20'
  };

  const audioEnoc = {
    id: 'audio-enoc-1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG',
    driveId: '1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG',
    type: 'audio',
    title: 'La Increíble Historia de ENOC: El Hombre que Caminó con Dios',
    author: 'CEMIM Mangayacu - Audioteca',
    category: 'Historias Bíblicas',
    description: 'Narración bíblica sobre la íntima comunión de Enoc con Dios y su partida al cielo. Inspiración para una vida de oración constante.',
    duration: '35:26',
    fileSize: '64.9 MB',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG&export=download&confirm=t',
    coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-04-20'
  };

  // Final catalog: 40 books + 2 audios = 42 items
  const finalCatalog = [...books, audioJob, audioEnoc];
  console.log(`Updated final catalog total items: ${finalCatalog.length}`);

  // Save to Supabase Storage with cacheControl: 0
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(finalCatalog, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('Error saving to Supabase:', saveError.message);
    return;
  }

  // Update local files
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'resources.json'), JSON.stringify(finalCatalog, null, 2), 'utf8');
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'initialResources.js'), `export const initialResources = ${JSON.stringify(finalCatalog, null, 2)};\n`, 'utf8');

  console.log('✓ SUCCESS: Catalog cleaned and updated in Supabase Storage!');
}

cleanAndFixCatalog();
