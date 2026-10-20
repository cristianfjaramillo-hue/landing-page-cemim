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

async function testUploadEnoc() {
  const file = {
    id: '1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG',
    name: 'La Increíble Historia de ENOC_ ¡El Hombre que Fue LLEVADO por Dios! Historia Bíblica Impactante.mp3'
  };

  console.log('Downloading Enoc.mp3 (68 MB)...');
  const res = await fetch(`https://drive.google.com/uc?export=download&id=${file.id}`);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log('Downloaded bytes:', buf.length, `(${(buf.length / (1024 * 1024)).toFixed(2)} MB)`);

  const storagePath = `uploads/audio_${Date.now()}_Enoc.mp3`;
  console.log(`Uploading to Supabase: ${storagePath}...`);

  const { data, error } = await supabase.storage.from(bucket).upload(storagePath, buf, {
    contentType: 'audio/mpeg',
    cacheControl: '31536000',
    upsert: true
  });

  if (error) {
    console.error('Upload error:', error.message);
  } else {
    console.log('Upload SUCCESS!', data);
    const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    console.log('Public URL:', pubData.publicUrl);
  }
}

testUploadEnoc();
