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

async function checkSupabase() {
  const { data, error } = await supabase.storage.from(bucket).download('data/resources.json');
  if (error) {
    console.error('Error downloading from supabase:', error);
    return;
  }
  const text = await data.text();
  const catalog = JSON.parse(text);
  console.log('Total items in Supabase:', catalog.length);
  
  const targetIds = ['1s01kivLtaC5LWyLmn3_aHAiXWZTBbu9g', '1poDxyuT-OJYaqYCacLntdfrXOcEgbtIj', '1Fl-qg-_0wFkxZZjpT-7ze__31I62mh8n', '1bHCzowe7EygXwKVafLKdZJe-JtvyYLWX', '1JOysJFjg5-DGeERqVumI35dg9HMM_fwm'];

  catalog.forEach((item, idx) => {
    if (item.coverUrl && (item.coverUrl.includes('drive.google.com') || item.coverUrl.includes('drive.usercontent') || targetIds.some(id => item.coverUrl.includes(id)))) {
      console.log('Match found in Supabase resource:', idx, item.id, item.title, '| coverUrl:', item.coverUrl);
    }
  });

  // Also check if any item has coverUrl edited recently or contains any drive or strange url
  catalog.filter(i => !i.coverUrl?.includes('images.unsplash.com')).forEach(i => {
    console.log('Non-unsplash coverUrl:', i.id, i.title, i.coverUrl);
  });
}
checkSupabase();
