import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASIC_AUTH_USER = process.env.ADMIN_USER || 'admin';
const BASIC_AUTH_PASS = process.env.ADMIN_PASS || 'password';

function isAuthorized(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString();
  const [user, pass] = credentials.split(':');
  return user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASS;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    if (!isAuthorized(authHeader)) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
      });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
