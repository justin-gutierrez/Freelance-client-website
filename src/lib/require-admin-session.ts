import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { NextRequest } from 'next/server';

export async function requireAdminSession(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  console.log('Session check:', {
    hasSession: !!session,
    user: session?.user,
    role: session?.user?.role,
  });
  
  if (!session || (session.user && session.user.role !== 'admin')) {
    console.log('Unauthorized - returning 401');
    return new Response('Unauthorized', { status: 401 });
  }
  
  console.log('Authorized - session valid');
  return session;
} 