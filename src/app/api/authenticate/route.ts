import { NextRequest, NextResponse } from "next/server";
import { validateUserCredentials, updateLastLogin } from "@/app/utils/userUtils";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" }, 
        { status: 400 }
      );
    }

    const user = validateUserCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" }, 
        { status: 401 }
      );
    }

    // Mettre à jour la dernière connexion
    updateLastLogin(user.user_id);

    // Créer un token JWT
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Retourner les informations de l'utilisateur et le token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role,
        provider_id: user.provider_id
      },
      token,
    });

    // Définir le cookie pour le token
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    });

    return response;
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" }, 
      { status: 500 }
    );
  }
}
