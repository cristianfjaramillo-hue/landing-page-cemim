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

const books = [
  {
    resourceId: 'res_1792689243909_ff54il',
    id: '1EhOWotbcCYxc3v3qwYDrCCXE0hgmELfp',
    title: 'Socorro: Guía Práctica de Ayuda y Consejería Bíblica',
    author: 'Gary Teja',
    category: 'Misiones y Consejería',
    description: 'Manual indispensable de orientación, acompañamiento pastoral y herramientas de auxilio bíblico para el servicio misionero.',
    coverUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/covers/1792689948171_portada_3.png',
    fileName: 'SOCORRO_LIBRO_2016.pdf'
  },
  {
    resourceId: 'res_1792688914526_m8d16m',
    id: '1XNYL3j0bwe5CkN1gp9HHGvhbhaBHRPI0',
    title: 'El Enrejado y la Vid: Un Cambio de Mentalidad en el Ministerio Cristiano',
    author: 'Colin Marshall y Tony Payne',
    category: 'Liderazgo Pastoral',
    description: 'Una visión transformadora del ministerio pastoral enfocada en hacer discípulos que hacen discípulos en la iglesia local.',
    coverUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/covers/1792689949373_portada_libro_1.jpg',
    fileName: 'el-enrejado-y-la-vid.pdf'
  },
  {
    resourceId: 'res_1792688762399_i4xjx4',
    id: '150l23oeXF7IB3mOgxf-gqcG4_CvnnN4K',
    title: 'El Plan Maravilloso: La Soberanía y el Propósito de Dios',
    author: 'Leonard Ravenhill',
    category: 'Vida Devocional',
    description: 'Un llamado urgente al avivamiento espiritual, la oración profunda y la fidelidad inquebrantable a los propósitos del Señor.',
    coverUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/covers/1792689949986_portada_libro_2.jpg',
    fileName: 'El_plan_maravilloso.pdf'
  }
];

async function downloadFileFromDrive(id) {
  const urls = [
    `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://drive.usercontent.google.com/download?id=${id}`
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      if (res.ok) {
        const cType = res.headers.get('content-type') || '';
        if (!cType.includes('text/html')) {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length > 1000) return buf;
        }
      }
    } catch (e) {}
  }
  return null;
}

async function run() {
  console.log('Downloading 3 books from Drive and uploading to Supabase Storage...');

  for (const b of books) {
    console.log(`\nProcessing: "${b.title}" (Drive ID: ${b.id})...`);
    const buf = await downloadFileFromDrive(b.id);
    let publicUrl = '';
    let sizeMb = '2.5 MB';

    if (buf) {
      sizeMb = (buf.length / (1024 * 1024)).toFixed(2) + ' MB';
      console.log(`Downloaded ${b.fileName}: ${buf.length} bytes (${sizeMb})`);

      const storagePath = `uploads/g8_${Date.now()}_${b.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data: upData, error: upError } = await supabase.storage.from(bucket).upload(storagePath, buf, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true
      });

      if (!upError) {
        publicUrl = supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
        console.log(`✅ Uploaded to Supabase CDN: ${publicUrl}`);
      } else {
        console.error(`Error uploading to Supabase:`, upError.message);
      }
    } else {
      console.warn(`Could not download directly, falling back to direct drive download URL`);
      publicUrl = `https://drive.usercontent.google.com/download?id=${b.id}&export=download&confirm=t`;
    }

    b.publicUrl = publicUrl;
    b.fileSize = sizeMb;
  }

  // Update data/resources.json in Supabase
  const { data: catData, error: catErr } = await supabase.storage.from(bucket).download('data/resources.json');
  if (catErr) {
    console.error('Error fetching catalog:', catErr.message);
    return;
  }

  const catalog = JSON.parse(await catData.text());
  console.log('\nCurrent catalog length in Supabase:', catalog.length);

  const updatedCatalog = catalog.map(item => {
    const match = books.find(b => b.resourceId === item.id || b.id === item.id);
    if (match) {
      console.log(`Updating ${item.id} -> ${match.title}`);
      return {
        ...item,
        title: match.title,
        author: match.author,
        category: match.category,
        description: match.description,
        fileUrl: match.publicUrl,
        coverUrl: match.coverUrl,
        fileSize: match.fileSize,
        type: 'libro',
        pages: item.pages || 60,
        updatedAt: '2026-10-22'
      };
    }
    return item;
  });

  const jsonBuf = Buffer.from(JSON.stringify(updatedCatalog, null, 2), 'utf8');
  const { error: saveErr } = await supabase.storage.from(bucket).upload('data/resources.json', jsonBuf, {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveErr) {
    console.error('Error saving updated catalog to Supabase:', saveErr.message);
  } else {
    console.log('✅ Catalog successfully updated in Supabase Storage!');
  }

  // Save locally
  fs.writeFileSync('data/resources.json', JSON.stringify(updatedCatalog, null, 2));
  fs.writeFileSync('src/data/initialResources.js', `export const initialResources = ${JSON.stringify(updatedCatalog, null, 2)};\n`);
  console.log('✅ Catalog updated locally.');
}

run().catch(console.error);
