// middleware.ts
import arcjet, { detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/account(.*)",
  "/transactions(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: 'LIVE'
    }),
    detectBot({
      mode: 'LIVE',
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    })
  ]
})

const clerk = clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();

  if(!userId && isProtectedRoute(req)) {
     const {redirectToSignIn} = await auth();

     return redirectToSignIn();
  }
});

export default createMiddleware(aj, clerk);

// Configure routes that require authentication
export const config = {
  matcher: [
    /*
     * Protect all routes except API, static, and Next.js internals.
     * Adjust this to your needs.
     */ 
    "/((?!api|_next|static|favicon.ico|.*\\..*).*)",
  ],
};