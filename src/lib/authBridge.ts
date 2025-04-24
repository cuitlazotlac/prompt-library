import { auth } from './firebase';

export async function getSupabaseHeaders() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }

  // Get the Firebase ID token
  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY
  };
} 