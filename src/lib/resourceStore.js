import fs from 'fs';
import path from 'path';
import { initialResources } from '../data/initialResources.js';
import { supabaseAdmin } from './supabase.js';

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'cemim-multimedia';
const STORAGE_FILE_PATH = 'data/resources.json';
const localDataFilePath = path.join(process.cwd(), 'data', 'resources.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Memory cache
let memoryCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000; // 1 second

async function fetchFromSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  try {
    const directUrl = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${STORAGE_FILE_PATH}?t=${Date.now()}`;
    const res = await fetch(directUrl, {
      cache: 'no-store',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache'
      }
    });

    if (res.status === 404 || res.status === 400) {
      console.log('Creando data/resources.json por primera vez en Supabase Storage...');
      await saveToSupabase(initialResources);
      return initialResources;
    }

    if (!res.ok) {
      console.warn('Error al leer resources.json desde Supabase:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (e) {
    console.warn('Excepción al leer resources.json:', e.message);
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
        contentType: 'application/json; charset=utf-8',
        cacheControl: '0',
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
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

export async function getAllResources(skipCache = false) {
  const now = Date.now();
  if (!skipCache && memoryCache && (now - lastFetchTime) < CACHE_TTL) {
    return memoryCache;
  }

  // 1. Read directly from Supabase Storage with cache busting
  const sbData = await fetchFromSupabase();
  if (sbData && Array.isArray(sbData)) {
    memoryCache = sbData;
    lastFetchTime = now;
    return sbData;
  }

  // 2. Fallback to memoryCache if present
  if (memoryCache && Array.isArray(memoryCache)) {
    return memoryCache;
  }

  // 3. Fallback to local
  const local = getStoredLocal();
  memoryCache = local;
  lastFetchTime = now;
  return local;
}

export async function addResource(newResource) {
  // Clear memory cache so we read the absolute freshest list from Supabase
  memoryCache = null;
  const current = await getAllResources(true);

  // Generate unique collision-proof ID
  const uniqueId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const item = {
    ...newResource,
    id: uniqueId,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [item, ...current];

  // Invalidate and update cache
  memoryCache = updated;
  lastFetchTime = Date.now();

  // Save to Supabase Storage with cacheControl: 0
  const saved = await saveToSupabase(updated);
  if (!saved) {
    await new Promise((r) => setTimeout(r, 300));
    await saveToSupabase(updated);
  }

  // Also save locally if writeable
  saveStoredLocal(updated);

  return item;
}

export async function deleteResourceById(id) {
  // Clear memory cache so we read the absolute freshest list from Supabase
  memoryCache = null;
  const current = await getAllResources(true);
  const updated = current.filter((r) => String(r.id) !== String(id));

  // Invalidate and update cache
  memoryCache = updated;
  lastFetchTime = Date.now();

  const saved = await saveToSupabase(updated);
  if (!saved) {
    await new Promise((r) => setTimeout(r, 300));
    await saveToSupabase(updated);
  }

  saveStoredLocal(updated);

  return updated;
}
