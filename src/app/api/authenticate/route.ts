import { NextRequest, NextResponse } from "next/server";

// Endpoint déprécié: l'authentification passe par l'API externe (/auth/login)
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { message: "/api/authenticate est déprécié. Utilisez l'API externe /auth/login." },
    { status: 410 }
  );
}
