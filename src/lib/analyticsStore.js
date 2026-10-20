import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabase.js';

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'cemim-multimedia';
const ANALYTICS_FILE_PATH = 'data/analytics.json';
const localDataFilePath = path.join(process.cwd(), 'data', 'analytics.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Default initial metrics
const DEFAULT_ANALYTICS = {
  pageViews: 124,
  downloads: {
    libros: 38,
    audios: 17,
    videos: 9
  },
  lastUpdated: new Date().toISOString()
};

// Memory cache to prevent excessive roundtrips
let cachedAnalytics = null;
let lastFetchTime = 0;
const CACHE_TTL = 3000; // 3 seconds

/**
 * Fetch analytics data from Supabase Storage
 */
async function fetchFromSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  try {
    const directUrl = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${ANALYTICS_FILE_PATH}?t=${Date.now()}`;
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
      console.log('Inicializando data/analytics.json en Supabase Storage...');
      await saveToSupabase(DEFAULT_ANALYTICS);
      return DEFAULT_ANALYTICS;
    }

    if (!res.ok) {
      console.warn('Error al leer analytics.json desde Supabase:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return data && typeof data === 'object' ? data : null;
  } catch (e) {
    console.warn('Excepción al leer analytics.json:', e.message);
    return null;
  }
}

/**
 * Save analytics data to Supabase Storage
 */
async function saveToSupabase(analytics) {
  if (!supabaseAdmin) return false;
  try {
    const jsonString = JSON.stringify(analytics, null, 2);
    const buffer = Buffer.from(jsonString, 'utf-8');

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(ANALYTICS_FILE_PATH, buffer, {
        contentType: 'application/json; charset=utf-8',
        cacheControl: '0',
        upsert: true
      });

    if (error) {
      console.error('Error al subir analytics.json a Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Excepción al guardar analytics en Supabase:', e.message);
    return false;
  }
}

/**
 * Fallback local file system operations
 */
function getStoredLocal() {
  try {
    if (fs.existsSync(localDataFilePath)) {
      const raw = fs.readFileSync(localDataFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}
  return DEFAULT_ANALYTICS;
}

function saveStoredLocal(analytics) {
  try {
    const dataDir = path.dirname(localDataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(localDataFilePath, JSON.stringify(analytics, null, 2), 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get current analytics
 */
export async function getAnalytics(skipCache = false) {
  const now = Date.now();
  if (!skipCache && cachedAnalytics && (now - lastFetchTime < CACHE_TTL)) {
    return cachedAnalytics;
  }

  // 1. Try Supabase Storage
  let data = await fetchFromSupabase();

  // 2. Fallback to local
  if (!data) {
    data = getStoredLocal();
  }

  // Ensure structure
  const safeData = {
    pageViews: typeof data.pageViews === 'number' ? data.pageViews : DEFAULT_ANALYTICS.pageViews,
    downloads: {
      libros: typeof data.downloads?.libros === 'number' ? data.downloads.libros : 0,
      audios: typeof data.downloads?.audios === 'number' ? data.downloads.audios : 0,
      videos: typeof data.downloads?.videos === 'number' ? data.downloads.videos : 0,
    },
    lastUpdated: data.lastUpdated || new Date().toISOString()
  };

  safeData.downloads.total = safeData.downloads.libros + safeData.downloads.audios + safeData.downloads.videos;

  cachedAnalytics = safeData;
  lastFetchTime = now;
  return safeData;
}

/**
 * Record an event (page_view or download)
 * @param {'page_view' | 'download'} eventType
 * @param {'libros' | 'audios' | 'videos'} [category]
 */
export async function recordMetricEvent(eventType, category = 'libros') {
  const current = await getAnalytics(true);

  if (eventType === 'page_view') {
    current.pageViews = (current.pageViews || 0) + 1;
  } else if (eventType === 'download') {
    const cat = ['libros', 'audios', 'videos'].includes(category) ? category : 'libros';
    current.downloads[cat] = (current.downloads[cat] || 0) + 1;
  }

  current.downloads.total = (current.downloads.libros || 0) + (current.downloads.audios || 0) + (current.downloads.videos || 0);
  current.lastUpdated = new Date().toISOString();

  cachedAnalytics = current;
  lastFetchTime = Date.now();

  // Save asynchronously
  await Promise.allSettled([
    saveToSupabase(current),
    Promise.resolve().then(() => saveStoredLocal(current))
  ]);

  return current;
}
