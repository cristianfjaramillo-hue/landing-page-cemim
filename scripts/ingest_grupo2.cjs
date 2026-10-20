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

// Curated HD covers
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

function formatMetadataG2(fileName, index) {
  const lower = fileName.toLowerCase();
  let title = fileName.replace(/\.pdf$/i, '').trim();
  let author = 'CEMIM Mangayacu - Biblioteca Pastoral';
  let category = 'Estudios Bíblicos';
  let description = '';
  let coverList = covers.biblico;

  if (lower.includes('tozer')) {
    title = 'La Vida Más Profunda';
    author = 'A. W. Tozer';
    category = 'Vida Devocional';
    description = 'Un clásico imprescindible sobre la consagración radical, el llenado del Espíritu Santo y una comunión íntima e innegociable con Dios.';
    coverList = covers.devocional;
  } else if (lower.includes('smalling')) {
    title = 'Avivamiento Personal: El Fuego del Espíritu en el Creyente';
    author = 'Roger L. Smalling';
    category = 'Vida Devocional';
    description = 'Pautas bíblicas transformadoras para reavivar la llama espiritual, el arrepentimiento genuino y el poder del evangelio en el servicio cristiano.';
    coverList = covers.devocional;
  } else if (lower.includes('notas para maestros')) {
    title = 'Notas para Maestros: Principios de Vida';
    author = 'Equipo Ministerial CEMIM';
    category = 'Liderazgo Pastoral';
    description = 'Guía pedagógica ministerial con bosquejos, preguntas didácticas y aplicaciones prácticas para la formación de discípulos y líderes misioneros.';
    coverList = covers.pastoral;
  } else if (lower.includes('abraham')) {
    title = 'Abraham: La Obediencia de la Fe';
    category = 'Estudios Bíblicos';
    description = 'Un exhaustivo recorrido por la vida del patriarca Abraham, modelo de confianza incondicional, prueba y recompensa en las promesas del Señor.';
    coverList = covers.biblico;
  } else if (lower.includes('antiguo testamento')) {
    title = 'Panorama Integral del Antiguo Testamento';
    category = 'Estudios Bíblicos';
    description = 'Manual panorámico de introducción bíblica: contexto histórico, geográfico, pactos divinos y tipología mesiánica desde Génesis hasta Malaquías.';
    coverList = covers.biblico;
  } else if (lower.includes('joel z')) {
    title = 'Apocalipsis: Revelación y Esperanza Profética';
    author = 'Joel Z.';
    category = 'Estudios Bíblicos';
    description = 'Comentario y análisis exegético sobre las visiones proféticas del libro de Apocalipsis, la victoria del Cordero y el reino venidero.';
    coverList = covers.biblico;
  } else if (lower.includes('nahum') || lower.includes('malaquías')) {
    title = 'Profetas Menores: Nahum a Malaquías';
    category = 'Estudios Bíblicos';
    description = 'Estudio exegético y mensaje profético de Nahum, Habacuc, Sofonías, Hageo, Zacarías y Malaquías.';
    coverList = covers.biblico;
  } else if (lower.includes('mateo')) {
    title = 'Evangelio según San Mateo - El Rey y su Reino';
    category = 'Estudios Bíblicos';
    description = 'Comentario expositivo sobre el Evangelio de Mateo, el cumplimiento de las profecías mesiánicas y el sermón del monte.';
    coverList = covers.biblico;
  } else if (lower.includes('marcos')) {
    title = 'Evangelio según San Marcos - El Siervo Obediente';
    category = 'Estudios Bíblicos';
    description = 'Estudio dinámico del ministerio de Jesús como Siervo sufriente, sanador y Salvador victorioso.';
    coverList = covers.biblico;
  } else if (lower.includes('lucas')) {
    title = 'Evangelio según San Lucas - El Salvador de los Hombres';
    category = 'Estudios Bíblicos';
    description = 'Comentario versículo a versículo sobre el Evangelio de Lucas, la gracia para los pecadores y la misericordia universal de Dios.';
    coverList = covers.biblico;
  } else if (lower.includes('juan')) {
    title = 'Evangelio según San Juan - El Verbo Encarnado';
    category = 'Estudios Bíblicos';
    description = 'Reflexión y exégesis teológica del Evangelio de Juan: las señales milagrosas, la divinidad de Jesucristo y la vida eterna.';
    coverList = covers.biblico;
  } else if (lower.includes('hechos')) {
    title = 'Hechos de los Apóstoles - Misión y Expansión de la Iglesia';
    category = 'Liderazgo Pastoral';
    description = 'El mover del Espíritu Santo, la valentía de los primeros apóstoles y las lecciones fundacionales para la labor misionera transcultural.';
    coverList = covers.pastoral;
  } else if (lower.includes('romanos')) {
    title = 'Epístola a los Romanos - La Justicia de Dios por la Fe';
    category = 'Estudios Bíblicos';
    description = 'La obra cumbre doctrinal del apóstol Pablo sobre la justificación, la santificación y la soberanía de Dios.';
    coverList = covers.biblico;
  } else if (lower.includes('corintios')) {
    title = '1 y 2 Corintios - Ministerio Apostólico y Orden en la Iglesia';
    category = 'Liderazgo Pastoral';
    description = 'Instrucciones paulinas sobre los dones espirituales, la resolución de conflictos, la disciplina y el poder en la debilidad.';
    coverList = covers.pastoral;
  } else if (lower.includes('gálatas') || lower.includes('filemón')) {
    title = 'Epístolas Paulinas: Gálatas a Filemón';
    category = 'Estudios Bíblicos';
    description = 'Colección de cartas de Pablo con enseñanzas sobre la gracia salvadora, la vida cristiana comunitaria y el liderazgo pastoral.';
    coverList = covers.biblico;
  } else if (lower.includes('hebreos') || lower.includes('judas')) {
    title = 'Epístolas Generales: Hebreos a Judas';
    category = 'Estudios Bíblicos';
    description = 'Exégesis profunda de la superioridad del sacerdocio de Cristo en Hebreos y las cartas de Santiago, Pedro, Juan y Judas.';
    coverList = covers.biblico;
  } else if (lower.includes('apocalipsis')) {
    title = 'Apocalipsis - Victoria Final y Triunfo del Cordero';
    category = 'Estudios Bíblicos';
    description = 'Estudio de las visiones de Juan, la consumación de los tiempos, la derrota del mal y la gloriosa eternidad prometida.';
    coverList = covers.biblico;
  } else if (lower.includes('salmos')) {
    title = 'Salmos - Alabanza, Adoración y Oración Poética';
    category = 'Vida Devocional';
    description = 'Cántico y devoción espiritual para el creyente en tiempos de aflicción, gratitud, victoria y reverencia ante el Altísimo.';
    coverList = covers.devocional;
  } else if (lower.includes('proverbios')) {
    title = 'Proverbios - Sabiduría Divina para la Vida Diaria';
    category = 'Discipulado Cristiano';
    description = 'Máximas de sabiduría práctica inspirada para edificar la familia, guiar las decisiones morales y honrar al Creador.';
    coverList = covers.discipulado;
  } else if (lower.includes('eclesiastés')) {
    title = 'Eclesiastés - El Sentido de la Vida y el Temor de Dios';
    category = 'Vida Devocional';
    description = 'Reflexión profunda sobre la vanidad de los placeres temporales y la trascendencia del propósito eterno bajo el sol.';
    coverList = covers.devocional;
  } else if (lower.includes('cantares')) {
    title = 'Cantares - Belleza del Amor y Comunión con Dios';
    category = 'Vida Devocional';
    description = 'Alegoría poética del pacto de amor conyugal y el apasionado vínculo redentor entre Cristo y Su amada Iglesia.';
    coverList = covers.devocional;
  } else if (lower.includes('job')) {
    title = 'Job - La Soberanía de Dios ante el Sufrimiento';
    category = 'Vida Devocional';
    description = 'Tratado teológico sobre la fe inquebrantable, las preguntas del alma afligida y la revelación majestuosa de Dios.';
    coverList = covers.devocional;
  } else {
    const cleanBookName = title.replace(/^\d+\.\s*/, '').trim();
    title = `${cleanBookName} - Comentario Bíblico y Exégesis`;
    description = `Comentario versículo a versículo, contexto histórico, teológico y bosquejos expositivos del libro de ${cleanBookName}.`;
    category = 'Estudios Bíblicos';
    coverList = covers.biblico;
  }

  const coverUrl = coverList[index % coverList.length];
  return { title, author, category, description, coverUrl };
}

