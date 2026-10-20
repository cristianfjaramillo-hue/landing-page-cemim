const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
const getVar = (n) => (env.match(new RegExp('^' + n + '=(.*)$', 'm')) || [])[1]?.trim().replace(/^['"]|['"]$/g, '');
const url = getVar('SUPABASE_URL');
const serviceKey = getVar('SUPABASE_SERVICE_ROLE_KEY') || getVar('SUPABASE_ANON_KEY');
const bucket = 'cemim-multimedia';

async function verify() {
  const res = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });

  const catalog = await res.json();
  const books = catalog.filter(r => r.type === 'libro');
  const audios = catalog.filter(r => r.type === 'audio');
  const videos = catalog.filter(r => r.type === 'video');

  console.log('=== VERIFICACIÓN DE CATÁLOGO SUPABASE ===');
  console.log('Total general:', catalog.length);
  console.log('Total libros:', books.length);
  console.log('Total audios:', audios.length);
  console.log('Total videos:', videos.length);

  console.log('\nPrimeros 3 libros:');
  books.slice(0, 3).forEach((b, i) => console.log(` [${i+1}] ${b.title} (${b.category})`));

  console.log('\nÚltimos 3 libros cargados (Grupo 2):');
  books.slice(-3).forEach((b, i) => console.log(` [${books.length - 2 + i}] ${b.title} (${b.author}) - ${b.fileUrl.substring(0, 70)}...`));

  console.log('\nAudios:');
  audios.forEach((a, i) => console.log(` [${i+1}] ${a.title} (${a.duration})`));

  console.log('\nVideos:');
  videos.forEach((v, i) => console.log(` [${i+1}] ${v.title} (${v.author})`));

  // Simulación de paginación a 26 items por página
  const ITEMS_PER_PAGE = 26;
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  console.log(`\nSimulación de paginación para ${books.length} libros con ${ITEMS_PER_PAGE} por página:`);
  console.log(`Páginas totales: ${totalPages}`);
  for (let p = 1; p <= totalPages; p++) {
    const start = (p - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, books.length);
    console.log(` - Página ${p}: Items del ${start + 1} al ${end} (${end - start} libros)`);
  }
}

verify().catch(console.error);
