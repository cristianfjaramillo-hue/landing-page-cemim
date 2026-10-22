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

const images = [
  {
    id: '1poDxyuT-OJYaqYCacLntdfrXOcEgbtIj',
    name: 'portada_3.png',
    contentType: 'image/png',
    resourceId: 'res_1792689243909_ff54il' // SOCORRO
  },
  {
    id: '1Fl-qg-_0wFkxZZjpT-7ze__31I62mh8n',
    name: 'portada_libro_1.jpg',
    contentType: 'image/jpeg',
    resourceId: 'res_1792688914526_m8d16m' // EL ENREJADO Y LA VID
  },
  {
    id: '1s01kivLtaC5LWyLmn3_aHAiXWZTBbu9g',
    name: 'portada_libro_2.jpg',
    contentType: 'image/jpeg',
    resourceId: 'res_1792688762399_i4xjx4' // EL PLAN MARAVILLOSO
  }
];

async function syncImages() {
  console.log('Downloading and uploading covers to Supabase Storage...');
  const uploadedUrls = {};

  for (const img of images) {
    console.log(`Fetching Drive image ${img.name} (${img.id})...`);
    const driveUrl = `https://lh3.googleusercontent.com/d/${img.id}=w1200`;
    const res = await fetch(driveUrl);
    if (!res.ok) {
      console.error(`Failed to fetch ${img.name}: status ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    console.log(`Fetched ${img.name}: ${buf.length} bytes`);

    const storagePath = `covers/${Date.now()}_${img.name}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(storagePath, buf, {
      contentType: img.contentType,
      cacheControl: '31536000',
      upsert: true
    });

    if (upErr) {
      console.error(`Error uploading ${img.name} to Supabase:`, upErr.message);
    } else {
      const publicUrl = supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
      console.log(`✅ Uploaded ${img.name} -> ${publicUrl}`);
      uploadedUrls[img.resourceId] = publicUrl;
    }
  }

  // Update data/resources.json in Supabase
  const { data: catData, error: catErr } = await supabase.storage.from(bucket).download('data/resources.json');
  if (catErr) {
    console.error('Error fetching catalog:', catErr.message);
    return;
  }

  const catalog = JSON.parse(await catData.text());
  console.log('Current catalog length in Supabase:', catalog.length);

  let updatedCount = 0;
  const updatedCatalog = catalog.map(item => {
    if (uploadedUrls[item.id]) {
      updatedCount++;
      console.log(`Updating coverUrl for ${item.title} (${item.id}):\n  OLD: ${item.coverUrl}\n  NEW: ${uploadedUrls[item.id]}`);
      return {
        ...item,
        coverUrl: uploadedUrls[item.id]
      };
    }
    return item;
  });

  if (updatedCount > 0) {
    const jsonBuf = Buffer.from(JSON.stringify(updatedCatalog, null, 2), 'utf8');
    const { error: saveErr } = await supabase.storage.from(bucket).upload('data/resources.json', jsonBuf, {
      contentType: 'application/json',
      cacheControl: '0',
      upsert: true
    });

    if (saveErr) {
      console.error('Error saving updated catalog to Supabase:', saveErr.message);
    } else {
      console.log('✅ Catalog successfully updated in Supabase Storage!');
    }

    // Save locally
    fs.writeFileSync('data/resources.json', JSON.stringify(updatedCatalog, null, 2));
    fs.writeFileSync('src/data/initialResources.js', `export const initialResources = ${JSON.stringify(updatedCatalog, null, 2)};\n`);
    console.log('✅ Catalog updated locally.');
  }
}

syncImages().catch(console.error);
