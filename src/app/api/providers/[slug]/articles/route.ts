import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/providers.json';
import articlesData from '@/data/articles.json';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Rechercher le provider par slug
    const provider = providersData.find(p => p.slug === slug);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Récupérer les articles du provider
    const articles = articlesData.filter(a => a.provider_id === provider.id);
    
    // Articles par défaut si aucun n'est trouvé
    const defaultArticles = [
      {
        article_id: 999,
        provider_id: provider.id,
        slug: `article-${provider.slug}`,
        title: `Article de ${provider.firstName} ${provider.lastName}`,
        summary: `Découvrez les dernières innovations et réflexions de ${provider.firstName} ${provider.lastName} dans le domaine de ${provider.role.toLowerCase()}.`,
        published_at: "2024-01-15",
        image: "/images/blog/health/gpu-health.jpg",
        tag: "Technologie",
        language: "Français",
        content: {
          sections: [
            {
              type: "paragraph",
              content: `Cet article présente les dernières avancées technologiques et les perspectives d'avenir dans le domaine de ${provider.role.toLowerCase()}.`
            }
          ]
        }
      }
    ];
    
    return NextResponse.json({
      provider_id: provider.id,
      articles: articles.length > 0 ? articles : defaultArticles
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
