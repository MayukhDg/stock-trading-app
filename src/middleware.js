import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/subscribe",
  "/api/portfolio",
  "/api/insights",
  "/api/news",
  "/api/zerodha/:path*",
  "/api/stripe/:path*",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/subscribe",
    "/api/portfolio",
    "/api/insights",
    "/api/news",
    "/api/zerodha/:path*",
    "/api/stripe/:path*",
  ],
};

