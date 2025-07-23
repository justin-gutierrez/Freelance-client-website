import { getFirestore, collection, getDocs, query, where, QueryDocumentSnapshot } from 'firebase/firestore';
// import { app } from './firebase'; // Uncomment and configure if you have a firebase.ts for app initialization
// If you see a type error, install types: npm install --save-dev @types/firebase

// const db = getFirestore(app); // Use this if you have a firebase.ts
const db = getFirestore(); // Assumes firebase.initializeApp has already been called somewhere

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