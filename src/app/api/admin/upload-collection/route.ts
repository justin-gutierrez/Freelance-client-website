import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import { Readable } from 'stream';

export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

async function parseForm(req: NextRequest) {
  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function uploadToStorage(file: any, slug: string) {
  const bucket = storage.bucket();
  const filename = `collections/${slug}/${file.originalFilename}`;
  const fileRef = bucket.file(filename);
  const buffer = await fileToBuffer(file);
  await fileRef.save(buffer, { contentType: file.mimetype });
  await fileRef.makePublic();
  const url = fileRef.publicUrl();
  return { url, filename };
}

function fileToBuffer(file: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = Readable.from(file.filepath ? require('fs').createReadStream(file.filepath) : file._writeStream);
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function POST(req: NextRequest) {
  // Admin key check
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Parse form data
  const { fields, files } = await parseForm(req);
  const { name, slug, tags, description, coverIndex, isVisible } = fields;
  const tagsArr = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
  const fileList = Array.isArray(files.images) ? files.images : [files.images];

  // Upload images
  const imageUploadResults = await Promise.all(
    fileList.map(async (file: any, idx: number) => {
      const { url, filename } = await uploadToStorage(file, slug);
      return {
        id: uuidv4(),
        title: file.originalFilename,
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
} 