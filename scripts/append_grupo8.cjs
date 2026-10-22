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

const newGrupo8Books = [
  {
    id: 'libro-pastoral-g8-1',
    title: 'Socorro: Guía Práctica de Ayuda y Consejería Bíblica',
    type: 'libro',
    author: 'Gary Teja',
    category: 'Misiones y Consejería',
    description: 'Manual indispensable de orientación, acompañamiento pastoral y herramientas de auxilio bíblico para el servicio misionero.',
    fileUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/uploads/g8_1792690803172_SOCORRO_LIBRO_2016.pdf',
    coverUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/covers/1792689948171_portada_3.png',
    fileSize: '2.49 MB',
    pages: 45,
    createdAt: '2026-10-22'
  },
  {
    id: 'libro-pastoral-g8-2',
    title: 'El Enrejado y la Vid: Un Cambio de Mentalidad en el Ministerio Cristiano',
    type: 'libro',
    author: 'Colin Marshall y Tony Payne',
    category: 'Liderazgo Pastoral',
    description: 'Una visión transformadora del ministerio pastoral enfocada en hacer discípulos que hacen discípulos en la iglesia local.',
    fileUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/uploads/g8_1792690806120_el-enrejado-y-la-vid.pdf',
    coverUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/covers/1792689949373_portada_libro_1.jpg',
    fileSize: '0.31 MB',
    pages: 50,
    createdAt: '2026-10-22'
  },
  {
    id: 'libro-pastoral-g8-3',
    title: 'El Plan Maravilloso: La Soberanía y el Propósito de Dios',
    type: 'libro',
    author: 'Leonard Ravenhill',
    category: 'Vida Devocional',
    description: 'Un llamado urgente al avivamiento espiritual, la oración profunda y la fidelidad inquebrantable a los propósitos del Señor.',
    fileUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/uploads/g8_1792690813808_El_plan_maravilloso.pdf',
    coverUrl: 'https://cxagidebxwtrfumqjqmv.supabase.co/storage/v1/object/public/cemim-multimedia/covers/1792689949986_portada_libro_2.jpg',
    fileSize: '0.94 MB',
    pages: 146,
    createdAt: '2026-10-22'
  }
];

async function appendGrupo8() {
  const current = JSON.parse(fs.readFileSync('data/resources.json', 'utf8'));
  console.log('Current catalog count:', current.length);

  // Remove any duplicates of these books by title or id
  const filtered = current.filter(item => 
    !newGrupo8Books.some(b => b.id === item.id || b.title.toLowerCase() === item.title.toLowerCase())
  );

  const finalCatalog = [...filtered, ...newGrupo8Books];
  console.log('Final catalog count:', finalCatalog.length);
  console.log(`- Libros: ${finalCatalog.filter(i => i.type === 'libro').length}`);
  console.log(`- Audios: ${finalCatalog.filter(i => i.type === 'audio').length}`);
  console.log(`- Videos: ${finalCatalog.filter(i => i.type === 'video').length}`);

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
    console.log('✅ Catalog successfully updated in Supabase Storage with Grupo 8 books!');
  }

  // Save locally
  fs.writeFileSync('data/resources.json', JSON.stringify(finalCatalog, null, 2));
  fs.writeFileSync('src/data/initialResources.js', `export const initialResources = ${JSON.stringify(finalCatalog, null, 2)};\n`);
  console.log('✅ Catalog updated locally.');
}

appendGrupo8().catch(console.error);
