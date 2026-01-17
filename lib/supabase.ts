import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null;

// Lazy initialization function
export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseInstance;
}

// For backward compatibility - exports the lazy getter
export const supabase = {
  get auth() {
    return getSupabase().auth;
  },
  from(table: string) {
    return getSupabase().from(table);
  },
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await getSupabase().auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get the current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  return session;
};

// Sign out helper
export const signOut = async () => {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
};
