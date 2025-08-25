import { NextRequest, NextResponse } from 'next/server';
import { Article } from '@/app/types/article';
import articles from '@/data/articles.json';

/**
 * Transforme les données JSON vers le format Article
 */
function transformArticleData(jsonArticle: any): Article {
  return {
    articleId: jsonArticle.articleId,
    providerId: jsonArticle.providerId,
    slug: jsonArticle.slug,
    title: jsonArticle.title,
    summary: jsonArticle.summary,
    publishedAt: jsonArticle.publishedAt,
    articleCover: jsonArticle.articleCover,
    tag: jsonArticle.tag,
    language: jsonArticle.language,
    isPublished: jsonArticle.isPublished || true,
    content: jsonArticle.content
  };
}

/**
 * GET /api/providers/[providerId]/articles/[articleSlug]
 * Récupère un article spécifique d'un provider
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { providerId: string; articleSlug: string } }
) {
  try {
    const providerId = parseInt(params.providerId);
    const { articleSlug } = params;
    
    if (isNaN(providerId)) {
      return NextResponse.json(
        { error: 'ID de provider invalide' },
        { status: 400 }
      );
    }
    
    const jsonArticle = articles.find(a => 
      a.providerId === providerId && a.slug === articleSlug
    );
    
    if (!jsonArticle) {
      return NextResponse.json(
        { error: 'Article non trouvé pour ce provider' },
        { status: 404 }
      );
    }
    
    const article = transformArticleData(jsonArticle);
    
    return NextResponse.json(article, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
