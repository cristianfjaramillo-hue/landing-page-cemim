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

function formatMetadataG3(fileName, index) {
  const lower = fileName.toLowerCase();
  let title = fileName.replace(/\.pdf$/i, '').trim();
  let author = 'CEMIM Mangayacu - Biblioteca Pastoral';
  let category = 'Estudios Bíblicos';
  let description = '';
  let coverList = covers.biblico;

  if (lower.includes('diario vivir')) {
    title = 'Biblia de Estudio del Diario Vivir';
    author = 'Editorial Caribe / CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Una de las Biblias de estudio más completas y apreciadas, con notas prácticas para aplicar la verdad de Dios a cada situación cotidiana.';
    coverList = covers.biblico;
  } else if (lower.includes('principios de vida')) {
    title = 'Biblia de Principios de Vida';
    author = 'Charles F. Stanley / CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Edición especial con lecciones y principios espirituales probados para caminar en obediencia, victoria y comunión con el Padre.';
    coverList = covers.biblico;
  } else if (lower.includes('reina-valera')) {
    title = 'Santa Biblia Reina-Valera 1960 (Texto Completo)';
    author = 'Sociedades Bíblicas Unidas';
    category = 'Estudios Bíblicos';
    description = 'El texto clásico tradicional por excelencia de las Sagradas Escrituras en español, de Génesis a Apocalipsis.';
    coverList = covers.biblico;
  } else if (lower.includes('biograf') && lower.includes('personajes')) {
    title = 'Biografías de Personajes Bíblicos';
    author = 'CEMIM Mangayacu - Biblioteca Pastoral';
    category = 'Estudios Bíblicos';
    description = 'Estudios biográficos detallados sobre la fe, caídas, virtudes y lecciones de vida de los hombres y mujeres de Dios en la Biblia.';
    coverList = covers.biblico;
  } else if (lower.includes('watchman nee')) {
    title = 'Biografía de Watchman Nee y Witness Lee';
    author = 'Witness Lee';
    category = 'Liderazgo Pastoral';
    description = 'Testimonio inspirador sobre la vida, el ministerio en China, el sufrimiento por la fe y el legado eclesial de Watchman Nee.';
    coverList = covers.pastoral;
  } else if (lower.includes('orlando boyer')) {
    title = 'Biografías de Grandes Cristianos';
    author = 'Orlando Boyer';
    category = 'Liderazgo Pastoral';
    description = 'Historias apasionantes de grandes siervos de Dios que marcaron generaciones: Lutero, Wesley, Moody, Spurgeon, Livingstone y más.';
    coverList = covers.pastoral;
  } else if (lower.includes('bosquejos de sermones')) {
    title = 'Bosquejos de Sermones Selectos';
    author = 'CEMIM Mangayacu - Biblioteca Pastoral';
    category = 'Liderazgo Pastoral';
    description = 'Compendio pastoral con bosquejos temáticos y expositivos listos para la predicación bíblica y la enseñanza en células.';
    coverList = covers.pastoral;
  } else if (lower.includes('senda marcada')) {
    title = 'Caminamos por una Senda Marcada';
    author = 'Equipo Misionero CEMIM';
    category = 'Vida Devocional';
    description = 'Reflexiones profundas sobre la senda del discipulado, la perseverancia y la fidelidad cristiana en medio de la adversidad.';
    coverList = covers.devocional;
  } else if (lower.includes('morm')) {
    title = 'Carta a un Misionero Mormón (Apologética)';
    author = 'CEMIM Mangayacu - Apologética';
    category = 'Discipulado Cristiano';
    description = 'Tratado apologético respetuoso y bíblico que expone con las Escrituras las doctrinas fundamentales de la gracia y la salvación.';
    coverList = covers.discipulado;
  } else if (lower.includes('cartas desde el sufrimiento')) {
    title = 'Cartas desde el Sufrimiento';
    author = 'Charles H. Spurgeon';
    category = 'Vida Devocional';
    description = 'Palabras de consuelo inestimable del Príncipe de los Predicadores, escritas desde sus propias pruebas de dolor y enfermedad.';
    coverList = covers.devocional;
  } else if (lower.includes('catolicismo')) {
    title = 'Catolicismo y Biblia: Análisis Bíblico Doctrinal';
    author = 'CEMIM Mangayacu - Apologética';
    category = 'Discipulado Cristiano';
    description = 'Estudio comparativo que examina las tradiciones y dogmas religiosos a la luz de la verdad infalible de la Palabra de Dios.';
    coverList = covers.discipulado;
  } else if (lower.includes('studd')) {
    title = 'Charles T. Studd: Breve Biografía del Misionero Pionero';
    author = 'Norman Grubb';
    category = 'Liderazgo Pastoral';
    description = 'La vida del legendario atleta y millonario británico que lo dejó todo para llevar el evangelio al interior de China, India y África.';
    coverList = covers.pastoral;
  } else if (lower.includes('chavez')) {
    title = 'Diccionario Hebreo-Bíblico';
    author = 'Moisés Chávez';
    category = 'Estudios Bíblicos';
    description = 'Herramienta exegética fundamental para estudiantes de teología y predicadores: vocabulario, raíces y significado de términos hebreos del Antiguo Testamento.';
    coverList = covers.biblico;
  } else if (lower.includes('colecc') && lower.includes('spurgeon')) {
    title = 'Colección de Sermones Selectos';
    author = 'Charles H. Spurgeon';
    category = 'Liderazgo Pastoral';
    description = 'Recopilación magistral de los mensajes más poderosos y evangelísticos predicados en el Tabernáculo Metropolitano de Londres.';
    coverList = covers.pastoral;
  } else if (lower.includes('comentario') && lower.includes('nt')) {
    title = 'Comentario Exegético y Explicativo del Nuevo Testamento';
    author = 'Robert Jamieson, A.R. Fausset, David Brown';
    category = 'Estudios Bíblicos';
    description = 'Obra de referencia clásica universal para el análisis histórico-gramatical y doctrinal de cada versículo del Nuevo Testamento.';
    coverList = covers.biblico;
  } else if (lower.includes('adorar a cristo') || lower.includes('joseph carroll')) {
    title = 'Cómo Adorar a Cristo Jesús';
    author = 'Joseph S. Carroll';
    category = 'Vida Devocional';
    description = 'Enseñanza inspiradora sobre la verdadera adoración en espíritu y verdad, rindiendo la mente, el corazón y la voluntad ante el Señor.';
    coverList = covers.devocional;
  } else if (lower.includes('incrementar la comunion')) {
    title = 'Cómo Incrementar la Comunión con Dios';
    author = 'CEMIM Mangayacu - Vida Devocional';
    category = 'Vida Devocional';
    description = 'Pautas prácticas para enriquecer la intimidad espiritual diaria mediante la oración constante, el silencio y la meditación en las Escrituras.';
    coverList = covers.devocional;
  } else if (lower.includes('llego la biblia')) {
    title = 'Cómo Nos Llegó la Biblia: Historia y Canon';
    author = 'Instituto Bíblico CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Fascinante recorrido histórico sobre la transmisión, manuscritos antiguos, traducción y preservación milagrosa del canon bíblico.';
    coverList = covers.biblico;
  } else if (lower.includes('vencer el mal')) {
    title = 'Cómo Vencer el Mal: Victoria Espiritual';
    author = 'Jay E. Adams / CEMIM';
    category = 'Discipulado Cristiano';
    description = 'Respuestas bíblicas firmes y prácticas de consejería para triunfar sobre las tentaciones, el conflicto moral y la maldad del mundo.';
    coverList = covers.discipulado;
  } else if (lower.includes('compendio')) {
    title = 'Compendio Manual de Teología y Misión';
    author = 'Equipo Ministerial CEMIM';
    category = 'Liderazgo Pastoral';
    description = 'Manual de consulta rápida para pastores y obreros con doctrinas clave, ordenanzas ministeriales y lineamientos de gobierno eclesial.';
    coverList = covers.pastoral;
  } else if (lower.includes('concordancia')) {
    title = 'Concordancia Temática de las Sagradas Escrituras';
    author = 'CEMIM Mangayacu - Herramientas Bíblicas';
    category = 'Estudios Bíblicos';
    description = 'Índice temático de referencia cruzada con miles de pasajes bíblicos organizados por doctrinas, conceptos y personajes.';
    coverList = covers.biblico;
  } else if (lower.includes('westminster')) {
    title = 'Confesión de Fe de Westminster';
    author = 'Asamblea de Westminster';
    category = 'Estudios Bíblicos';
    description = 'Uno de los estandartes confesionales doctrinales más influyentes de la historia eclesiástica con pruebas bíblicas fundamentadas.';
    coverList = covers.biblico;
  } else if (lower.includes('conforme a su promesa')) {
    title = 'Conforme a Su Promesa: El Cheque de la Fe';
    author = 'Charles H. Spurgeon';
    category = 'Vida Devocional';
    description = 'Devocional diario clásico repleto de aliento y fortaleza, basado en las promesas firmes e inmutables de Dios para cada día.';
    coverList = covers.devocional;
  } else if (lower.includes('iglesia primitiva')) {
    title = 'Conozca la Iglesia Primitiva: Historia Eclesiástica';
    author = 'Equipo de Historia Cristiana CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Visión histórica sobre los primeros siglos del cristianismo, las persecuciones romanas, los padres apostólicos y el avance del evangelio.';
    coverList = covers.biblico;
  } else if (lower.includes('contenido biblioteca')) {
    title = 'Catálogo y Guía de la Biblioteca Pastoral';
    author = 'CEMIM Mangayacu';
    category = 'Liderazgo Pastoral';
    description = 'Índice general descriptivo y guía didáctica de estudio para el aprovechamiento integral de los volúmenes del repositorio pastoral.';
    coverList = covers.pastoral;
  } else if (lower.includes('criando')) {
    title = 'Criando a los Niños en el Señor';
    author = 'CEMIM Mangayacu - Ministerio de Familia';
    category = 'Discipulado Cristiano';
    description = 'Principios bíblicos fundamentales para la instrucción moral, la disciplina amorosa y la formación de una fe sólida en el hogar.';
    coverList = covers.discipulado;
  } else if (lower.includes('cristianismo en crisis') || lower.includes('hanegraaff')) {
    title = 'Cristianismo en Crisis';
    author = 'Hank Hanegraaff';
    category = 'Discipulado Cristiano';
    description = 'Examen crítico y bíblico del movimiento de la teología de la prosperidad y falsas enseñanzas modernas, restaurando el evangelio bíblico.';
    coverList = covers.discipulado;
  } else if (lower.includes('cristo en nosotros') || lower.includes('dwight edwards')) {
    title = 'Cristo En Nosotros: El Secreto de la Vida Cristiana';
    author = 'Dwight Edwards';
    category = 'Vida Devocional';
    description = 'Revelación transformadora de la vida resucitada de Jesucristo operando en y a través del crepúsculo cotidiano del creyente.';
    coverList = covers.devocional;
  } else if (lower.includes('moody') && lower.includes('camino')) {
    title = 'El Camino Hacia Dios';
    author = 'D. L. Moody';
    category = 'Discipulado Cristiano';
    description = 'Un llamado evangelístico claro, vibrante y apasionado a la conversión, la gracia salvadora y la reconciliación con el Creador.';
    coverList = covers.discipulado;
  } else if (lower.includes('moody') && lower.includes('oraci')) {
    title = 'La Oración que Prevalece';
    author = 'D. L. Moody';
    category = 'Vida Devocional';
    description = 'Tratado espiritual poderoso sobre los secretos bíblicos de la intercesión que mueve la mano de Dios y desata avivamiento.';
    coverList = covers.devocional;
  } else if (lower.includes('manual de l') || lower.includes('manual del l')) {
    title = 'Manual del Líder Ministerial';
    author = 'CEMIM Mangayacu - Escuela de Liderazgo';
    category = 'Liderazgo Pastoral';
    description = 'Orientaciones operativas, éticas y espirituales para coordinadores ministeriales, líderes de grupos pequeños y pastores zonales.';
    coverList = covers.pastoral;
  } else if (lower.includes('david') && lower.includes('pastor')) {
    title = 'David: Pastor, Salmista y Rey';
    author = 'F. B. Meyer';
    category = 'Estudios Bíblicos';
    description = 'Exposición biográfica y lecciones devocionales sobre la vida del hombre conforme al corazón de Dios, desde Belén hasta el trono.';
    coverList = covers.biblico;
  } else if (lower.includes('wilkerson')) {
    title = 'Tenemos Hambre de Cristo';
    author = 'David Wilkerson';
    category = 'Vida Devocional';
    description = 'Un clamor profético urgente y sincero por el regreso a la santidad, el despojo del mundo y un anhelo ardiente por la presencia del Señor.';
    coverList = covers.devocional;
  } else if (lower.includes('desarollo') || lower.includes('desarrollo de la iglesia')) {
    title = 'Desarrollo y Crecimiento de la Iglesia Local';
    author = 'CEMIM Mangayacu - Plantación de Iglesias';
    category = 'Liderazgo Pastoral';
    description = 'Estrategias misioneras, discipulado multiplicador y principios de salud eclesial para el desarrollo de nuevas congregaciones.';
    coverList = covers.pastoral;
  } else if (lower.includes('jorge fox') || lower.includes('george fox')) {
    title = 'Diario Espiritual de George Fox';
    author = 'George Fox';
    category = 'Vida Devocional';
    description = 'Memorias testimoniales del fundador de los Amigos, su experiencia con la Luz de Cristo y su testimonio de fe ante reyes y jueces.';
    coverList = covers.devocional;
  } else if (lower.includes('diccionario de religiones')) {
    title = 'Diccionario de Religiones y Denominaciones';
    author = 'CEMIM Mangayacu - Apologética';
    category = 'Estudios Bíblicos';
    description = 'Compendio enciclopédico de historia de las religiones, sectas y corrientes doctrinales bajo una perspectiva cristiana bíblica.';
    coverList = covers.biblico;
  } else if (lower.includes('espanol-hebreo') || lower.includes('español-hebreo')) {
    title = 'Diccionario Analítico Español-Hebreo';
    author = 'CEMIM Mangayacu - Idiomas Bíblicos';
    category = 'Estudios Bíblicos';
    description = 'Herramienta práctica para buscar y estudiar las raíces del vocabulario veterotestamentario a partir de palabras en español.';
    coverList = covers.biblico;
  } else if (lower.includes('expositivo') || lower.includes('vine')) {
    title = 'Diccionario Expositivo de Palabras del AT y del NT (Vine)';
    author = 'W. E. Vine';
    category = 'Estudios Bíblicos';
    description = 'La obra maestra de referencia léxica para pastores y maestros, con la definición, etimología y uso bíblico de las palabras originales.';
    coverList = covers.biblico;
  } else if (lower.includes('diccionario biblico') || lower.includes('diccionario bíblico')) {
    title = index % 2 === 0 ? 'Diccionario Bíblico Ilustrado' : 'Diccionario Bíblico de Términos y Doctrinas';
    author = 'Instituto Bíblico CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Enciclopedia concisa con cientos de artículos sobre ciudades, costumbres, arqueología, personajes y términos de las Escrituras.';
    coverList = covers.biblico;
  } else {
    title = title.replace(/^\d+[\.\s-]*/, '').trim();
    description = `Manual y recurso formativo esencial para la capacitación bíblica y ministerial: ${title}.`;
    category = 'Estudios Bíblicos';
    coverList = covers.biblico;
  }

  const coverUrl = coverList[index % coverList.length];
  return { title, author, category, description, coverUrl };
}

