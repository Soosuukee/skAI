import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/register
 * Inscription utilisateur (client ou provider)
 * Payload attendu: { userType: 'client'|'provider', firstName, lastName, email, password, ... }
 * NOTE: Endpoint placeholder qui simule la persistance.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userType, firstName, lastName, email, password } = body || {};

    if (!userType || !email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Ici on simule l'inscription et on renvoie un utilisateur minimal
    const user = {
      id: Math.floor(Math.random() * 1000000),
      email,
      role: userType === 'provider' ? 'provider' : 'client',
    };

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}


