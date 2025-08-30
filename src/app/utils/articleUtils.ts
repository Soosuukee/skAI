import { Article } from '@/app/types/article';
import { getApiBaseUrl } from '@/app/utils/api';
const API_BASE_URL = getApiBaseUrl();

async function parseJsonSafe<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    const text = await response.text();
    throw new SyntaxError(`Non-JSON response (${response.status}): ${text.slice(0, 200)}`);
  }
  return (await response.json()) as T;
}

function buildCoverUrl(cover?: string): string | undefined {
  if (!cover) return undefined;
  // Already absolute
  if (/^https?:\/\//i.test(cover)) return cover;
  try {
    const origin = new URL(API_BASE_URL).origin; // e.g. http://localhost:8080
    // If backend returns paths like /api/v1/images/..., prefix with API origin
    if (cover.startsWith('/')) return `${origin}${cover}`;
    // Fallback: join with API_BASE_URL
    return `${API_BASE_URL.replace(/\/$/, '')}/${cover.replace(/^\//, '')}`;
  } catch {
    return cover;
  }
}

function withResolvedCover(article: Article): Article {
  return { ...article, articleCover: buildCoverUrl(article.articleCover) as any };
}

function normalizeArticle(raw: any): Article {
  const articleCover = raw.articleCover ?? raw.cover;
  const articleId = raw.articleId ?? raw.id;
  const providerId = raw.providerId ?? raw.provider_id ?? raw.providerID;
  const languageId = raw.languageId ?? raw.language_id ?? raw.languageID ?? raw.languageId; // keep as-is if provided

  return {
    articleId,
    providerId,
    languageId,
    title: raw.title,
    slug: raw.slug,
    publishedAt: raw.publishedAt,
    summary: raw.summary,
    isPublished: Boolean(raw.isPublished ?? true),
    isFeatured: Boolean(raw.isFeatured ?? false),
    articleCover,
    // Optional fields (tag/sections) may exist on raw; we don't enforce here
    tags: (raw.tags as any) ?? undefined,
    sections: (raw.sections as any) ?? undefined,
  } as unknown as Article;
}

/**
 * Récupère tous les articles depuis l'API
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await parseJsonSafe<any[]>(response);
    return data.map(normalizeArticle).map(withResolvedCover);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
}

/**
 * Récupère les articles d'un provider spécifique depuis l'API
 */
export async function getArticlesByProvider(providerId: number): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}/articles`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await parseJsonSafe<any[]>(response);
    return data.map(normalizeArticle).map(withResolvedCover);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles du provider:', error);
    return [];
  }
}

/**
 * Récupère un article par son slug depuis l'API
 */
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}`, { credentials: 'include' });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await parseJsonSafe<any>(response);
    return withResolvedCover(normalizeArticle(data));
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article par slug:', error);
    return undefined;
  }
}

/**
 * Récupère un article par son slug et son provider depuis l'API
 */
export async function getArticleBySlugAndProvider(articleSlug: string, providerId: number): Promise<Article | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}/articles/${articleSlug}`, { credentials: 'include' });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await parseJsonSafe<any>(response);
    return withResolvedCover(normalizeArticle(data));
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article par slug et provider:', error);
    return undefined;
  }
}

/**
 * Récupère les articles triés par date de publication (plus récents en premier)
 */
export async function getSortedArticles(): Promise<Article[]> {
  try {
    const articles = await getAllArticles();
    return articles.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  } catch (error) {
    console.error('Erreur lors du tri des articles:', error);
    return [];
  }
}

/**
 * Récupère les articles publiés uniquement
 */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const articles = await getAllArticles();
    return articles.filter(article => article.isPublished);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles publiés:', error);
    return [];
  }
}

/**
 * Récupère les articles par tag
 */
export async function getArticlesByTag(tag: string): Promise<Article[]> {
  try {
    const articles = await getAllArticles();
    return articles.filter(article => article.tag === tag);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles par tag:', error);
    return [];
  }
}

/**
 * Récupère les articles par langue
 */
export async function getArticlesByLanguage(language: string): Promise<Article[]> {
  try {
    const articles = await getAllArticles();
    return articles.filter(article => article.language === language);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles par langue:', error);
    return [];
  }
}

/**
 * Génère les paramètres statiques pour les pages d'articles
 */
export async function generateArticleStaticParams() {
  try {
    const articles = await getAllArticles();
    
    return articles.map(article => ({
      slug: article.slug
    }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques des articles:', error);
    return [];
  }
}

/**
 * Génère les paramètres statiques pour les pages d'articles par provider
 */
export async function generateArticleStaticParamsByProvider(providerId: number) {
  try {
    const articles = await getArticlesByProvider(providerId);
    
    return articles.map(article => ({
      articleSlug: article.slug
    }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques des articles par provider:', error);
    return [];
  }
}
