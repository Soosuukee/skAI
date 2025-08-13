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
    const socialLinks = socialLinksData.filter(s => s.provider_id === provider.id);
    
    // Liens sociaux par défaut si aucun n'est trouvé
    const defaultSocial = [
      {
        name: "LinkedIn",
        icon: "linkedin",
        link: `https://www.linkedin.com/in/${provider.slug}`
      },
      {
        name: "GitHub",
        icon: "github",
        link: `https://github.com/${provider.slug}`
      },
      {
        name: "X",
        icon: "x",
        link: `https://x.com/${provider.slug}`
      }
    ];
    
    // Transformer les données pour correspondre au format attendu
    const social = socialLinks.length > 0 
      ? socialLinks.map(link => ({
          name: link.network,
          icon: link.network.toLowerCase(),
          link: link.url
        }))
      : defaultSocial;
    
    return NextResponse.json({
      provider_id: provider.id,
      social: social
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
