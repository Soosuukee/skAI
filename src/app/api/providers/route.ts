import { NextRequest, NextResponse } from 'next/server';
import { Provider } from '@/app/types/provider';
import providers from '@/data/providers.json';

/**
 * Transforme les données JSON vers le format Provider
 */
function transformProviderData(jsonProvider: any): Provider {
  return {
    providerId: jsonProvider.provider_id,
    slug: jsonProvider.slug,
    firstName: jsonProvider.firstName,
    lastName: jsonProvider.lastName,
    email: jsonProvider.email,
    avatar: jsonProvider.avatar,
    location: jsonProvider.location,
    createdAt: jsonProvider.createdAt
  };
}

/**
 * GET /api/providers
 * Récupère tous les providers
 */
export async function GET(request: NextRequest) {
  try {
    const transformedProviders = providers.map(transformProviderData);
    
    return NextResponse.json(transformedProviders, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des providers:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