async function ingestGrupo2() {
  console.log('=== INICIANDO INGESTIÓN DE LIBROS GRUPO 2 ===');

  const files = JSON.parse(fs.readFileSync('scripts/drive_grupo2_files.json', 'utf8'));
  console.log(`Total archivos en Grupo 2: ${files.length}`);

  // 1. Obtener catálogo actual de Supabase
  const resCatalog = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });

  let currentCatalog = [];
  if (resCatalog.ok) {
    currentCatalog = await resCatalog.json();
    console.log(`Catálogo actual en Supabase: ${currentCatalog.length} recursos existentes.`);
  } else {
    console.warn('No se pudo descargar el catálogo actual, leyendo data/resources.json local.');
    if (fs.existsSync('data/resources.json')) {
      currentCatalog = JSON.parse(fs.readFileSync('data/resources.json', 'utf8'));
    }
  }

  const existingBookCount = currentCatalog.filter(r => r.type === 'libro').length;
  console.log(`Libros existentes antes de esta carga: ${existingBookCount}`);

  const newG2Books = [];

  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    const meta = formatMetadataG2(item.name, i);
    const dlUrl = `https://drive.google.com/uc?export=download&id=${item.id}`;

    console.log(`\n[${i + 1}/${files.length}] Descargando: "${item.name}"...`);

    try {
      const resp = await fetch(dlUrl, { redirect: 'follow' });
      if (!resp.ok) {
        console.error(`❌ Error HTTP ${resp.status} al descargar ${item.name}`);
        continue;
      }

      const buf = Buffer.from(await resp.arrayBuffer());
      if (!buf.subarray(0, 5).toString('ascii').startsWith('%PDF')) {
        console.warn(`⚠️ "${item.name}" no parece ser un PDF válido. Ignorando.`);
        continue;
      }

      const cleanFileName = item.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `uploads/g2_${Date.now()}_${cleanFileName}`;

      const { data: upData, error: upError } = await supabase.storage.from(bucket).upload(storagePath, buf, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true
      });

      if (upError) {
        console.error(`❌ Error subiendo a Supabase Storage:`, upError.message);
        continue;
      }

      const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      const publicUrl = pubData.publicUrl;
      const sizeMb = `${(buf.length / (1024 * 1024)).toFixed(2)} MB`;
      const pages = Math.max(18, Math.round(buf.length / 22000));

      const newBook = {
        id: `libro-pastoral-g2-${i + 1}`,
        title: meta.title,
        type: 'libro',
        author: meta.author,
        category: meta.category,
        description: meta.description,
        fileUrl: publicUrl,
        coverUrl: meta.coverUrl,
        fileSize: sizeMb,
        pages: pages,
        createdAt: '2026-04-20'
      };

      newG2Books.push(newBook);
      console.log(`✅ [${i + 1}/${files.length}] Guardado en Supabase: "${meta.title}" (${sizeMb}, ~${pages} págs)`);

      // Breve pausa para cuidar rate-limits
      await new Promise(r => setTimeout(r, 250));
    } catch (err) {
      console.error(`❌ Excepción procesando ${item.name}:`, err.message);
    }
  }

  console.log(`\n=== Procesamiento de archivos finalizado. Nuevos libros procesados: ${newG2Books.length} ===`);

  // Combinar catálogo: libros existentes + nuevos libros G2 + audios y videos existentes
  // Aseguramos que los libros queden juntos y los audios/videos al final
  const existingBooks = currentCatalog.filter(r => r.type === 'libro');
  const existingNonBooks = currentCatalog.filter(r => r.type !== 'libro');

  const updatedCatalog = [...existingBooks, ...newG2Books, ...existingNonBooks];
  console.log(`Total catálogo final consolidado: ${updatedCatalog.length} recursos.`);
  console.log(`- Libros totales: ${existingBooks.length + newG2Books.length}`);
  console.log(`- Audios/Videos totales: ${existingNonBooks.length}`);

  // Subir el nuevo resources.json consolidado a Supabase Storage
  console.log('Subiendo nuevo resources.json a Supabase Storage...');
  const jsonBuf = Buffer.from(JSON.stringify(updatedCatalog, null, 2), 'utf8');
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', jsonBuf, {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('❌ Error guardando resources.json en Supabase:', saveError.message);
  } else {
    console.log('✅ resources.json actualizado exitosamente en Supabase Storage con cacheControl: 0');
  }

  // Guardar copia local en data/resources.json
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'resources.json'), JSON.stringify(updatedCatalog, null, 2));
  console.log('✅ data/resources.json local actualizado.');

  // Actualizar src/data/initialResources.js
  const jsContent = `export const initialResources = ${JSON.stringify(updatedCatalog, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'initialResources.js'), jsContent);
  console.log('✅ src/data/initialResources.js actualizado.');

  console.log('\n🎉 ¡PROCESO DE INGESTIÓN DEL GRUPO 2 COMPLETADO CON ÉXITO!');
}

ingestGrupo2().catch(err => {
  console.error('Error fatal:', err);
});
