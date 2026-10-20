const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
const getVar = (name) => {
  const match = env.match(new RegExp('^' + name + '=(.*)$', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
};

const url = getVar('SUPABASE_URL');
const serviceKey = getVar('SUPABASE_SERVICE_ROLE_KEY') || getVar('SUPABASE_ANON_KEY');
const bucket = 'cemim-multimedia';

const supabase = createClient(url, serviceKey);

// Curated high quality theological & biblical covers
const bookCovers = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80'
];

function getCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('génesis') || lower.includes('éxodo') || lower.includes('levítico') || 
      lower.includes('números') || lower.includes('deuteronomio') || lower.includes('josué') || 
      lower.includes('jueces') || lower.includes('rut') || lower.includes('samuel') || 
      lower.includes('reyes') || lower.includes('crónicas') || lower.includes('esdras')) {
    return 'Estudios Bíblicos';
  }
  if (lower.includes('leccion a') || lower.includes('leccion b') || lower.includes('leccion c') || 
      lower.includes('leccion d') || lower.includes('sermon') || lower.includes('ministerial')) {
    return 'Liderazgo Pastoral';
  }
  if (lower.includes('principios de vida') || lower.includes('devocional')) {
    return 'Vida Devocional';
  }
  if (lower.includes('oración') || lower.includes('estudio bíblico') || lower.includes('espíritu santo') || 
      lower.includes('identidad') || lower.includes('usted cree') || lower.includes('guerra espiritual')) {
    return 'Discipulado Cristiano';
  }
  return 'Biblioteca Pastoral';
}

function getCleanTitle(name) {
  let title = name.replace(/\.pdf$/i, '').trim();
  title = title.replace(/_/g, ' ');
  return title;
}

function getDescription(title, category) {
  if (category === 'Estudios Bíblicos') {
    return `Comentario exegético, bosquejos pastorales y análisis versículo a versículo para predicación y estudio en ${title}.`;
  }
  if (category === 'Liderazgo Pastoral') {
    return `Manual formativo práctico para líderes misioneros, pastores y plantadores de iglesias: ${title}.`;
  }
  if (category === 'Vida Devocional') {
    return `Guía de reflexión espiritual, disciplina en la oración y profundización en el corazón de Dios: ${title}.`;
  }
  return `Material de discipulado bíblico fundamental para la consolidación de la fe y el ministerio: ${title}.`;
}

async function run() {
  const rawList = JSON.parse(fs.readFileSync('scripts/drive_files.json', 'utf8'));
  console.log(`Starting ingestion of ${rawList.length} files from Google Drive...`);

  // Download current resources from Supabase
  const resFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache'
    }
  });
  let currentResources = [];
  if (resFetch.ok) {
    currentResources = await resFetch.json();
    console.log(`Current items in Supabase: ${currentResources.length}`);
  }

  const existingTitles = new Set(currentResources.map(r => r.title?.toLowerCase().trim()));
  const newBookItems = [];

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    const cleanId = item.id.replace(/-0-16$/, '');
    const cleanTitle = getCleanTitle(item.name);

    if (existingTitles.has(cleanTitle.toLowerCase())) {
      console.log(`[${i+1}/${rawList.length}] Already exists: "${cleanTitle}", skipping.`);
      continue;
    }

    console.log(`[${i+1}/${rawList.length}] Downloading "${item.name}" (ID: ${cleanId})...`);
    const dlUrl = `https://drive.google.com/uc?export=download&id=${cleanId}`;

    try {
      const resp = await fetch(dlUrl, { redirect: 'follow' });
      if (!resp.ok) {
        console.warn(`Failed download status ${resp.status} for ${item.name}`);
        continue;
      }
      const buf = Buffer.from(await resp.arrayBuffer());
      if (!buf.subarray(0, 5).toString('ascii').startsWith('%PDF')) {
        console.warn(`Buffer for ${item.name} is not a PDF, skipping.`);
        continue;
      }

      const safeFileName = `${Date.now()}_${item.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const storagePath = `uploads/${safeFileName}`;

      console.log(`Uploading to Supabase: ${storagePath} (${(buf.length / 1024).toFixed(1)} KB)...`);
      const { data: upData, error: upError } = await supabase.storage.from(bucket).upload(storagePath, buf, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true
      });

      if (upError) {
        console.error(`Upload error for ${item.name}:`, upError.message);
        continue;
      }

      const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      const publicUrl = pubData.publicUrl;

      const category = getCategory(item.name);
      const coverUrl = bookCovers[i % bookCovers.length];
      const sizeMb = `${(buf.length / (1024 * 1024)).toFixed(2)} MB`;

      const newBook = {
        id: `lib-cemim-${Date.now()}-${i + 1}`,
        title: cleanTitle,
        type: 'libro',
        author: 'CEMIM Mangayacu - Biblioteca Pastoral',
        category: category,
        description: getDescription(cleanTitle, category),
        fileUrl: publicUrl,
        coverUrl: coverUrl,
        fileSize: sizeMb,
        pages: Math.max(12, Math.round(buf.length / 25000)),
        createdAt: new Date().toISOString().split('T')[0]
      };

      newBookItems.push(newBook);
      existingTitles.add(cleanTitle.toLowerCase());
      console.log(`✓ Ingested: "${cleanTitle}" (${sizeMb})`);

      // Gentle pause to avoid rate limits
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error(`Error processing ${item.name}:`, err.message);
    }
  }

  console.log(`\nAll downloads finished. Ingested ${newBookItems.length} new books!`);

  if (newBookItems.length > 0) {
    const updatedResources = [...newBookItems, ...currentResources];
    console.log(`Total catalog items will be: ${updatedResources.length}`);

    const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(updatedResources, null, 2)), {
      contentType: 'application/json',
      cacheControl: '0',
      upsert: true
    });

    if (saveError) {
      console.error('Error saving updated data/resources.json:', saveError.message);
    } else {
      console.log('SUCCESS! Updated data/resources.json in Supabase Storage with all books!');
    }
  }
}

run();
