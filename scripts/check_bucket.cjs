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

async function checkBucketLimit() {
  const { data: b, error } = await supabase.storage.getBucket(bucket);
  console.log('Bucket config:', b, 'Error:', error);

  // If there's a file_size_limit, let's see:
  console.log('File size limit:', b?.file_size_limit);
}

checkBucketLimit();