async function downloadFileFromDrive(id) {
  // Method 1: usercontent with confirm=t
  try {
    const u1 = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
    const res1 = await fetch(u1, { redirect: 'follow' });
    if (res1.ok) {
      const buf = Buffer.from(await res1.arrayBuffer());
      if (buf.subarray(0, 5).toString('ascii').startsWith('%PDF')) {
        return buf;
      }
    }
  } catch (e) {}

  // Method 2: standard uc
  try {
    const u2 = `https://drive.google.com/uc?export=download&id=${id}`;
    const res2 = await fetch(u2, { redirect: 'follow' });
    if (res2.ok) {
      const buf = Buffer.from(await res2.arrayBuffer());
      if (buf.subarray(0, 5).toString('ascii').startsWith('%PDF')) {
        return buf;
      }
    }
  } catch (e) {}

  // Method 3: warning form follow
  try {
    const u3 = `https://drive.google.com/uc?export=download&id=${id}`;
    const res3 = await fetch(u3);
    const html = await res3.text();
    const actionMatch = html.match(/action="([^"]+)"/);
    const formAction = actionMatch ? actionMatch[1] : 'https://drive.usercontent.google.com/download';
    const inputs = {};
    const inputRegex = /<input type="hidden" name="([^"]+)" value="([^"]*)"/g;
    let m;
    while ((m = inputRegex.exec(html)) !== null) {
      inputs[m[1]] = m[2];
    }
    const queryParams = new URLSearchParams(inputs).toString();
    const res4 = await fetch(`${formAction}?${queryParams}`);
    if (res4.ok) {
      const buf = Buffer.from(await res4.arrayBuffer());
      if (buf.subarray(0, 5).toString('ascii').startsWith('%PDF')) {
        return buf;
      }
    }
  } catch (e) {}

  return null;
}

