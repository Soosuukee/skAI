import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes qui nécessitent une authentification
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/me",
  "/admin",
];

// Routes d'authentification (pages de connexion/inscription)
const authRoutes = [
  "/login",
  "/register", 
  "/join",
];

// Routes publiques qui ne nécessitent pas de vérification
const publicRoutes = [
  "/",
  "/about",
  "/blog",
  "/gallery",
  "/providers",
  "/service",
  "/join",
  "/me",
  "/login",
  "/servicecreation",
  "/experiencecreation",
  "/educationcreation",
  "/articlecreation",
  "/test-datepicker",
  "/mdx-test",
  "/work",
  "/api",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorer les routes publiques et les assets
  if (publicRoutes.some(route => pathname.startsWith(route)) ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.includes(".")) {
    return NextResponse.next();
  }

  // Récupérer le token depuis les cookies ou les headers
  const token = request.cookies.get("authToken")?.value || 
                request.headers.get("authorization")?.replace("Bearer ", "");

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Vérifier si c'est une route d'authentification
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Si c'est une route protégée et qu'il n'y a pas de token
  if (isProtectedRoute && !token) {
    // Rediriger vers la page d'accueil avec un paramètre pour ouvrir le modal de connexion
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("login", "true");
    homeUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(homeUrl);
  }

  // Si c'est une route d'auth et qu'il y a déjà un token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
