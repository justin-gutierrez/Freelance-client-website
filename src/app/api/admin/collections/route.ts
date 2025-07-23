import { NextRequest, NextResponse } from 'next/server';
import { createCollectionWithImages, deleteCollectionAndImages } from '@/lib/firestore';
import { uploadImage } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const runtime = 'nodejs';

// Helper to parse multipart form data (for file uploads)
import formidable from 'formidable';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  // Parse form data
  const form = new formidable.IncomingForm({ multiples: true });
  const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const { name, description, tags, coverIndex, isVisible } = data.fields;
  const files = Array.isArray(data.files.images) ? data.files.images : [data.files.images];
  const tagsArr = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

  // Upload images to Firebase Storage
  const imageUploadResults = await Promise.all(
    files.map(async (file: any, idx: number) => {
      const buffer = await fs.promises.readFile(file.filepath);
      const blob = new Blob([buffer], { type: file.mimetype });
      const url = await uploadImage(blob as any, name.replace(/\s+/g, '-').toLowerCase());
      return {
        title: file.originalFilename,
        url,
        alt: `${name} image ${idx + 1}`,
      };
    })
  );
  const coverImageUrl = imageUploadResults[Number(coverIndex)]?.url || imageUploadResults[0]?.url;

  // Create Firestore document
  const docId = await createCollectionWithImages({
    name,
    description,
    tags: tagsArr,
    coverImageUrl,
    isVisible: isVisible === 'true' || isVisible === true,
    images: imageUploadResults,
  });

  return NextResponse.json({ success: true, id: docId });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  // Fetch the collection document to get images
  const q = query(collection(db, 'collections'), where('__name__', '==', id));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404 });
  }
  const docData = snapshot.docs[0].data();
  const images = docData.images || [];
  await deleteCollectionAndImages(id, images);
  return NextResponse.json({ success: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 