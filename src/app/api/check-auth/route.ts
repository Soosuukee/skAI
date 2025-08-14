import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserById } from "@/app/utils/userUtils";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les headers ou les cookies
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || 
                  request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token manquant" },
        { status: 401 }
      );
    }

    // Vérifier le token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: "Token invalide" },
        { status: 401 }
      );
    }

    // Récupérer les informations de l'utilisateur
    const user = findUserById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 401 }
      );
    }

    // Retourner les informations de l'utilisateur (sans le mot de passe)
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error);
    return NextResponse.json(
      { message: "Token invalide" },
      { status: 401 }
    );
  }
}
