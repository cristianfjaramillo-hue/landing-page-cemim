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

async function fixAudioSizes() {
  const resFetch = await fetch(`${url}/storage/v1/object/${bucket}/data/resources.json?t=${Date.now()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Cache-Control': 'no-cache, no-store'
    }
  });

  const catalog = await resFetch.json();

  const updated = catalog.map(item => {
    if (item.type === 'audio') {
      if (item.title.toLowerCase().includes('job')) {
        return {
          ...item,
          fileSize: '133.9 MB',
          duration: '1h 13m'
        };
      }
      if (item.title.toLowerCase().includes('enoc')) {
        return {
          ...item,
          fileSize: '64.9 MB',
          duration: '35:26'
        };
      }
    }
    return item;
  });

  await supabase.storage.from(bucket).upload('data/resources.json', Buffer.from(JSON.stringify(updated, null, 2)), {
    contentType: 'application/json',
    cacheControl: '0',
    upsert: true
  });

  fs.writeFileSync(path.join(__dirname, '..', 'data', 'resources.json'), JSON.stringify(updated, null, 2), 'utf8');
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'initialResources.js'), `export const initialResources = ${JSON.stringify(updated, null, 2)};\n`, 'utf8');
  console.log('Audio file sizes and durations corrected cleanly!');
}

fixAudioSizes();
