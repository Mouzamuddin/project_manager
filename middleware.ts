import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // You can add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,  // Check if token exists
    },
  }
);

// Apply middleware to these routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/projects/:path*'],
};
