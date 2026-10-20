const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
const getVar = (n) => (env.match(new RegExp('^' + n + '=(.*)$', 'm')) || [])[1]?.trim().replace(/^['"]|['"]$/g, '');
const supabase = createClient(getVar('SUPABASE_URL'), getVar('SUPABASE_SERVICE_ROLE_KEY'));

async function inspect() {
  const { data } = await supabase.storage.from('cemim-multimedia').download('data/resources.json');
  const items = JSON.parse(await data.text());
  console.log('Total items in data/resources.json:', items.length);
  const byType = {};
  items.forEach(i => { byType[i.type] = (byType[i.type] || 0) + 1; });
  console.log('By type:', byType);
}

inspect();
