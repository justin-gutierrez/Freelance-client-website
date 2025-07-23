import * as admin from 'firebase-admin';

const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

console.log('[FIREBASE ADMIN ENV]', {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY: privateKey ? privateKey.substring(0, 20) + '...' : undefined,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      privateKey
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const db = admin.firestore();
export const storage = admin.storage(); 