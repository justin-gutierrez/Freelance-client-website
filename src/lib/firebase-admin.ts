import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Validate environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!projectId || !clientEmail || !privateKeyRaw || !storageBucket) {
  throw new Error('Missing required Firebase environment variables');
}

// Parse the private key
const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket,
  });
}

export const db = getFirestore();
export const storage = getStorage(); 