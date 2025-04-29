import { supabase, getSupabaseSession } from './supabase';
import { auth } from './firebase';

// Constants for file validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const BUCKET_NAME = 'prompts';

export async function uploadFile(
  file: File,
  callbacks?: {
    onProgress?: (progress: number) => void;
    onComplete?: (url: string) => void;
    onError?: (error: Error) => void;
  }
): Promise<{ url: string; name: string }> {
  try {
    // Basic validations
    if (!file) throw new Error('No file provided');
    if (file.size > MAX_FILE_SIZE) throw new Error('File size must be less than 5MB');
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Invalid file type');
    
    // Check Firebase authentication
    const user = auth.currentUser;
    if (!user) throw new Error('Must be logged in to upload');

    // Get Supabase session
    const session = await getSupabaseSession();
    if (!session) throw new Error('Failed to authenticate with Supabase');

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${user.uid}/${timestamp}_${sanitizedName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(error.message);
    }

    if (!data?.path) {
      throw new Error('Upload successful but no path returned');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    callbacks?.onComplete?.(publicUrl);

    return {
      url: publicUrl,
      name: file.name
    };

  } catch (error: any) {
    console.error('Upload error:', error);
    const message = error.message || 'Upload failed';
    callbacks?.onError?.(new Error(message));
    throw error;
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Must be logged in to delete files');

    // Extract filename from URL
    const fileName = url.split(`${BUCKET_NAME}/`)[1]?.split('?')[0];
    if (!fileName) throw new Error('Invalid file URL');

    // Verify user owns the file
    if (!fileName.startsWith(user.uid + '/')) {
      throw new Error('You can only delete your own files');
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) throw error;
  } catch (error: any) {
    console.error('Delete error:', error);
    throw new Error(error.message || 'Failed to delete file');
  }
} 