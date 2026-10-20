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

async function addMissingG3() {
  const current = JSON.parse(fs.readFileSync('data/resources.json', 'utf8'));

  const missingBook = {
    id: 'libro-pastoral-g3-2',
    title: 'Biblia de Principios de Vida',
    type: 'libro',
    author: 'Charles F. Stanley / CEMIM',
    category: 'Estudios Bíblicos',
    description: 'Edición especial con lecciones y principios espirituales probados para caminar en obediencia, victoria y comunión con el Padre.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1vQYm6DF6ubF6H625axtE1a8hIN0On_pW&export=download&confirm=t',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    fileSize: '54.2 MB',
    pages: 1480,
    createdAt: '2026-04-20'
  };

  // Find index of g3-1
  const idxG3_1 = current.findIndex(r => r.id === 'libro-pastoral-g3-1');
  if (idxG3_1 !== -1) {
    // Insert after g3-1
    current.splice(idxG3_1 + 1, 0, missingBook);
  } else {
    current.push(missingBook);
  }

  const books = current.filter(r => r.type === 'libro');
  const g3Books = current.filter(r => r.id && r.id.startsWith('libro-pastoral-g3'));
  console.log(`Total libros consolidado: ${books.length}`);
  console.log(`Total libros Grupo 3: ${g3Books.length}`);
  console.log(`Total recursos general: ${current.length}`);

  // Save to Supabase Storage
  const { error } = await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(current, null, 2), 'utf8'), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (error) {
    console.error('Error guardando en Supabase:', error.message);
  } else {
    console.log('✅ resources.json actualizado exitosamente en Supabase Storage con los 40 libros de Grupo 3.');
  }

  // Update local files
  fs.writeFileSync('data/resources.json', JSON.stringify(current, null, 2));
  fs.writeFileSync('src/data/initialResources.js', `export const initialResources = ${JSON.stringify(current, null, 2)};\n`);
  console.log('✅ Archivos locales actualizados.');
}

addMissingG3().catch(console.error);
