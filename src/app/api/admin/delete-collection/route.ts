import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
  // Admin key check
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { collectionSlug } = await req.json();
  if (!collectionSlug) {
    return NextResponse.json({ error: 'Missing collectionSlug' }, { status: 400 });
  }

  // Find and delete the Firestore document
  const snapshot = await db.collection('collections').where('slug', '==', collectionSlug).get();
  if (snapshot.empty) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }
  const docRef = snapshot.docs[0].ref;
  await docRef.delete();

  // Delete all images in Storage under collections/{slug}/
  const bucket = storage.bucket();
  const [files] = await bucket.getFiles({ prefix: `collections/${collectionSlug}/` });
  await Promise.all(files.map(file => file.delete()));

  return NextResponse.json({ success: true });
} 