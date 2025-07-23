import { getFirestore, collection, getDocs, query, where, QueryDocumentSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { app } from './firebase';
// If you see a type error, install types: npm install --save-dev @types/firebase

const db = getFirestore(app); // Assumes firebase.initializeApp has already been called somewhere

export interface Collection {
  id: string;
  title: string;
  description: string;
  photoCount: number;
  slug: string;
  isVisible: boolean;
  // Add other fields as needed
}

export interface CollectionImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
}

export interface NewCollectionInput {
  name: string;
  description: string;
  tags: string[];
  coverImageUrl: string;
  isVisible: boolean;
  images: Array<{ title: string; url: string; alt: string }>;
}

// Fetch all collections where isVisible === true
export async function getVisibleCollections(): Promise<Collection[]> {
  const q = query(collection(db, 'collections'), where('isVisible', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap: QueryDocumentSnapshot) => ({ id: docSnap.id, ...docSnap.data() } as Collection));
}

// Fetch a specific collection and its images by slug
export async function getCollectionBySlug(slug: string): Promise<{ collection: Collection | null; images: CollectionImage[] }> {
  // Find the collection by slug
  const q = query(collection(db, 'collections'), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return { collection: null, images: [] };
  }
  const collectionDoc = querySnapshot.docs[0];
  const collectionData = { id: collectionDoc.id, ...collectionDoc.data() } as Collection;

  // Fetch images subcollection
  const imagesCol = collection(db, 'collections', collectionDoc.id, 'images');
  const imagesSnapshot = await getDocs(imagesCol);
  const images = imagesSnapshot.docs.map((imgDoc: QueryDocumentSnapshot) => ({ id: imgDoc.id, ...imgDoc.data() } as CollectionImage));

  return { collection: collectionData, images };
}

/**
 * Create a new collection document in Firestore with images
 * @param data New collection data
 * @returns Promise<string> The new document ID
 */
export async function createCollectionWithImages(data: NewCollectionInput): Promise<string> {
  const docRef = await addDoc(collection(db, 'collections'), {
    name: data.name,
    description: data.description,
    tags: data.tags,
    coverImageUrl: data.coverImageUrl,
    isVisible: data.isVisible,
    images: data.images,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Delete a collection document and all associated images from Firebase Storage
 * @param collectionId The Firestore document ID
 * @param images Array of image objects with a url property
 */
export async function deleteCollectionAndImages(collectionId: string, images: Array<{ url: string }>) {
  // Delete images from Storage
  const storage = getStorage();
  for (const img of images) {
    if (img.url) {
      try {
        // Extract the storage path from the download URL
        const url = new URL(img.url);
        const pathMatch = url.pathname.match(/\/o\/(.+)$/);
        let storagePath = '';
        if (pathMatch && pathMatch[1]) {
          storagePath = decodeURIComponent(pathMatch[1]);
        } else {
          // Fallback: try to parse after '/collections/'
          const idx = url.pathname.indexOf('/collections/');
          if (idx !== -1) {
            storagePath = decodeURIComponent(url.pathname.substring(idx + 1));
          }
        }
        if (storagePath) {
          const imageRef = ref(storage, storagePath);
          await deleteObject(imageRef);
        }
      } catch (err) {
        // Ignore errors for missing files
      }
    }
  }
  // Delete the Firestore document
  const db = getFirestore();
  await deleteDoc(doc(db, 'collections', collectionId));
} 