// middleware.ts

import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // You can leave publicRoutes empty for now.
  // This means all routes are protected by default.
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};