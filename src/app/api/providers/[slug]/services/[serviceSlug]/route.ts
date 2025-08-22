import { NextRequest, NextResponse } from 'next/server';
import { getServiceBySlug } from '@/app/utils/serviceUtils';
import providers from '@/data/providers.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; serviceSlug: string } }
) {
  try {
    const { slug, serviceSlug } = params;
    
    // Trouver le provider par son slug
    const provider = providers.find(p => p.slug === slug);
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider non trouvé' },
        { status: 404 }
      );
    }
    
    // Trouver le service par son slug
    const service = getServiceBySlug(serviceSlug);
    if (!service || service.providerId !== provider.provider_id) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      ...service,
      provider: {
        firstName: provider.firstName,
        lastName: provider.lastName,
        slug: provider.slug,
        avatar: provider.avatar,
        role: provider.role,
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
