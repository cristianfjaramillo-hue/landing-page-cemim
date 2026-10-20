const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'resources.json'), 'utf8'));
const code = `export const initialResources = ${JSON.stringify(catalog, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'initialResources.js'), code, 'utf8');
console.log('initialResources.js updated with total items:', catalog.length);
