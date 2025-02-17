import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // TODO: Add role check when roles are implemented
    // const { data: { user } } = await supabase.auth.getUser();
    // if (user?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
}; 