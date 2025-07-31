import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { requireAdminSession } from '@/lib/require-admin-session';

export const runtime = 'nodejs';

async function uploadToStorage(buffer: Buffer, filename: string, contentType: string) {
  const bucket = storage.bucket();
  const fileRef = bucket.file(filename);
  
  // Set proper content type for WebP files
  const finalContentType = filename.endsWith('.webp') ? 'image/webp' : contentType;
  
  await fileRef.save(buffer, { contentType: finalContentType });
  await fileRef.makePublic();
  const url = fileRef.publicUrl();
  return { url, filename };
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof Response) return session;

  try {
    const formData = await req.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const tags = formData.get('tags') as string;
    const description = formData.get('description') as string;
    const coverIndex = formData.get('coverIndex') as string;
    const isVisible = formData.get('isVisible') as string;
    
    const tagsArr = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
    
    // Extract files
    const images = formData.getAll('images') as File[];
    
    // Upload images
    const imageUploadResults = await Promise.all(
      images.map(async (file: File, idx: number) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `collections/${slug}/${file.name}`;
        const { url } = await uploadToStorage(buffer, filename, file.type);
        
        return {
          id: uuidv4(),
          title: file.name,
          url,
          alt: `${name} image ${idx + 1}`,
          filename,
        };
      })
    );
    
    const coverImageUrl = imageUploadResults[Number(coverIndex)]?.url || imageUploadResults[0]?.url;

    // Save Firestore document
    const docRef = await db.collection('collections').add({
      name,
      slug,
      description,
      tags: tagsArr,
      coverImageUrl,
      isVisible: isVisible === 'true' || isVisible === true,
      images: imageUploadResults,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
} 