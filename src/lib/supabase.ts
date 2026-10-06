import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const STORAGE_KEY_SUPABASE_CONFIG = 'wp_master_supabase_config';
const STORAGE_KEY_LOCAL_USER = 'wp_master_local_user';
const STORAGE_KEY_LOCAL_PROFILE = 'wp_master_local_profile';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSavedSupabaseConfig(): SupabaseConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUPABASE_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }
  return null;
}

export function saveSupabaseConfig(config: SupabaseConfig | null) {
  if (!config || !config.url || !config.anonKey) {
    localStorage.removeItem(STORAGE_KEY_SUPABASE_CONFIG);
  } else {
    localStorage.setItem(STORAGE_KEY_SUPABASE_CONFIG, JSON.stringify(config));
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const cfg = getSavedSupabaseConfig();
  if (!cfg?.url || !cfg?.anonKey) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch {
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
}

// Reset instance when config changes
export function resetSupabaseClient() {
  supabaseInstance = null;
}

// Supabase Authentication & Profile Management
export async function signUpUser(data: {
  name: string;
  phone: string;
  email: string;
  password: string;
}): Promise<{ user: UserProfile | null; error: string | null }> {
  const client = getSupabase();

  if (client) {
    try {
      const { data: authData, error: authError } = await client.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
          },
        },
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (authData.user) {
        // Upsert into profiles table
        const profile: UserProfile = {
          id: authData.user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: 'Administrator',
          createdAt: new Date().toISOString(),
        };

        await client.from('profiles').upsert([profile]);
        return { user: profile, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Supabase signup failed' };
    }
  }

  // Local fallback persistence
  const localProfile: UserProfile = {
    id: 'admin-' + Date.now(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'Administrator',
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY_LOCAL_USER,
    JSON.stringify({ email: data.email, password: data.password })
  );
  localStorage.setItem(STORAGE_KEY_LOCAL_PROFILE, JSON.stringify(localProfile));

  return { user: localProfile, error: null };
}

export async function signInUser(
  email: string,
  password: string
): Promise<{ user: UserProfile | null; error: string | null }> {
  const client = getSupabase();

  if (client) {
    try {
      const { data: authData, error: authError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (authData.user) {
        // Fetch profile
        const { data: profileData } = await client
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const userProfile: UserProfile = {
          id: authData.user.id,
          name: profileData?.name || authData.user.user_metadata?.name || email.split('@')[0],
          email: authData.user.email || email,
          phone: profileData?.phone || authData.user.user_metadata?.phone || '',
          role: profileData?.role || 'Administrator',
          createdAt: authData.user.created_at,
        };

        return { user: userProfile, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Supabase login failed' };
    }
  }

  // Local fallback
  const savedCreds = localStorage.getItem(STORAGE_KEY_LOCAL_USER);
  const savedProfile = localStorage.getItem(STORAGE_KEY_LOCAL_PROFILE);

  if (savedCreds) {
    const creds = JSON.parse(savedCreds);
    if (creds.email.toLowerCase() === email.toLowerCase() && creds.password === password) {
      const profile = savedProfile ? JSON.parse(savedProfile) : {
        id: 'admin-local',
        name: 'Master Admin',
        email,
        phone: '',
        role: 'Administrator',
      };
      return { user: profile, error: null };
    }
  }

  // Initial seed admin if clean install without signup yet
  if (email === 'admin@wpmaster.local' && password === 'admin123') {
    const defaultProfile: UserProfile = {
      id: 'admin-default',
      name: 'WP Master Admin',
      email: 'admin@wpmaster.local',
      phone: '+1 (555) 019-2831',
      role: 'Administrator',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_LOCAL_PROFILE, JSON.stringify(defaultProfile));
    return { user: defaultProfile, error: null };
  }

  return { user: null, error: 'Invalid email or password' };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const client = getSupabase();

  if (client) {
    try {
      const { data } = await client.auth.getSession();
      if (data.session?.user) {
        const u = data.session.user;
        const { data: profileData } = await client
          .from('profiles')
          .select('*')
          .eq('id', u.id)
          .single();

        return {
          id: u.id,
          name: profileData?.name || u.user_metadata?.name || u.email?.split('@')[0] || 'Admin',
          email: u.email || '',
          phone: profileData?.phone || u.user_metadata?.phone || '',
          role: profileData?.role || 'Administrator',
          createdAt: u.created_at,
        };
      }
    } catch {
      // fallback
    }
  }

  const savedProfile = localStorage.getItem(STORAGE_KEY_LOCAL_PROFILE);
  if (savedProfile) {
    try {
      return JSON.parse(savedProfile);
    } catch {
      return null;
    }
  }

  // Default demo active session for seamless first-time review
  return {
    id: 'admin-default',
    name: 'WP Master Admin',
    email: 'admin@wpmaster.local',
    phone: '+1 (555) 019-2831',
    role: 'Administrator',
    createdAt: new Date().toISOString(),
  };
}

export async function signOutUser() {
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch {
      // ignore
    }
  }
  localStorage.removeItem(STORAGE_KEY_LOCAL_PROFILE);
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  const current = await getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    ...profile,
  };

  const client = getSupabase();
  if (client) {
    try {
      await client.from('profiles').upsert([updated]);
    } catch {
      // ignore
    }
  }

  localStorage.setItem(STORAGE_KEY_LOCAL_PROFILE, JSON.stringify(updated));
  return updated;
}

// SQL Schema Generator for Supabase
export const SUPABASE_SQL_SCHEMA = `-- WP Master Supabase Database Schema
-- Run this in your Supabase Project SQL Editor to provision tables and RLS:

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'Administrator',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. WordPress Sites Table
CREATE TABLE IF NOT EXISTS public.wordpress_sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  admin_url TEXT NOT NULL,
  site_url TEXT NOT NULL,
  username TEXT NOT NULL,
  auth_type TEXT DEFAULT 'application_password',
  status TEXT DEFAULT 'connected',
  last_sync TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  wp_version TEXT,
  wc_version TEXT,
  has_woocommerce BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Site Sync Logs
CREATE TABLE IF NOT EXISTS public.site_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID REFERENCES public.wordpress_sites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.wordpress_sites(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wordpress_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated user can only read/write their own data
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own wordpress sites" ON public.wordpress_sites
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sync logs" ON public.site_sync_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own audit logs" ON public.audit_logs
  FOR ALL USING (auth.uid() = user_id);
`;
