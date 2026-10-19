import fs from 'fs';
import path from 'path';
import { initialResources } from '../data/initialResources';

const dataFilePath = path.join(process.cwd(), 'data', 'resources.json');

// Ensure data directory and file exist
function getStoredResources() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const dataDir = path.dirname(dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(initialResources, null, 2), 'utf-8');
      return initialResources;
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading resources file:', e);
    return initialResources;
  }
}

function saveResources(resources) {
  try {
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(resources, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error saving resources file:', e);
    return false;
  }
}

export function getAllResources() {
  return getStoredResources();
}

export function addResource(newResource) {
  const current = getStoredResources();
  const item = {
    ...newResource,
    id: newResource.id || `res-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [item, ...current];
  saveResources(updated);
  return item;
}

export function deleteResourceById(id) {
  const current = getStoredResources();
  const updated = current.filter((r) => r.id !== id);
  saveResources(updated);
  return updated;
}
