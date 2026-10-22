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

// Curated audio covers
const audioCovers = {
  job: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
  enoc: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
  minas: [
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80', // 01 Transigencia
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', // 02 Indolencia
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', // 03 Rencor
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80', // 04 Temor
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', // 05 Pecados
  ],
  mensajero: [
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  ],
  mec: [
    'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  ]
};

const fullAudioCatalog = [
  // --- SERIE HISTORIAS BÍBLICAS ---
  {
    id: 'res_audio_job',
    title: 'La Historia de JOB: La Prueba de Fe Más Grande',
    type: 'audio',
    author: 'CEMIM Mangayacu - Relatos Bíblicos',
    category: 'Historias Bíblicas',
    description: 'Dramatización y narración bíblica inspiradora sobre la paciencia, integridad incondicional y restauración de Job ante el sufrimiento.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1b6yi9LpL9wlly3aRN3UsYACyP735U2un&export=download&confirm=t',
    coverUrl: audioCovers.job,
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
    coverUrl: audioCovers.enoc,
    duration: '37:45',
    fileSize: '25.96 MB',
    createdAt: '2026-04-20'
  },

  // --- SERIE LAS MINAS TERRESTRES DEL CREYENTE (DR. CHARLES F. STANLEY) ---
  {
    id: 'res_audio_minas_01',
    title: 'Las Minas Terrestres del Creyente: La Transigencia',
    type: 'audio',
    author: 'Dr. Charles F. Stanley',
    category: 'Vida Devocional',
    description: 'Peligros de transigir con el pecado y ceder en las convicciones bíblicas frente a las presiones del mundo contemporáneo.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1fb7fRhrpZwenI6KZFIDeNDqrP5923R5t&export=download&confirm=t',
    coverUrl: audioCovers.minas[0],
    duration: '30:15',
    fileSize: '21.01 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_minas_02',
    title: 'Las Minas Terrestres del Creyente: La Indolencia',
    type: 'audio',
    author: 'Dr. Charles F. Stanley',
    category: 'Vida Devocional',
    description: 'Peligros espirituales de la pasividad, pereza y falta de celo en la vida cristiana, y cómo recobrar la diligencia espiritual.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1F99fFd4fUTMGHCsdzz66wNMdGQdpto3f&export=download&confirm=t',
    coverUrl: audioCovers.minas[1],
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
    coverUrl: audioCovers.minas[2],
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
    coverUrl: audioCovers.minas[3],
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
    coverUrl: audioCovers.minas[4],
    duration: '29:28',
    fileSize: '20.24 MB',
    createdAt: '2026-04-20'
  },

  // --- SERIE MENSAJERO DE LA PAZ (EVANGELISMO Y FUNDAMENTOS) ---
  {
    id: 'res_audio_mensajero_01',
    title: 'El Camino al Cielo',
    type: 'audio',
    author: 'El Mensajero de la Paz',
    category: 'Evangelismo',
    description: 'Mensaje evangelístico claro y transformador sobre el plan divino de salvación a través de la persona de Jesucristo.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1yL2MvWc6q7ZXpxTl7EL4O5ZWR8nrGK5w&export=download&confirm=t',
    coverUrl: audioCovers.mensajero[0],
    duration: '18:40',
    fileSize: '12.69 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mensajero_02',
    title: 'Lo que Significa Creer en Jesucristo',
    type: 'audio',
    author: 'El Mensajero de la Paz',
    category: 'Evangelismo',
    description: 'Reflexión bíblica profunda sobre la naturaleza de la fe salvadora, el arrepentimiento genuino y el discipulado.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1Kkhi9N1URdFfwaAP0fEfN3nYwym8O8jC&export=download&confirm=t',
    coverUrl: audioCovers.mensajero[1],
    duration: '19:15',
    fileSize: '13.23 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mensajero_03',
    title: 'La Cruz: La Ira y el Amor de Dios',
    type: 'audio',
    author: 'El Mensajero de la Paz',
    category: 'Evangelismo',
    description: 'Exposición magistral sobre la cruz del Calvario, donde la perfecta justicia y el infinito amor de Dios se unieron.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1f3HI8WSdGqBm2k7gJoqmBhNOaWlvi3SD&export=download&confirm=t',
    coverUrl: audioCovers.mensajero[2],
    duration: '16:50',
    fileSize: '11.55 MB',
    createdAt: '2026-04-22'
  },

  // --- SERIE MEC (MISIÓN EVANGÉLICA DEL CONO SUR): 20 AUDIOS NUEVOS ---
  {
    id: 'res_audio_mec_01',
    title: 'Victoria sobre la Ansiedad (Disco 1)',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Enseñanza práctica y bíblica para desarmar las causas de la ansiedad cotidiana y experimentar la paz de Dios.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1DdXvlUV685KQjK1siMeyJSxAYlRJoVk7&export=download&confirm=t',
    coverUrl: audioCovers.mec[0],
    duration: '52:10',
    fileSize: '51.38 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_02',
    title: 'Victoria sobre las Culpas (Disco 2)',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Cómo sanar la conciencia herida y liberarse de la condenación a través de la justificación perfecta en Cristo.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1IE0VaQrWjgMJyjvi8CuCttV2FOQIZOFm&export=download&confirm=t',
    coverUrl: audioCovers.mec[1],
    duration: '48:30',
    fileSize: '47.69 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_03',
    title: 'Victoria sobre el Temor (Disco 3)',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Bases escriturales firmes para derribar las fortalezas del miedo y avanzar en valor guiados por el Espíritu.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1mDHxRFv0cUlQcA6W1ewTWPdRdvY6eKu0&export=download&confirm=t',
    coverUrl: audioCovers.mec[2],
    duration: '51:15',
    fileSize: '50.32 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_04',
    title: 'Victoria sobre el Desprecio (Disco 4)',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Sanidad frente a las palabras destructivas y el rechazo humano, reconociendo el incalculable valor que Dios nos otorga.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1k3ULfdW5xUFZcWXNp0n1hLk0u50OQ2bS&export=download&confirm=t',
    coverUrl: audioCovers.mec[3],
    duration: '52:10',
    fileSize: '51.38 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_05',
    title: 'Victoria sobre el Enojo (Disco 5)',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Dominio propio y canalización saludable de los conflictos personales antes de que abran puertas a la amargura.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1d62VoV_ndhri36UlAXnS_qWSGEbqKA4t&export=download&confirm=t',
    coverUrl: audioCovers.mec[4],
    duration: '49:25',
    fileSize: '48.57 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_06',
    title: 'Victoria sobre el Rencor (Disco 6)',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'El camino hacia la verdadera libertad: perdonar a quienes nos ofendieron tal como Cristo nos perdonó.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1trt7a36Z_PHkdZDoo1QkmNIr9KQUl5Nw&export=download&confirm=t',
    coverUrl: audioCovers.mec[5],
    duration: '56:20',
    fileSize: '55.32 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_07',
    title: 'Una Mirada Analítica a la Adversidad',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Comprendiendo los propósitos soberanos de las tribulaciones desde una perspectiva bíblica y madura.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1Ue-5LWoeDF6-x2of35EdDond_cAmsA15&export=download&confirm=t',
    coverUrl: audioCovers.mec[6],
    duration: '35:40',
    fileSize: '31.90 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_08',
    title: 'Crecimiento en la Adversidad',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Cómo el fuego de la prueba refina nuestro carácter para reflejar con mayor nitidez la imagen del Salvador.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1VKiYuLT8Eu-a17izA8tUp2qz0wahOg-g&export=download&confirm=t',
    coverUrl: audioCovers.mec[7],
    duration: '34:10',
    fileSize: '30.36 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_09',
    title: 'Cómo Reaccionar ante la Adversidad',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Pautas de fe versus reacciones emocionales autodestructivas cuando los planes humanos se desmoronan.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1EESStMtRKHWb0kvB3LhfjL5CmIgi-ocz&export=download&confirm=t',
    coverUrl: audioCovers.mec[0],
    duration: '34:10',
    fileSize: '30.36 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_10',
    title: 'Gratitud en la Adversidad',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'El poder espiritual sobrenatural que se desata cuando decidimos dar gracias a Dios en medio de la tormenta.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1Mk1UR2DZHgE64EXS9dmxUO-wwFngMopX&export=download&confirm=t',
    coverUrl: audioCovers.mec[1],
    duration: '29:50',
    fileSize: '26.52 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_11',
    title: 'Aquel que nos Alienta',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'El ministerio consolador del Espíritu Santo y las promesas de la Palabra como refrigerio oportuno para el creyente.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=13Bh26O7v7eg6zt0vmEg7RU4gq6AaYICS&export=download&confirm=t',
    coverUrl: audioCovers.mec[2],
    duration: '48:15',
    fileSize: '45.08 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_12',
    title: 'Cómo Alentarnos unos a Otros',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Comunidad Cristiana',
    description: 'El valor de la comunión fraternal, las palabras sazonadas y el cuidado mutuo dentro del cuerpo local de Cristo.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1OuZ_Y79qtL42pCm7J94rlTfp7SHK8ihN&export=download&confirm=t',
    coverUrl: audioCovers.mec[3],
    duration: '45:50',
    fileSize: '42.93 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_13',
    title: 'El Ministerio del Aliento Mutuo',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Comunidad Cristiana',
    description: 'Consejos prácticos para convertirse en un Bernabé: hijo de consolación para quienes sufren angustia o desánimo.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1z75YAj-zQaEG5F8p74St-FnbVmaKFv5b&export=download&confirm=t',
    coverUrl: audioCovers.mec[4],
    duration: '50:20',
    fileSize: '47.15 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_14',
    title: 'Cómo Manejar la Ansiedad',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Herramientas de fe para desarmar la preocupación desmedida por el mañana y descansar en el Padre celestial.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1W8k_rvqEXHqs1rt6WeDW3sWEBRSBaQjo&export=download&confirm=t',
    coverUrl: audioCovers.mec[5],
    duration: '47:20',
    fileSize: '44.37 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_15',
    title: 'Cómo Caminar con Dios en Tiempos Difíciles',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Secretos de una devoción diaria viva y comunión íntima con el Señor en temporadas de aridez o adversidad.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=152LxvoBaVSJUkk3t_iUzDZ3XoOp-WTUf&export=download&confirm=t',
    coverUrl: audioCovers.mec[6],
    duration: '54:40',
    fileSize: '51.23 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_16',
    title: 'La Provisión de Dios en la Tempestad',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Dios como refugio inmutable: experiencias y promesas sobre el sustento integral del Señor en la crisis.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1O7j85L2h2PXElcNRb41nriTLq0ZcbgBP&export=download&confirm=t',
    coverUrl: audioCovers.mec[7],
    duration: '52:30',
    fileSize: '49.23 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_17',
    title: 'Confianza para Enfrentar el Futuro',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Mirando hacia adelante con esperanza inquebrantable, sabiendo que el futuro de los hijos de Dios está asegurado en Su mano.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1we2nY8ik5xpUKkCF8FriSsWL-t5PsKx6&export=download&confirm=t',
    coverUrl: audioCovers.mec[0],
    duration: '44:55',
    fileSize: '42.07 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_18',
    title: 'Podemos Tener Paz en la Aflicción',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'La promesa de Jesús cumplida: "En el mundo tendréis aflicción, pero confiad, yo he vencido al mundo".',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1ni29WmPcN6QWO4y0ZhAMjBfJ2godRqtZ&export=download&confirm=t',
    coverUrl: audioCovers.mec[1],
    duration: '43:00',
    fileSize: '40.25 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_19',
    title: 'Confianza en Medio de la Angustia',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Cómo levantar un altar de adoración en medio del dolor y reposar bajo la sombra protectora del Omnipotente.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1rrQm4gRZREwDeowExn8_XiKcCqaOEoHd&export=download&confirm=t',
    coverUrl: audioCovers.mec[2],
    duration: '53:50',
    fileSize: '50.46 MB',
    createdAt: '2026-04-22'
  },
  {
    id: 'res_audio_mec_20',
    title: 'Cuando Perdemos Toda Esperanza',
    type: 'audio',
    author: 'Misión Evangélica del Cono Sur (MEC)',
    category: 'Vida Devocional',
    description: 'Un rayo de luz inagotable cuando todas las puertas humanas se cierran: la gloria de Dios resucitando lo que parecía muerto.',
    fileUrl: 'https://drive.usercontent.google.com/download?id=1-dtPW1U4B33hIQIjGc_fvuJBmMAXaYt6&export=download&confirm=t',
    coverUrl: audioCovers.mec[3],
    duration: '36:10',
    fileSize: '33.60 MB',
    createdAt: '2026-04-22'
  }
];

async function run() {
  console.log(`\n========================================`);
  console.log(`Procesando consolidación de AUDIOTECA completa (30 pistas)...`);

  // 1. Obtener catálogo existente
  const currentCatalog = JSON.parse(fs.readFileSync('data/resources.json', 'utf8'));
  const books = currentCatalog.filter(r => r.type === 'libro');
  const videos = currentCatalog.filter(r => r.type === 'video');

  console.log(`- Libros existentes: ${books.length}`);
  console.log(`- Videos existentes: ${videos.length}`);
  console.log(`- Nuevos audios a registrar: ${fullAudioCatalog.length}`);

  // 2. Unir catálogo final
  const finalCatalog = [...books, ...fullAudioCatalog, ...videos];
  console.log(`- Total general de recursos: ${finalCatalog.length}`);

  // 3. Subir a Supabase Storage con cacheControl: 0
  const jsonBuf = Buffer.from(JSON.stringify(finalCatalog, null, 2), 'utf8');
  const { error: saveError } = await supabase.storage.from(bucket).upload('data/resources.json', jsonBuf, {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  if (saveError) {
    console.error('❌ Error subiendo a Supabase Storage:', saveError.message);
  } else {
    console.log('✅ data/resources.json guardado en Supabase Storage exitosamente con cacheControl: 0.');
  }

  // 4. Guardar copias locales
  fs.writeFileSync('data/resources.json', JSON.stringify(finalCatalog, null, 2));
  fs.writeFileSync('src/data/initialResources.js', `export const initialResources = ${JSON.stringify(finalCatalog, null, 2)};\n`);
  console.log('✅ Archivos locales actualizados.');

  console.log('\n🎉 ¡AUDIOTECA ACTUALIZADA CON ÉXITO: 30 PISTAS TOTALES DISPONIBLES!');
}

run().catch(console.error);
