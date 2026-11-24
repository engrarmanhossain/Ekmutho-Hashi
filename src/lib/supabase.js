import { createClient } from '@supabase/supabase-js';

// Clean and sanitize Supabase URL (strips /rest/v1/, /auth/v1/, trailing slashes to isolate the project origin)
export const cleanSupabaseUrl = (inputUrl) => {
  if (!inputUrl) return '';
  let url = inputUrl.trim();
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch (e) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      try {
        const parsed = new URL('https://' + url);
        return parsed.origin;
      } catch (err) {
        // fallback regex below
      }
    }
    return url.replace(/\/rest\/v1\/?.*$/i, '').replace(/\/auth\/v1\/?.*$/i, '').replace(/\/+$/, '');
  }
};

// Retrieve credentials from Vite env or local storage
export const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('ekmutho_supabase_url');
  const localKey = localStorage.getItem('ekmutho_supabase_anon_key');

  const rawUrl = (localUrl && localUrl.trim()) || (envUrl && envUrl.trim()) || '';
  const url = cleanSupabaseUrl(rawUrl);
  const key = (localKey && localKey.trim()) || (envKey && envKey.trim()) || '';

  return { url, key };
};

let clientInstance = null;
let currentUrl = '';
let currentKey = '';

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    clientInstance = null;
    return null;
  }

  // Re-instantiate if credentials changed
  if (!clientInstance || url !== currentUrl || key !== currentKey) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      currentUrl = url;
      currentKey = key;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      clientInstance = null;
    }
  }

  return clientInstance;
};

export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
};

export const saveSupabaseConfig = (url, key) => {
  const cleanedUrl = cleanSupabaseUrl(url);
  if (cleanedUrl) localStorage.setItem('ekmutho_supabase_url', cleanedUrl);
  if (key) localStorage.setItem('ekmutho_supabase_anon_key', key.trim());
  clientInstance = null;
  return getSupabaseClient();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('ekmutho_supabase_url');
  localStorage.removeItem('ekmutho_supabase_anon_key');
  clientInstance = null;
};
