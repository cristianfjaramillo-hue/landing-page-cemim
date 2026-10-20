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

async function checkVercelEnvs() {
  const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env?teamId=${teamId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Vercel env vars:');
  if (data.envs) {
    data.envs.forEach(e => console.log(` - ${e.key} (id: ${e.id}, targets: ${e.target.join(',')})`));
  } else {
    console.log(data);
  }
}
checkVercelEnvs();
