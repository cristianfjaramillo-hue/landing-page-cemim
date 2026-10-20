import fs from 'fs';
import path from 'path';
import { initialResources } from '../data/initialResources';
import { supabaseAdmin } from './supabase';

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'cemim-multimedia';
const STORAGE_FILE_PATH = 'data/resources.json';
const localDataFilePath = path.join(process.cwd(), 'data', 'resources.json');

// Memory cache for ultrafast subsequent reads in the same lambda
let memoryCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 3000; // 3 seconds

async function fetchFromSupabase() {
  if (!supabaseAdmin) return null;
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(STORAGE_FILE_PATH);

    if (error || !data) {
      // If file does not exist in Supabase Storage, initialize it with initialResources
      console.log('Inicializando resources.json en Supabase Storage...');
      await saveToSupabase(initialResources);
      return initialResources;
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : initialResources;
  } catch (e) {
    console.warn('Error al leer resources.json desde Supabase Storage:', e.message);
    return null;
  }
}

async function saveToSupabase(resources) {
  if (!supabaseAdmin) return false;
  try {
    const jsonString = JSON.stringify(resources, null, 2);
    const buffer = Buffer.from(jsonString, 'utf-8');

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(STORAGE_FILE_PATH, buffer, {
        contentType: 'application/json',
        upsert: true
      });

    if (error) {
      console.error('Error al subir resources.json a Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Excepción al guardar en Supabase:', e.message);
    return false;
  }
}

function getStoredLocal() {
  try {
    if (fs.existsSync(localDataFilePath)) {
      const raw = fs.readFileSync(localDataFilePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {}
  return initialResources;
}

function saveStoredLocal(resources) {
  try {
    const dataDir = path.dirname(localDataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(localDataFilePath, JSON.stringify(resources, null, 2), 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
}

export async function getAllResources() {
  const now = Date.now();
  if (memoryCache && (now - lastFetchTime) < CACHE_TTL) {
    return memoryCache;
  }

  // 1. Try Supabase Storage first (shared across all Vercel serverless functions)
  const sbData = await fetchFromSupabase();
  if (sbData && Array.isArray(sbData) && sbData.length > 0) {
    memoryCache = sbData;
    lastFetchTime = now;
    return sbData;
  }

  // 2. Fallback to local filesystem / initialResources
  const local = getStoredLocal();
  memoryCache = local;
  lastFetchTime = now;
  return local;
}

export async function addResource(newResource) {
  const current = await getAllResources();
  const item = {
    ...newResource,
    id: newResource.id || `res-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [item, ...current];

  // Invalidate cache immediately
  memoryCache = updated;
  lastFetchTime = Date.now();

  // Save to Supabase Storage
  await saveToSupabase(updated);

  // Save to local filesystem if available
  saveStoredLocal(updated);

  return item;
}

export async function deleteResourceById(id) {
  const current = await getAllResources();
  const updated = current.filter((r) => r.id !== id);

  // Invalidate cache immediately
  memoryCache = updated;
  lastFetchTime = Date.now();

  // Save to Supabase Storage
  await saveToSupabase(updated);

  // Save to local filesystem if available
  saveStoredLocal(updated);

  return updated;
}
