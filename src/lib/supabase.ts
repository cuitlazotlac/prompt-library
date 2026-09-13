import { createClient } from '@supabase/supabase-js';
import { auth } from './firebase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Image storage is a legacy authenticated feature. Keep it optional so the
// local, no-login Recipe experience does not need Supabase credentials.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Function to get Supabase session using Firebase token
export async function getSupabaseSession() {
  try {
    if (!auth || !supabase) return null;
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
