const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
const getVar = (n) => (env.match(new RegExp('^' + n + '=(.*)$', 'm')) || [])[1]?.trim().replace(/^['"]|['"]$/g, '');
const url = getVar('SUPABASE_URL');
const serviceKey = getVar('SUPABASE_SERVICE_ROLE_KEY') || getVar('SUPABASE_ANON_KEY');
const bucket = 'cemim-multimedia';

const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1HLUEO2kHXZFz7hSITmAVtWYgynH-1BW2?usp=sharing';

const supabase = createClient(url, serviceKey);

const AUDIO_COVERS = [
  'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
];

function cleanAudioTitle(name) {
  let title = name.replace(/\.(mp3|wav|m4a|ogg|aac)$/i, '').trim();
  title = title.replace(/_/g, ': ');
  title = title.replace(/\s+/g, ' ');
  title = title.replace(/¡/g, '').replace(/!/g, '');
  return title.trim();
}

function estimateDuration(bytes) {
  // Assuming ~128kbps (16KB/sec)
  const seconds = Math.round(bytes / 16000);
  const mins = Math.floor(seconds / 60);
  const remSecs = seconds % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins < 10 ? '0' : ''}${remMins}m`;
  }
  return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
}

async function syncAudioLibrary() {
  console.log('====================================================');
  console.log('ACTUALIZACIÓN DE BIBLIOTECA DE AUDIO CEMIM (DRIVE)');
  console.log('====================================================');
  console.log(`Explorando carpeta de Drive: ${DRIVE_FOLDER_URL}`);

  const folderRes = await fetch(DRIVE_FOLDER_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!folderRes.ok) {
    console.error(`Error al conectar con la carpeta de Google Drive: ${folderRes.status}`);
    return;
  }

  const html = await folderRes.text();

  // Extract all files with audio extensions or auSv patterns
  const audioRegex = /aria-label="([^"]+?\.(?:mp3|wav|m4a|ogg|aac))\s+(?:Audio|Shared)?[^"]*"[\s\S]*?ssk='[^']*?:([a-zA-Z0-9_-]{20,})'/g;
  let match;
  const driveAudios = [];
  const seenIds = new Set();

  while ((match = audioRegex.exec(html)) !== null) {
    const name = match[1].trim();
    const rawId = match[2].trim().replace(/-0-.*$/, '').replace(/-0$/, '');
    if (!seenIds.has(rawId)) {
      seenIds.add(rawId);

      // Try finding file size from html
      let sizeBytes = 50 * 1024 * 1024;
      const sizePattern = new RegExp(rawId.substring(0, 15) + '[\\s\\S]*?([0-9]{7,10})', 'g');
      const sizeMatch = sizePattern.exec(html);
      if (sizeMatch) {
        sizeBytes = parseInt(sizeMatch[1], 10);
      }

      driveAudios.push({ id: rawId, name, sizeBytes });
    }
  }

  console.log(`Total de archivos de audio identificados en Drive: ${driveAudios.length}`);
  driveAudios.forEach((a, i) => {
    console.log(`  [${i+1}] ID: ${a.id} | Archivo: "${a.name}"`);
  });

  // 2. Fetch current catalog from Supabase
  const resFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });

  let currentCatalog = [];
  if (resFetch.ok) {
    currentCatalog = await resFetch.json();
  }

  console.log(`\nRecursos actuales en la base de datos: ${currentCatalog.length}`);
  const existingAudios = currentCatalog.filter(r => r.type === 'audio');
  const otherResources = currentCatalog.filter(r => r.type !== 'audio');
  console.log(` - Libros/otros existentes: ${otherResources.length}`);
  console.log(` - Audios ya registrados: ${existingAudios.length}`);

  // Set of existing audio IDs (by Drive ID in fileUrl or clean title)
  const existingDriveIds = new Set();
  const existingTitles = new Set();
  existingAudios.forEach(a => {
    if (a.driveId) existingDriveIds.add(a.driveId);
    if (a.fileUrl) {
      const idMatch = a.fileUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch) existingDriveIds.add(idMatch[1]);
    }
    if (a.title) existingTitles.add(a.title.toLowerCase().trim());
  });

  // 3. Find NEW audios
  const newAudios = [];
  for (let i = 0; i < driveAudios.length; i++) {
    const da = driveAudios[i];
    const cleanTitle = cleanAudioTitle(da.name);

    if (existingDriveIds.has(da.id) || existingTitles.has(cleanTitle.toLowerCase())) {
      console.log(`✓ Audio ya cargado anteriormente (se mantiene): "${cleanTitle}"`);
      continue;
    }

    console.log(`⚡ NUEVO AUDIO DETECTADO: "${cleanTitle}" (ID: ${da.id})`);

    // High performance direct stream URL with open CORS and unlimited length
    const streamUrl = `https://drive.usercontent.google.com/download?id=${da.id}&export=download&confirm=t`;
    const sizeMb = `${(da.sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
    const duration = estimateDuration(da.sizeBytes);
    const coverUrl = AUDIO_COVERS[(existingAudios.length + newAudios.length) % AUDIO_COVERS.length];

    const audioItem = {
      id: `audio-cemim-${da.id}`,
      driveId: da.id,
      type: 'audio',
      title: cleanTitle,
      author: 'CEMIM Mangayacu - Audioteca Misionera',
      category: 'Historias Bíblicas',
      description: `Relato en audio narrado para edificación espiritual, estudio bíblico y reflexión en la fe: ${cleanTitle}.`,
      duration: duration,
      fileSize: sizeMb,
      fileUrl: streamUrl,
      coverUrl: coverUrl,
      createdAt: new Date().toISOString().split('T')[0]
    };

    newAudios.push(audioItem);
  }

  if (newAudios.length === 0) {
    console.log('\n✓ La biblioteca de audios ya está completamente al día. No hay archivos nuevos por agregar.');
    return;
  }

  console.log(`\nAgregando ${newAudios.length} nuevos audios al repositorio...`);

  // Combine: existing books + existing audios + new audios
  // Keep books first, then audios
  const updatedCatalog = [...otherResources, ...newAudios, ...existingAudios];
  console.log(`Total nuevo catálogo: ${updatedCatalog.length} recursos.`);

  // 4. Save to Supabase Storage with cacheControl: 0
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(updatedCatalog, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('Error al guardar en Supabase:', saveError.message);
    return;
  }

  // 5. Update local file
  const localDataPath = path.join(__dirname, '..', 'data', 'resources.json');
  fs.writeFileSync(localDataPath, JSON.stringify(updatedCatalog, null, 2), 'utf8');

  console.log('\n✓ SINCRONIZACIÓN EXITOSA: Nuevos audios agregados y catálogo actualizado en Supabase Storage!');
}

syncAudioLibrary();
