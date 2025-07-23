import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { app } from './firebase'; // Uncomment if you have a firebase.ts for app initialization

// const storage = getStorage(app); // Use this if you have a firebase.ts
const storage = getStorage(); // Assumes firebase.initializeApp has already been called somewhere

/**
 * Upload an image file to Firebase Storage under collections/<slug>/<filename>
 * @param file File to upload
 * @param collectionSlug Slug of the collection
 * @returns Promise<string> download URL
 */
export async function uploadImage(file: File, collectionSlug: string): Promise<string> {
  const storageRef = ref(storage, `collections/${collectionSlug}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
} 