import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/providers.json';
import articlesData from '@/data/articles.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
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
    
    return NextResponse.json({
      provider_id: provider.id,
      articles: articles || []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
