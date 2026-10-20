const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
const getVar = (name) => {
  const match = env.match(new RegExp('^' + name + '=(.*)$', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
};

const token = getVar('VERCEL_TOKEN');
const projectId = getVar('VERCEL_PROJECT_ID');
const teamId = getVar('VERCEL_ORG_ID');
const supabaseUrl = getVar('SUPABASE_URL');
const supabaseAnon = getVar('SUPABASE_ANON_KEY');

async function addMissingVercelEnvs() {
  const vars = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', value: supabaseUrl },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: supabaseAnon }
  ];

  for (const v of vars) {
    const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: v.key,
        value: v.value,
        type: 'plain',
        target: ['production', 'preview', 'development']
      })
    });
    const json = await res.json();
    console.log(`Response for ${v.key}:`, JSON.stringify(json));
  }
}

addMissingVercelEnvs();
