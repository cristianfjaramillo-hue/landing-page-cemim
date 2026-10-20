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

function formatMetadataG4(fileName, index) {
  const lower = fileName.toLowerCase();
  let title = fileName.replace(/\.pdf$/i, '').trim();
  let author = 'CEMIM Mangayacu - Biblioteca Pastoral';
  let category = 'Estudios Bíblicos';
  let description = '';
  let coverList = covers.biblico;

  if (lower.includes('discursos a mis estudiantes')) {
    title = 'Discursos a Mis Estudiantes';
    author = 'Charles H. Spurgeon';
    category = 'Liderazgo Pastoral';
    description = 'Conferencias magistrales y consejos prácticos del Príncipe de los Predicadores sobre el ministerio, la oratoria sacra y el corazón del pastor.';
    coverList = covers.pastoral;
  } else if (lower.includes('diseñados para adorar')) {
    title = 'Diseñados para Adorar';
    author = 'A. W. Tozer';
    category = 'Vida Devocional';
    description = 'Un llamado ardiente a recuperar el propósito supremo de la existencia humana: contemplar, reverenciar y adorar al Dios vivo y santo.';
    coverList = covers.devocional;
  } else if (lower.includes('doctrinas falsas')) {
    title = 'Doctrinas Falsas: Guía de Discernimiento Bíblico';
    author = 'CEMIM Mangayacu - Apologética';
    category = 'Discipulado Cristiano';
    description = 'Análisis bíblico comparativo para identificar y refutar las corrientes heréticas contemporáneas que distorsionan el evangelio.';
    coverList = covers.discipulado;
  } else if (lower.includes('dogmática reformada')) {
    title = 'Compendio de Dogmática Reformada';
    author = 'Herman Bavinck / Louis Berkhof';
    category = 'Estudios Bíblicos';
    description = 'Tratado sistemático fundamental sobre las grandes doctrinas de la gracia: la soberanía divina, la providencia, la redención y la iglesia.';
    coverList = covers.biblico;
  } else if (lower.includes('poder por la oraci')) {
    title = 'Poder por la Oración';
    author = 'E. M. Bounds';
    category = 'Vida Devocional';
    description = 'El clásico imperecedero sobre la vida de oración: el hombre que ora con denuedo es el canal por el cual Dios desata Su infinito poder.';
    coverList = covers.devocional;
  } else if (lower.includes('libro de trabajo para maestros')) {
    title = 'Libro de Trabajo para Maestros';
    author = 'Equipo Ministerial CEMIM';
    category = 'Liderazgo Pastoral';
    description = 'Cuaderno didáctico y formativo con guías pedagógicas, dinámicas y talleres para la formación de discípulos en la iglesia local.';
    coverList = covers.pastoral;
  } else if (lower.includes('sociedad del conocimiento')) {
    title = 'Educación Cristiana y Sociedad del Conocimiento';
    author = 'Instituto Bíblico CEMIM';
    category = 'Liderazgo Pastoral';
    description = 'Perspectivas formativas y pedagógicas para comunicar la verdad bíblica con pertinencia en la era contemporánea.';
    coverList = covers.pastoral;
  } else if (lower.includes('camino del poder espiritual')) {
    title = 'El Camino del Poder Espiritual';
    author = 'A. W. Tozer';
    category = 'Vida Devocional';
    description = 'Reflexiones penetrantes sobre la llenura del Espíritu Santo, la renuncia a la autosuficiencia humana y la verdadera autoridad espiritual.';
    coverList = covers.devocional;
  } else if (lower.includes('cristiano de chocolate')) {
    title = 'El Cristiano de Chocolate';
    author = 'C. T. Studd';
    category = 'Vida Devocional';
    description = 'Un manifiesto misionero vibrante y desafiante contra la apatía y la comodidad espiritual: el soldado de Cristo resiste en la batalla.';
    coverList = covers.devocional;
  } else if (lower.includes('don inefable')) {
    title = 'El Don Inefable de la Gracia de Dios';
    author = 'CEMIM Mangayacu - Vida Devocional';
    category = 'Vida Devocional';
    description = 'Meditaciones contemplativas sobre la magnificencia de Cristo y el regalo supremo del amor redentor manifestado en la cruz.';
    coverList = covers.devocional;
  } else if (lower.includes('hombre fosil')) {
    title = 'El Hombre Fósil y los Orígenes (Creacionismo)';
    author = 'CEMIM Mangayacu - Apologética';
    category = 'Estudios Bíblicos';
    description = 'Estudio apologético y científico sobre los orígenes humanos, la evidencia fósil y el relato bíblico de la creación en Génesis.';
    coverList = covers.biblico;
  } else if (lower.includes('el hombre.pdf')) {
    title = 'La Doctrina del Hombre: Antropología Bíblica';
    author = 'Instituto Bíblico CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Análisis bíblico profundo del ser humano creado a imagen de Dios, su caída en el pecado y su restauración en Jesucristo.';
    coverList = covers.biblico;
  } else if (lower.includes('libro de mormon')) {
    title = 'El Libro de Mormón a la Luz de las Escrituras';
    author = 'CEMIM Mangayacu - Apologética';
    category = 'Discipulado Cristiano';
    description = 'Examen doctrinal, histórico y arqueológico del mormonismo a la luz del texto fidedigno de la Biblia.';
    coverList = covers.discipulado;
  } else if (lower.includes('papa que fue mujer')) {
    title = 'La Leyenda de la Papisa Juana: Historia Eclesiástica';
    author = 'CEMIM Mangayacu - Historia';
    category = 'Estudios Bíblicos';
    description = 'Investigación crítica sobre los mitos y realidades medievales en el desarrollo del papado e historia de la cristiandad.';
    coverList = covers.biblico;
  } else if (lower.includes('predicador y la oraci')) {
    title = 'El Predicador y la Oración';
    author = 'E. M. Bounds';
    category = 'Liderazgo Pastoral';
    description = 'Un llamado contundente a todo ministro del evangelio: la unción y la eficacia del púlpito nacen en la comunión secreta con Dios.';
    coverList = covers.pastoral;
  } else if (lower.includes('el predicador.pdf')) {
    title = 'El Predicador: Vocación y Llamado Ministerial';
    author = 'Equipo Ministerial CEMIM';
    category = 'Liderazgo Pastoral';
    description = 'Manual formativo sobre la vida interior, la integridad de carácter y la devoción necesaria para el ministerio de la predicación.';
    coverList = covers.pastoral;
  } else if (lower.includes('eliseo')) {
    title = 'El Profeta Eliseo: Milagros y Ministerio';
    author = 'Leonardo Hussey';
    category = 'Estudios Bíblicos';
    description = 'Exposición inspiradora de la vida del sucesor de Elías, la doble porción del Espíritu y las señales del poder divino en Israel.';
    coverList = covers.biblico;
  } else if (lower.includes('progreso del peregrino')) {
    title = 'El Progreso del Peregrino';
    author = 'John Bunyan';
    category = 'Vida Devocional';
    description = 'La alegoría cristiana más leída de todos los tiempos: el viaje espiritual de Cristiano desde la Ciudad de Destrucción hasta la Ciudad Celestial.';
    coverList = covers.devocional;
  } else if (lower.includes('pulpito') || lower.includes('púlpito')) {
    title = 'El Púlpito Cristiano: Homilética y Exposición';
    author = 'CEMIM Mangayacu - Homilética';
    category = 'Liderazgo Pastoral';
    description = 'Guía de homilética práctica para preparar y proclamar sermones bíblicos fieles al texto sagrado con claridad y unción.';
    coverList = covers.pastoral;
  } else if (lower.includes('secreto de la fuerza')) {
    title = 'El Secreto de la Fuerza Espiritual';
    author = 'Equipo Pastoral CEMIM';
    category = 'Vida Devocional';
    description = 'Principios bíblicos para renovar el vigor espiritual del creyente en tiempos de cansancio, prueba y lucha diaria.';
    coverList = covers.devocional;
  } else if (lower.includes('tesoro de david')) {
    title = 'El Tesoro de David (Comentario a los Salmos)';
    author = 'Charles H. Spurgeon';
    category = 'Estudios Bíblicos';
    description = 'La obra maestra magna de Spurgeon: comentario versículo a versículo de los Salmos con bosquejos, homilética y notas devocionales inigualables.';
    coverList = covers.biblico;
  } else if (lower.includes('elias') || lower.includes('elías')) {
    title = 'Elías: El Portador del Celo de Dios';
    author = 'F. B. Meyer';
    category = 'Estudios Bíblicos';
    description = 'Estudio apasionante sobre el profeta del monte Carmelo: la valentía profética, la soledad y la providencia de Dios en tiempos de apostasía.';
    coverList = covers.biblico;
  } else if (lower.includes('dos testamentos')) {
    title = 'El Período Intertestamentario';
    author = 'Instituto Bíblico CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Contexto histórico, político y cultural de los cuatrocientos años de silencio entre Malaquías y el nacimiento de Jesucristo.';
    coverList = covers.biblico;
  } else if (lower.includes('inductivo')) {
    title = 'Método de Estudio Bíblico Inductivo';
    author = 'CEMIM Mangayacu - Educación Bíblica';
    category = 'Estudios Bíblicos';
    description = 'Herramienta metodológica clave: Observación minuciosa, Interpretación contextual y Aplicación transformadora del texto bíblico.';
    coverList = covers.biblico;
  } else if (lower.includes('exposicion de romanos') || lower.includes('exposición de romanos')) {
    title = 'Exposición Teológica de la Epístola a los Romanos';
    author = 'CEMIM Mangayacu - Exégesis Bíblica';
    category = 'Estudios Bíblicos';
    description = 'Comentario sistemático versículo por versículo sobre la justificación por la fe, la santificación y el propósito redentor de Dios.';
    coverList = covers.biblico;
  } else if (lower.includes('planeamiento de la lecci')) {
    title = 'Formato de Planeamiento Didáctico de Lecciones';
    author = 'Equipo Pedagógico CEMIM';
    category = 'Liderazgo Pastoral';
    description = 'Plantillas e instrumentos pedagógicos estructurados para la preparación de clases bíblicas, talleres de líderes y grupos misioneros.';
    coverList = covers.pastoral;
  } else if (lower.includes('fe aut') || lower.includes('fe auténtica')) {
    title = 'Fe Auténtica: La Verdadera Confianza en Dios';
    author = 'A. W. Tozer';
    category = 'Vida Devocional';
    description = 'Enseñanza lúcida sobre la diferencia entre la emoción superficial y una fe bíblica inquebrantable anclada en el carácter inmutable de Dios.';
    coverList = covers.devocional;
  } else if (lower.includes('fe mas alla') || lower.includes('fe más allá')) {
    title = 'Fe Más Allá de la Razón';
    author = 'A. W. Tozer';
    category = 'Vida Devocional';
    description = 'Una invitación a traspasar los límites del racionalismo árido para contemplar la trascendencia y majestuosidad insondable del Señor.';
    coverList = covers.devocional;
  } else if (lower.includes('filem')) {
    title = 'Epístola a Filemón: Comentario Exegético';
    author = 'CEMIM Mangayacu - Biblioteca Pastoral';
    category = 'Estudios Bíblicos';
    description = 'Estudio sobre el perdón radical, la reconciliación comunitaria y la hermandad en Cristo manifestada en la carta de Pablo a Filemón.';
    coverList = covers.biblico;
  } else if (lower.includes('geograf')) {
    title = 'Geografía y Tierras Bíblicas';
    author = 'Instituto Bíblico CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Atlas y descripción topográfica, climática y geográfica de los escenarios donde se desarrollaron los grandes acontecimientos bíblicos.';
    coverList = covers.biblico;
  } else if (lower.includes('manual del maestro - smalling') || lower.includes('gracia - manual')) {
    title = 'Doctrina de la Gracia: Manual del Maestro';
    author = 'Roger L. Smalling';
    category = 'Liderazgo Pastoral';
    description = 'Guía didáctica para instructores sobre la soberanía y eficacia de la gracia divina en la salvación del pecador.';
    coverList = covers.pastoral;
  } else if (lower.includes('gracia soberana')) {
    title = 'Gracia Soberana y Salvación Eterna';
    author = 'D. L. Moody / CEMIM';
    category = 'Discipulado Cristiano';
    description = 'Exposición clara del evangelio de la gracia: la dádiva inmerecida que libera al hombre de la condenación y le otorga vida nueva.';
    coverList = covers.discipulado;
  } else if (lower.includes('guerra') && lower.includes('2')) {
    title = 'La Guerra de los Judíos (Tomo II)';
    author = 'Flavio Josefo';
    category = 'Estudios Bíblicos';
    description = 'Crónica histórica clásica de Flavio Josefo sobre el sitio, la caída de Jerusalén y la destrucción del Templo en el año 70 d.C.';
    coverList = covers.biblico;
  } else if (lower.includes('guerra') && lower.includes('1')) {
    title = 'La Guerra de los Judíos (Tomo I)';
    author = 'Flavio Josefo';
    category = 'Estudios Bíblicos';
    description = 'Relato histórico invaluable sobre el contexto político de Judea, los macabeos, Herodes el Grande y el conflicto con el Imperio Romano.';
    coverList = covers.biblico;
  } else if (lower.includes('guias para el entendimiento') || lower.includes('guías para el entendimiento')) {
    title = 'Guía Hermenéutica para el Entendimiento de las Escrituras';
    author = 'Instituto Bíblico CEMIM';
    category = 'Estudios Bíblicos';
    description = 'Reglas fundamentales de interpretación bíblica, géneros literarios y análisis contextual para una comprensión fiel de la Biblia.';
    coverList = covers.biblico;
  } else if (lower.includes('carey')) {
    title = 'Guillermo Carey: Padre de las Misiones Modernas';
    author = 'Equipo Histórico Misionero CEMIM';
    category = 'Liderazgo Pastoral';
    description = 'Biografía inspiradora del pionero que abrió el camino del movimiento misionero moderno en la India: Espera grandes cosas de Dios, emprende grandes cosas para Dios.';
    coverList = covers.pastoral;
  } else if (lower.includes('tesoros escondidos')) {
    title = 'Tesoros Escondidos de la Literatura Cristiana';
    author = 'Guillermo Rodríguez';
    category = 'Vida Devocional';
    description = 'Antología enriquecedora con extractos selectos y joyas literarias de los más insignes pensadores y santos de la historia de la iglesia.';
    coverList = covers.devocional;
  } else if (lower.includes('habla el antiguo')) {
    title = 'Habla el Antiguo Testamento: Panorama y Mensaje';
    author = 'Samuel J. Schultz';
    category = 'Estudios Bíblicos';
    description = 'Manual canónico e histórico que explica el desarrollo del pueblo de Israel y la voz de Dios en el Antiguo Testamento.';
    coverList = covers.biblico;
  } else if (lower.includes('hechos notables')) {
    title = 'Hechos Notables y Anécdotas de Gracia';
    author = 'Charles H. Spurgeon';
    category = 'Vida Devocional';
    description = 'Relatos conmovedores, testimonios providenciales e ilustraciones pastorales extraídas del fecundo ministerio de Spurgeon.';
    coverList = covers.devocional;
  } else if (lower.includes('hechos.pdf')) {
    title = 'Comentario Expositivo de los Hechos de los Apóstoles';
    author = 'CEMIM Mangayacu - Biblioteca Pastoral';
    category = 'Estudios Bíblicos';
    description = 'Exégesis del libro de Hechos: la unción del Espíritu, las primeras persecuciones y el avance incontenible de la iglesia en el mundo antiguo.';
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

async function ingestGrupo4() {
  console.log('=== INICIANDO INGESTIÓN DE LIBROS GRUPO 4 ===');

  const files = JSON.parse(fs.readFileSync('scripts/drive_grupo4_files.json', 'utf8'));
  console.log(`Total archivos en Grupo 4: ${files.length}`);

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

  const newG4Books = [];

  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    const meta = formatMetadataG4(item.name, i);

    console.log(`\n[${i + 1}/${files.length}] Descargando: "${item.name}"...`);

    const buf = await downloadFileFromDrive(item.id);
    if (!buf) {
      console.error(`❌ No se pudo descargar o no es un PDF válido: "${item.name}"`);
      continue;
    }

    const cleanFileName = item.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const sizeMb = (buf.length / (1024 * 1024)).toFixed(2);
    const pages = Math.max(16, Math.round(buf.length / 22000));
    let publicUrl = '';

    // If file is > 48MB (close to Supabase limit), serve directly from Drive usercontent
    if (buf.length > 48 * 1024 * 1024) {
      console.log(`ℹ️ Archivo mayor a 48 MB (${sizeMb} MB). Alojamientos por streaming directo Drive.`);
      publicUrl = `https://drive.usercontent.google.com/download?id=${item.id}&export=download&confirm=t`;
    } else {
      const storagePath = `uploads/g4_${Date.now()}_${cleanFileName}`;
      const { data: upData, error: upError } = await supabase.storage.from(bucket).upload(storagePath, buf, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true
      });

      if (upError) {
        console.warn(`⚠️ Error subiendo a Supabase Storage (${upError.message}), usando enlace directo Drive.`);
        publicUrl = `https://drive.usercontent.google.com/download?id=${item.id}&export=download&confirm=t`;
      } else {
        const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
        publicUrl = pubData.publicUrl;
      }
    }

    const newBook = {
      id: `libro-pastoral-g4-${i + 1}`,
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
    };

    newG4Books.push(newBook);
    console.log(`✅ [${i + 1}/${files.length}] Guardado: "${meta.title}" (${sizeMb} MB, ~${pages} págs)`);

    // Pausa breve
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== Procesamiento de archivos finalizado. Nuevos libros procesados: ${newG4Books.length} ===`);

  // Combinar catálogo: libros existentes + nuevos libros G4 + audios y videos existentes
  const existingBooks = currentCatalog.filter(r => r.type === 'libro');
  const existingNonBooks = currentCatalog.filter(r => r.type !== 'libro');

  const updatedCatalog = [...existingBooks, ...newG4Books, ...existingNonBooks];
  console.log(`Total catálogo final consolidado: ${updatedCatalog.length} recursos.`);
  console.log(`- Libros totales: ${existingBooks.length + newG4Books.length}`);
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

  console.log('\n🎉 ¡PROCESO DE INGESTIÓN DEL GRUPO 4 COMPLETADO CON ÉXITO!');
}

ingestGrupo4().catch(err => {
  console.error('Error fatal:', err);
});
