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

async function tryUpdateBucket() {
  console.log('Attempting to update bucket file_size_limit to 200MB (209715200 bytes)...');
  const { data, error } = await supabase.storage.updateBucket(bucket, {
    public: true,
    file_size_limit: 209715200 // 200MB
  });
  console.log('Update result:', data, 'Error:', error);
}

tryUpdateBucket();
