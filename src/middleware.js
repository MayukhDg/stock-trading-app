import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

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

