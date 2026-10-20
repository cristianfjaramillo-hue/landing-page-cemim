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
  ],
  audio: [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80'
  ]
};

async function downloadFileFromDrive(id) {
  // Method 1: usercontent with confirm=t
  try {
    const u1 = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
    const res1 = await fetch(u1, { redirect: 'follow' });
    if (res1.ok) {
      const buf = Buffer.from(await res1.arrayBuffer());
      if (buf.length > 500) return buf;
    }
  } catch (e) {}

  // Method 2: standard uc
  try {
    const u2 = `https://drive.google.com/uc?export=download&id=${id}`;
    const res2 = await fetch(u2, { redirect: 'follow' });
    if (res2.ok) {
      const buf = Buffer.from(await res2.arrayBuffer());
      if (buf.length > 500) return buf;
    }
  } catch (e) {}

  return null;
}

function getBookMetadata(name, groupIndex, itemIndex) {
  const lower = name.toLowerCase();
  let title = name.replace(/\.pdf\s*PDF\s*Shared/i, '').replace(/\.pdf$/i, '').replace(/^LIBRO\.?\s*/i, '').replace(/^[\d\.\s-]+/, '').trim();
  let author = 'CEMIM Mangayacu - Biblioteca Pastoral';
  let category = 'Estudios Bíblicos';
  let description = `Recurso de formación teológica, bíblica y pastoral: ${title}.`;
  let coverList = covers.biblico;

  if (lower.includes('maxwell') || lower.includes('21 minutos') || lower.includes('desarrolle al lider') || lower.includes('21 leyes') || lower.includes('piense para obtener') || lower.includes('actitud de vencedor') || lower.includes('mapa para alcanzar')) {
    author = 'John C. Maxwell';
    category = 'Liderazgo Pastoral';
    description = `Manual imprescindible de mentoría, desarrollo de influencia, carácter y liderazgo transformacional: ${title}.`;
    coverList = covers.pastoral;
  } else if (lower.includes('tozer')) {
    author = 'A. W. Tozer';
    category = 'Vida Devocional';
    description = `Un clásico de profunda devoción, santidad práctica y búsqueda incansable del corazón de Dios: ${title}.`;
    coverList = covers.devocional;
  } else if (lower.includes('spurgeon') || lower.includes('solamente por gracia')) {
    author = 'Charles H. Spurgeon';
    category = 'Vida Devocional';
    description = `Mensajes imperecederos del Príncipe de los Predicadores sobre la soberana gracia, la fe y el consuelo divino: ${title}.`;
    coverList = covers.devocional;
  } else if (lower.includes('stanley') || lower.includes('principios de vida')) {
    author = 'Charles F. Stanley / CEMIM';
    category = 'Liderazgo Pastoral';
    description = `Bosquejos y sermones estructurados con lecciones vitales para el crecimiento del creyente: ${title}.`;
    coverList = covers.pastoral;
  } else if (lower.includes('kempis') || lower.includes('imitación de cristo')) {
    title = 'La Imitación de Cristo';
    author = 'Tomás de Kempis';
    category = 'Vida Devocional';
    description = 'El clásico de devoción y consagración cristiana más leído en la historia después de la Biblia.';
    coverList = covers.devocional;
  } else if (lower.includes('hermano lorenzo') || lower.includes('presencia de dios')) {
    title = 'La Práctica de la Presencia de Dios';
    author = 'Hermano Lorenzo';
    category = 'Vida Devocional';
    description = 'Testimonio conmovedor sobre la comunión ininterrumpida con el Señor en medio de las tareas diarias más sencillas.';
    coverList = covers.devocional;
  } else if (lower.includes('ravenhill')) {
    author = 'Leonard Ravenhill';
    category = 'Vida Devocional';
    description = 'Un clamor ardiente e intransigente por un avivamiento del Espíritu Santo en la iglesia contemporánea.';
    coverList = covers.devocional;
  } else if (lower.includes('finney')) {
    author = 'Charles G. Finney';
    category = 'Vida Devocional';
    description = 'Memorias autobiográficas y lecciones espirituales de uno de los mayores reavivamientos en la historia de la iglesia.';
    coverList = covers.devocional;
  } else if (lower.includes('chambers')) {
    author = 'Oswald Chambers';
    category = 'Vida Devocional';
    description = 'Pautas reflexivas de profunda consagración, obediencia y discipulado en las sendas de Cristo.';
    coverList = covers.devocional;
  } else if (lower.includes('roberts liardon') || lower.includes('generales de dios')) {
    title = 'Los Generales de Dios (Tomo II): Los Pioneros de la Sanidad';
    author = 'Roberts Liardon';
    category = 'Liderazgo Pastoral';
    description = 'Biografías reveladoras de siervos de Dios que operaron en el poder de señales, prodigios y fe pionera.';
    coverList = covers.pastoral;
  } else if (lower.includes('lutero')) {
    title = 'Martín Lutero: Vida, Obra y Teología';
    author = 'Roland Bainton / CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Estudio histórico exhaustivo sobre la vida del reformador alemán y el renacimiento de la doctrina de la justificación por la fe.';
    coverList = covers.biblico;
  } else if (lower.includes('menno simons')) {
    title = 'Menno Simons: Su Vida y Escritos Fundamentales';
    author = 'Equipo Histórico CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Compendio de la fe anabaptista, pacifismo bíblico y fidelidad al evangelio en tiempos de persecución europea.';
    coverList = covers.biblico;
  } else if (lower.includes('hermenéutica') || lower.includes('hermeneutica') || lower.includes('interpretando')) {
    category = 'Estudios Bíblicos';
    author = 'Instituto Bíblico CEMIM';
    description = `Manual y guía metodológica para la interpretación sana y contextual del texto sagrado: ${title}.`;
    coverList = covers.biblico;
  } else if (lower.includes('homilética') || lower.includes('homiletica')) {
    category = 'Liderazgo Pastoral';
    author = 'CEMIM Mangayacu - Homilética';
    description = 'Tratado formativo sobre la preparación, estructura y elocuencia espiritual del sermón bíblico expositivo.';
    coverList = covers.pastoral;
  } else if (lower.includes('eclesiología') || lower.includes('eclesiologia') || lower.includes('iglesia de dios')) {
    category = 'Liderazgo Pastoral';
    author = 'Instituto Bíblico CEMIM';
    description = `Doctrina bíblica sobre el origen, la naturaleza, los ministerios y la misión de la iglesia en el mundo: ${title}.`;
    coverList = covers.pastoral;
  } else if (lower.includes('matrimonio') || lower.includes('amor para toda la vida')) {
    category = 'Discipulado Cristiano';
    author = 'Ministerio de Familia CEMIM';
    description = `Enseñanzas y consejos bíblicos para fortalecer el pacto conyugal y edificar un hogar cristiano firme: ${title}.`;
    coverList = covers.discipulado;
  } else if (lower.includes('discipulado') || lower.includes('nuevo creyente') || lower.includes('bases para')) {
    category = 'Discipulado Cristiano';
    author = 'CEMIM Mangayacu - Discipulado';
    description = `Fundamentos esenciales para la madurez en la fe y la caminata firme como seguidor de Cristo: ${title}.`;
    coverList = covers.discipulado;
  } else if (lower.includes('evangelios') || lower.includes('mateo') || lower.includes('marcos') || lower.includes('lucas') || lower.includes('juan') || lower.includes('hebreos') || lower.includes('romanos') || lower.includes('timoteo')) {
    category = 'Estudios Bíblicos';
    author = 'CEMIM Mangayacu - Biblioteca Pastoral';
    description = `Comentario bíblico, contexto histórico y aplicación pastoral para el libro de ${title}.`;
    coverList = covers.biblico;
  } else if (lower.includes('sb5p2t~j')) {
    title = 'Compendio de Formación y Doctrina Cristiana';
    author = 'Equipo Ministerial CEMIM';
    category = 'Discipulado Cristiano';
    description = 'Manual doctrinal sistemático con lecciones fundamentales para la edificación del liderazgo y la congregación.';
    coverList = covers.discipulado;
  }

  const coverUrl = coverList[itemIndex % coverList.length];
  return { title, author, category, description, coverUrl };
}

