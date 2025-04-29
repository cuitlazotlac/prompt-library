import { createClient } from '@supabase/supabase-js';
import { auth } from './firebase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to get Supabase session using Firebase token
export async function getSupabaseSession() {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    // Get the Firebase ID token
    const token = await user.getIdToken();

    // Sign in to Supabase with the Firebase token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'firebase',
      token
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('Error getting Supabase session:', error);
    return null;
  }
} 