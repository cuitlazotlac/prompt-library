import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFile(file: File, path: string): Promise<{ url: string; name: string }> {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);

    // Upload the file with metadata including CORS settings
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, HEAD',
      },
    };

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file, metadata);

    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);

    return {
      url,
      name: file.name,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
} 