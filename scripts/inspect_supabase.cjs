const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
const getVar = (name) => {
  const match = env.match(new RegExp('^' + name + '=(.*)$', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
};

const url = getVar('SUPABASE_URL');
const key = getVar('SUPABASE_SERVICE_ROLE_KEY') || getVar('SUPABASE_ANON_KEY');
console.log('Connecting to Supabase:', url);

const supabase = createClient(url, key);

async function check() {
  try {
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    console.log('Buckets:', buckets ? buckets.map(b => b.name) : 'none', 'Error:', bErr?.message);

    const { data: uploads, error: upErr } = await supabase.storage.from('cemim-multimedia').list('uploads');
    console.log('Uploads count:', uploads ? uploads.length : 0, 'Error:', upErr?.message);
    if (uploads && uploads.length > 0) {
      console.log('Uploads files in bucket:');
      uploads.forEach(f => console.log(' - ' + f.name));
    }

    const { data: dataFiles, error: dfErr } = await supabase.storage.from('cemim-multimedia').list('data');
    console.log('data/ files:', dataFiles ? dataFiles.map(f => f.name) : 'none', 'Error:', dfErr?.message);

    const { data: resJson, error: resErr } = await supabase.storage.from('cemim-multimedia').download('data/resources.json');
    if (resErr) {
      console.log('Error downloading data/resources.json:', resErr.message);
    } else {
      const text = await resJson.text();
      const parsed = JSON.parse(text);
      console.log('data/resources.json exists! Total items:', parsed.length);
      parsed.forEach((item, idx) => {
        console.log(`[${idx + 1}] ID: ${item.id} | Type: ${item.type} | Title: "${item.title}" | FileUrl: ${item.fileUrl?.substring(0, 60)}...`);
      });
    }
  } catch (err) {
    console.error('Fatal error during check:', err);
  }
}

check();
