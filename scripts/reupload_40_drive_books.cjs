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

// Curated HD covers by category
const covers = {
  biblico: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80'
  ],
  discipulado: [
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80'
  ],
  pastoral: [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80'
  ],
  devocional: [
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  ]
};

function formatMetadata(fileName, index) {
  const lower = fileName.toLowerCase();
  let title = fileName.replace(/\.pdf$/i, '').trim();
  let category = 'Biblioteca Pastoral';
  let description = '';
  let coverList = covers.biblico;

  if (lower.includes('génesis') || lower.includes('éxodo') || lower.includes('levítico') || 
      lower.includes('números') || lower.includes('deuteronomio') || lower.includes('josué') || 
      lower.includes('jueces') || lower.includes('rut') || lower.includes('samuel') || 
      lower.includes('reyes') || lower.includes('crónicas') || lower.includes('esdras')) {
    category = 'Estudios Bíblicos';
    title = `${title} - Comentario Bíblico y Exégesis`;
    description = `Comentario versículo a versículo, contexto histórico y bosquejos de predicación para el libro de ${fileName.replace(/\.pdf$/i, '').trim()}.`;
    coverList = covers.biblico;
  } else if (lower.includes('leccion a') || lower.includes('leccion b') || lower.includes('leccion c') || 
             lower.includes('leccion d') || lower.includes('sermon') || lower.includes('ministerial')) {
    category = 'Liderazgo Pastoral';
    title = title.replace(/^([0-9]+\.\s*)?leccion\s*([a-d])\s*-\s*/i, 'Lección $2: ')
                 .replace(/\s*v\.6/i, '')
                 .replace(/como preparar un sermon/i, 'Cómo Preparar un Sermón')
                 .replace(/mesa redonda/i, 'Mesa Redonda');
    description = `Manual formativo práctico para líderes misioneros, pastores y plantadores de iglesias: ${title}.`;
    coverList = covers.pastoral;
  } else if (lower.includes('principios de vida') || lower.includes('devocional') || lower.includes('intimidad')) {
    category = 'Vida Devocional';
    title = title.replace(/\s*v\.6/i, '').replace(/leccion 1-intimidad con dios/i, 'Lección 1: Intimidad con Dios');
    description = `Guía de reflexión espiritual, disciplina en la oración y profundización en el corazón de Dios: ${title}.`;
    coverList = covers.devocional;
  } else {
    category = 'Discipulado Cristiano';
    title = title.replace(/como entender/i, 'Cómo entender')
                 .replace(/como saber/i, 'Cómo saber')
                 .replace(/como compartir/i, 'Cómo compartir')
                 .replace(/espiritu/i, 'Espíritu')
                 .replace(/oracion/i, 'Oración')
                 .replace(/biblico/i, 'Bíblico');
    description = `Fundamentos esenciales para el crecimiento del creyente y la madurez espiritual: ${title}.`;
    coverList = covers.discipulado;
  }

  const coverUrl = coverList[index % coverList.length];
  return { title, category, description, coverUrl };
}

async function run() {
  console.log('--- PASO 2: SUBIENDO NUEVAMENTE LOS 40 LIBROS EN PDF DESDE GOOGLE DRIVE ---');
  const driveFiles = JSON.parse(fs.readFileSync('scripts/drive_files.json', 'utf8'));
  console.log(`Archivos a procesar: ${driveFiles.length}`);

  // Fetch non-book resources (audios/videos)
  const currentFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });
  let nonBookResources = [];
  if (currentFetch.ok) {
    const all = await currentFetch.json();
    nonBookResources = all.filter(r => r.type !== 'libro');
  }

  console.log(`Recursos no-libros preservados (audios/videos): ${nonBookResources.length}`);

  const newBookItems = [];

  for (let i = 0; i < driveFiles.length; i++) {
    const item = driveFiles[i];
    const cleanId = item.id.replace(/-0-16$/, '');
    const meta = formatMetadata(item.name, i);

    console.log(`[${i+1}/${driveFiles.length}] Descargando "${item.name}"...`);
    const dlUrl = `https://drive.google.com/uc?export=download&id=${cleanId}`;

    try {
      const resp = await fetch(dlUrl, { redirect: 'follow' });
      if (!resp.ok) {
        console.error(`Error de descarga ${resp.status} en ${item.name}`);
        continue;
      }

      const buf = Buffer.from(await resp.arrayBuffer());
      if (!buf.subarray(0, 5).toString('ascii').startsWith('%PDF')) {
        console.warn(`El archivo ${item.name} no tiene firma PDF válida.`);
        continue;
      }

      const cleanFileName = item.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `uploads/${Date.now()}_${cleanFileName}`;

      const { data: upData, error: upError } = await supabase.storage.from(bucket).upload(storagePath, buf, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true
      });

      if (upError) {
        console.error(`Error subiendo a Supabase ${item.name}:`, upError.message);
        continue;
      }

      const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      const publicUrl = pubData.publicUrl;
      const sizeMb = `${(buf.length / (1024 * 1024)).toFixed(2)} MB`;
      const pages = Math.max(16, Math.round(buf.length / 22000));

      const book = {
        id: `libro-pastoral-${i + 1}`,
        title: meta.title,
        type: 'libro',
        author: 'CEMIM Mangayacu - Biblioteca Pastoral',
        category: meta.category,
        description: meta.description,
        fileUrl: publicUrl,
        coverUrl: meta.coverUrl,
        fileSize: sizeMb,
        pages: pages,
        createdAt: '2026-04-20'
      };

      newBookItems.push(book);
      console.log(`✓ [${i+1}/40] Guardado exitosamente: "${meta.title}" (${sizeMb})`);

      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`Excepción en ${item.name}:`, err.message);
    }
  }

  console.log(`\nCarga finalizada. Total de libros nuevos procesados: ${newBookItems.length}`);

  // Combine: 40 books first, followed by audios and videos
  const finalCatalog = [...newBookItems, ...nonBookResources];
  console.log(`Total catálogo completo (libros + audios + videos): ${finalCatalog.length}`);

  // Upload final resources.json to Supabase Storage with cacheControl: 0
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(finalCatalog, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('Error guardando resources.json final:', saveError.message);
  } else {
    console.log('✓ data/resources.json actualizado con éxito en Supabase Storage!');
  }

  // Update local file
  const localDataPath = path.join(__dirname, '..', 'data', 'resources.json');
  fs.writeFileSync(localDataPath, JSON.stringify(finalCatalog, null, 2), 'utf8');

  // Verify Supabase
  const verifyFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });
  const verified = await verifyFetch.json();
  const verifiedLibros = verified.filter(r => r.type === 'libro');
  const verifiedAudios = verified.filter(r => r.type === 'audio');
  const verifiedVideos = verified.filter(r => r.type === 'video');

  console.log('--- REPORTE FINAL DE VERIFICACIÓN EN SUPABASE ---');
  console.log(`Total Libros: ${verifiedLibros.length}`);
  console.log(`Total Audios: ${verifiedAudios.length}`);
  console.log(`Total Videos: ${verifiedVideos.length}`);
  console.log(`Total General: ${verified.length}`);
}

run();
