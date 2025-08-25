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
 * GET /api/providers/[providerId]/articles
 * Récupère les articles d'un provider spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { providerId: string } }
) {
  try {
    const providerId = parseInt(params.providerId);
    
    if (isNaN(providerId)) {
      return NextResponse.json(
        { error: 'ID de provider invalide' },
        { status: 400 }
      );
    }
    
    const providerArticles = articles.filter(a => a.providerId === providerId);
    const transformedArticles = providerArticles.map(transformArticleData);
    
    return NextResponse.json(transformedArticles, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles du provider:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
