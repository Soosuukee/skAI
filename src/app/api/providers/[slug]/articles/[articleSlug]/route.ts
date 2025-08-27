import { NextRequest, NextResponse } from 'next/server';
import articlesData from '@/data/articles.json';
import providersData from '@/data/providers.json';

/**
 * GET /api/providers/[slug]/articles/[articleSlug]
 * Récupère un article spécifique d'un provider
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; articleSlug: string }> }
) {
  try {
    const { slug, articleSlug } = await params;
    console.log('Debug - Slug provider:', slug);
    console.log('Debug - Slug article:', articleSlug);

    // Trouver le provider par son slug
    const provider = providersData.find(p => p.slug === slug);
    console.log('Debug - Provider trouvé:', provider);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Trouver l'article par son slug
    const article = articlesData.find(a => a.slug === articleSlug);
    console.log('Debug - Article trouvé:', article);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Vérifier que l'article appartient bien au provider
    if (article.providerId !== provider.provider_id) {
      return NextResponse.json(
        { error: 'Article does not belong to this provider' },
        { status: 403 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article du provider:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
