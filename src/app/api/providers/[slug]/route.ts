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
 * GET /api/providers/[slug]
 * Récupère un provider par son slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const jsonProvider = providers.find(p => p.slug === slug);
    
    if (!jsonProvider) {
      return NextResponse.json(
        { error: 'Provider non trouvé' },
        { status: 404 }
      );
    }
    
    const provider = transformProviderData(jsonProvider);
    
    return NextResponse.json(provider, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du provider:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
