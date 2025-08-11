import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/providers.json';
import socialLinksData from '@/data/socialLinks.json';

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

    // Récupérer les liens sociaux
    const socialLinks = socialLinksData.find(s => s.provider_id === provider.id);
    
    return NextResponse.json({
      provider_id: provider.id,
      social: socialLinks?.social || []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
