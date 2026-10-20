const fs = require('fs');

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
    // Other numbered OT books (1 Reyes, 2 Reyes, 1 Crónicas, 2 Crónicas, Esdras, Nehemías, Ester, Isaías, Jeremías, etc.)
    const cleanBookName = title.replace(/^\d+\.\s*/, '').trim();
    title = `${cleanBookName} - Comentario Bíblico y Exégesis`;
    description = `Comentario versículo a versículo, contexto histórico, teológico y bosquejos expositivos del libro de ${cleanBookName}.`;
    category = 'Estudios Bíblicos';
    coverList = covers.biblico;
  }

  const coverUrl = coverList[index % coverList.length];
  return { title, author, category, description, coverUrl };
}

const files = JSON.parse(fs.readFileSync('scripts/drive_grupo2_files.json', 'utf8'));
files.forEach((f, i) => {
  const m = formatMetadataG2(f.name, i);
  console.log(`[${i+1}] ${m.title} | Cat: ${m.category} | Author: ${m.author}`);
});
