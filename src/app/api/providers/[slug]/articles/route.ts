import { NextRequest, NextResponse } from 'next/server';
import articlesData from '@/data/articles.json';
import providersData from '@/data/providers.json';

/**
 * GET /api/providers/[slug]/articles
 * Récupère tous les articles d'un provider spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    console.log('Debug - Slug reçu:', slug);

    // Trouver le provider par son slug
    const provider = providersData.find(p => p.slug === slug);
    console.log('Debug - Provider trouvé:', provider);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Filtrer les articles par providerId
    const providerArticles = articlesData.filter(
      article => article.providerId === provider.provider_id
    );
    console.log('Debug - Articles trouvés:', providerArticles.length);

    return NextResponse.json(providerArticles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles du provider:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