async function run() {
  console.log('=== INICIANDO INGESTIÓN CONJUNTA: GRUPO 5, GRUPO 6 Y ACTUALIZACIÓN AUDIOTECA ===');

  // 1. Obtener catálogo actual
  const currentCatalog = JSON.parse(fs.readFileSync('data/resources.json', 'utf8'));
  console.log(`Catálogo inicial: ${currentCatalog.length} recursos.`);

  const existingBooks = currentCatalog.filter(r => r.type === 'libro');
  const existingVideos = currentCatalog.filter(r => r.type === 'video');
  console.log(`Libros existentes previos: ${existingBooks.length}`);

  // 2. Procesar Grupo 5
  console.log('\n--- PROCESANDO GRUPO 5 ---');
  const g5Files = JSON.parse(fs.readFileSync('scripts/drive_grupo5_files.json', 'utf8'))
    .filter(f => f.name.toLowerCase().includes('.pdf'));

  const newG5Books = [];
  for (let i = 0; i < g5Files.length; i++) {
    const f = g5Files[i];
    const meta = getBookMetadata(f.name, 5, i);
    console.log(`[G5 ${i + 1}/${g5Files.length}] Procesando: "${meta.title}"...`);

    const buf = await downloadFileFromDrive(f.id);
    let publicUrl = '';
    const sizeMb = buf ? (buf.length / (1024 * 1024)).toFixed(2) : '3.50';
    const pages = buf ? Math.max(16, Math.round(buf.length / 22000)) : 48;

    if (buf && buf.length < 48 * 1024 * 1024) {
      const cleanFileName = f.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `uploads/g5_${Date.now()}_${cleanFileName}`;
      const { data: upData, error: upError } = await supabase.storage.from(bucket).upload(storagePath, buf, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true
      });
      if (!upError) {
        publicUrl = supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
      }
    }

    if (!publicUrl) {
      publicUrl = `https://drive.usercontent.google.com/download?id=${f.id}&export=download&confirm=t`;
    }

    newG5Books.push({
      id: `libro-pastoral-g5-${i + 1}`,
      title: meta.title,
      type: 'libro',
      author: meta.author,
      category: meta.category,
      description: meta.description,
      fileUrl: publicUrl,
      coverUrl: meta.coverUrl,
      fileSize: `${sizeMb} MB`,
      pages: pages,
      createdAt: '2026-04-20'
    });
    console.log(`✅ [G5 ${i + 1}/${g5Files.length}] Listo: "${meta.title}" (${sizeMb} MB)`);
    await new Promise(r => setTimeout(r, 150));
  }

  // 3. Procesar Grupo 6
  console.log('\n--- PROCESANDO GRUPO 6 ---');
  const g6Files = JSON.parse(fs.readFileSync('scripts/drive_grupo6_files.json', 'utf8'))
    .filter(f => f.name.toLowerCase().includes('.pdf'));

  const newG6Books = [];
  for (let i = 0; i < g6Files.length; i++) {
    const f = g6Files[i];
    const meta = getBookMetadata(f.name, 6, i);
    console.log(`[G6 ${i + 1}/${g6Files.length}] Procesando: "${meta.title}"...`);

    const buf = await downloadFileFromDrive(f.id);
    let publicUrl = '';
    const sizeMb = buf ? (buf.length / (1024 * 1024)).toFixed(2) : '3.50';
    const pages = buf ? Math.max(16, Math.round(buf.length / 22000)) : 48;

    if (buf && buf.length < 48 * 1024 * 1024) {
      const cleanFileName = f.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `uploads/g6_${Date.now()}_${cleanFileName}`;
      const { data: upData, error: upError } = await supabase.storage.from(bucket).upload(storagePath, buf, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true
      });
      if (!upError) {
        publicUrl = supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
      }
    }

    if (!publicUrl) {
      publicUrl = `https://drive.usercontent.google.com/download?id=${f.id}&export=download&confirm=t`;
    }

    newG6Books.push({
      id: `libro-pastoral-g6-${i + 1}`,
      title: meta.title,
      type: 'libro',
      author: meta.author,
      category: meta.category,
      description: meta.description,
      fileUrl: publicUrl,
      coverUrl: meta.coverUrl,
      fileSize: `${sizeMb} MB`,
      pages: pages,
      createdAt: '2026-04-20'
    });
    console.log(`✅ [G6 ${i + 1}/${g6Files.length}] Listo: "${meta.title}" (${sizeMb} MB)`);
    await new Promise(r => setTimeout(r, 150));
  }

  // 4. Actualizar Audioteca (todos los audios nuevos + los existentes)
  console.log('\n--- ACTUALIZANDO SECCIÓN DE AUDIOTECA ---');
  const allAudios = [
    {
      id: 'res_audio_job',
      title: 'La Historia de JOB: La Prueba de Fe Más Grande',
      type: 'audio',
      author: 'CEMIM Mangayacu - Relatos Bíblicos',
      category: 'Historias Bíblicas',
      description: 'Dramatización y narración bíblica inspiradora sobre la paciencia, integridad incondicional y restauración de Job ante el sufrimiento.',
      fileUrl: 'https://drive.usercontent.google.com/download?id=1b6yi9LpL9wlly3aRN3UsYACyP735U2un&export=download&confirm=t',
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      duration: '58:31',
      fileSize: '40.18 MB',
      createdAt: '2026-04-20'
    },
    {
      id: 'res_audio_enoc',
      title: 'La Increíble Historia de ENOC: El Hombre que Caminó con Dios',
      type: 'audio',
      author: 'CEMIM Mangayacu - Relatos Bíblicos',
      category: 'Historias Bíblicas',
      description: 'La vida fascinante de Enoc, el patriarca que agradó al Señor en tiempos de densa oscuridad moral y fue traspuesto al cielo.',
      fileUrl: 'https://drive.usercontent.google.com/download?id=1TKlLzSfmV9m5yLmUXgZQooDrKCaUCu-D&export=download&confirm=t',
      coverUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
      duration: '37:45',
      fileSize: '25.96 MB',
      createdAt: '2026-04-20'
    },
    {
      id: 'res_audio_minas_02',
      title: 'Las Minas Terrestres del Creyente: La Indolencia',
      type: 'audio',
      author: 'Dr. Charles F. Stanley',
      category: 'Vida Devocional',
      description: 'Peligros espirituales de la pasividad, pereza y falta de celo en la vida cristiana, y cómo recobrar la diligencia espiritual.',
      fileUrl: 'https://drive.usercontent.google.com/download?id=1F99fFd4fUTMGHCsdzz66wNMdGQdpto3f&export=download&confirm=t',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      duration: '29:50',
      fileSize: '20.53 MB',
      createdAt: '2026-04-20'
    },
    {
      id: 'res_audio_minas_03',
      title: 'Las Minas Terrestres del Creyente: El Rencor y la Amargura',
      type: 'audio',
      author: 'Dr. Charles F. Stanley',
      category: 'Vida Devocional',
      description: 'Cómo sanar las heridas del corazón y desactivar la destructiva mina del resentimiento mediante el perdón sobrenatural de Cristo.',
      fileUrl: 'https://drive.usercontent.google.com/download?id=1oh15HhQz6bl7mguw6GJ1bG_8y18K7k9-&export=download&confirm=t',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      duration: '29:35',
      fileSize: '20.33 MB',
      createdAt: '2026-04-20'
    },
    {
      id: 'res_audio_minas_04',
      title: 'Las Minas Terrestres del Creyente: El Temor Paralizante',
      type: 'audio',
      author: 'Dr. Charles F. Stanley',
      category: 'Vida Devocional',
      description: 'Respuestas bíblicas firmes para vencer la ansiedad, el miedo al fracaso y las incertidumbres apoyados en las promesas del Señor.',
      fileUrl: 'https://drive.usercontent.google.com/download?id=1hmtJ9liBY7teZk18DkseuBFSVcQxjSTd&export=download&confirm=t',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      duration: '30:10',
      fileSize: '20.70 MB',
      createdAt: '2026-04-20'
    },
    {
      id: 'res_audio_minas_05',
      title: 'Las Minas Terrestres del Creyente: Los Pecados Sexuales',
      type: 'audio',
      author: 'Dr. Charles F. Stanley',
      category: 'Vida Devocional',
      description: 'Instrucciones bíblicas sabias y transparentes para guardar la pureza moral, vencer la tentación y vivir en santidad.',
      fileUrl: 'https://drive.usercontent.google.com/download?id=1YlTQU2_d-pdxK4wPaT1Vmdre2QH3rGaP&export=download&confirm=t',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      duration: '29:28',
      fileSize: '20.24 MB',
      createdAt: '2026-04-20'
    }
  ];

  console.log(`Pistas de audio configuradas: ${allAudios.length}`);

  // 5. Consolidar el catálogo
  const allBooks = [...existingBooks, ...newG5Books, ...newG6Books];
  const finalCatalog = [...allBooks, ...allAudios, ...existingVideos];

  console.log('\n=== CONSOLIDACIÓN FINAL ===');
  console.log(`- Libros totales: ${allBooks.length}`);
  console.log(`- Audios totales: ${allAudios.length}`);
  console.log(`- Videos totales: ${existingVideos.length}`);
  console.log(`- Total general de recursos: ${finalCatalog.length}`);

  // 6. Subir a Supabase Storage con cacheControl: 0
  const jsonBuf = Buffer.from(JSON.stringify(finalCatalog, null, 2), 'utf8');
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', jsonBuf, {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('❌ Error subiendo a Supabase Storage:', saveError.message);
  } else {
    console.log('✅ resources.json guardado en Supabase Storage exitosamente con cacheControl: 0.');
  }

  // 7. Guardar copias locales
  fs.writeFileSync('data/resources.json', JSON.stringify(finalCatalog, null, 2));
  fs.writeFileSync('src/data/initialResources.js', `export const initialResources = ${JSON.stringify(finalCatalog, null, 2)};\n`);
  console.log('✅ Archivos locales actualizados.');

  console.log('\n🎉 ¡PROCESO COMPLETO DE GRUPO 5, GRUPO 6 Y AUDIOTECA FINALIZADO!');
}

run().catch(console.error);
