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
 * GET /api/articles
 * Récupère tous les articles
 */
export async function GET(request: NextRequest) {
  try {
    const transformedArticles = articles.map(transformArticleData);
    
    return NextResponse.json(transformedArticles, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
