import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Supprimer le cookie de session
  response.headers.set(
    "Set-Cookie",
    cookie.serialize("sessionToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immédiatement
      sameSite: "strict",
      path: "/",
    })
  );

  return response;
}