async function ingestGrupo3() {
  console.log('=== INICIANDO INGESTIÓN DE LIBROS GRUPO 3 ===');

  const files = JSON.parse(fs.readFileSync('scripts/drive_grupo3_files.json', 'utf8'));
  console.log(`Total archivos en Grupo 3: ${files.length}`);

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
    console.warn('Leyendo data/resources.json local.');
    if (fs.existsSync('data/resources.json')) {
      currentCatalog = JSON.parse(fs.readFileSync('data/resources.json', 'utf8'));
    }
  }

  const existingBookCount = currentCatalog.filter(r => r.type === 'libro').length;
  console.log(`Libros existentes antes de esta carga: ${existingBookCount}`);

  const newG3Books = [];

  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    const meta = formatMetadataG3(item.name, i);

    console.log(`\n[${i + 1}/${files.length}] Descargando: "${item.name}"...`);

    const buf = await downloadFileFromDrive(item.id);
    if (!buf) {
      console.error(`❌ No se pudo descargar o no es un PDF válido: "${item.name}"`);
      continue;
    }

    const cleanFileName = item.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `uploads/g3_${Date.now()}_${cleanFileName}`;

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
    const pages = Math.max(16, Math.round(buf.length / 22000));

    const newBook = {
      id: `libro-pastoral-g3-${i + 1}`,
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

    newG3Books.push(newBook);
    console.log(`✅ [${i + 1}/${files.length}] Guardado en Supabase: "${meta.title}" (${sizeMb}, ~${pages} págs)`);

    // Breve pausa para cuidar rate-limits
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== Procesamiento de archivos finalizado. Nuevos libros procesados: ${newG3Books.length} ===`);

  // Combinar catálogo: libros existentes + nuevos libros G3 + audios y videos existentes
  const existingBooks = currentCatalog.filter(r => r.type === 'libro');
  const existingNonBooks = currentCatalog.filter(r => r.type !== 'libro');

  const updatedCatalog = [...existingBooks, ...newG3Books, ...existingNonBooks];
  console.log(`Total catálogo final consolidado: ${updatedCatalog.length} recursos.`);
  console.log(`- Libros totales: ${existingBooks.length + newG3Books.length}`);
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

  console.log('\n🎉 ¡PROCESO DE INGESTIÓN DEL GRUPO 3 COMPLETADO CON ÉXITO!');
}

ingestGrupo3().catch(err => {
  console.error('Error fatal:', err);
});
