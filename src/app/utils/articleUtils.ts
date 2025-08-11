import articlesData from '@/data/articles.json';

export interface ArticleSection {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'image' | 'links';
  content?: string;
  level?: number;
  language?: string;
  items?: string[] | { text: string; url: string }[];
  src?: string;
  alt?: string;
  aspectRatio?: string;
  text?: string;
  url?: string;
}

export interface ArticleContent {
  sections: ArticleSection[];
}

export interface Article {
  article_id: number;
  provider_id: number;
  slug: string;
  title: string;
  summary: string;
  published_at: string;
  image: string;
  tag: string;
  language: string;
  content: ArticleContent;
}

export function getAllArticles(): Article[] {
  return articlesData as Article[];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find(article => article.slug === slug);
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter(article => article.tag === tag);
}

export function getArticlesByLanguage(language: string): Article[] {
  return getAllArticles().filter(article => article.language === language);
}

export function getSortedArticles(): Article[] {
  return getAllArticles().sort((a, b) => {
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });
}

export function getArticleSlugs(): string[] {
  return getAllArticles().map(article => article.slug);
}
