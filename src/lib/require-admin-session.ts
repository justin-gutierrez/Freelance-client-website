import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { NextRequest } from 'next/server';

export async function requireAdminSession(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user && session.user.role !== 'admin')) {
    return new Response('Unauthorized', { status: 401 });
  }
  return session;
} 