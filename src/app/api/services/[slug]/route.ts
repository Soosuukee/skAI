import { NextRequest, NextResponse } from 'next/server';
import { Service } from '@/app/types/service';
import services from '@/data/services.json';

/**
 * Transforme les données JSON vers le format Service
 */
function transformServiceData(jsonService: any): Service {
  return {
    serviceId: jsonService.serviceId,
    providerId: jsonService.providerId,
    title: jsonService.title,
    description: jsonService.summary,
    slug: jsonService.slug || jsonService.title.toLowerCase().replace(/\s+/g, '-'),
    isActive: jsonService.isActive,
    isFeatured: jsonService.isFeatured,
    minPrice: jsonService.minPrice,
    maxPrice: jsonService.maxPrice,
    estimatedDuration: jsonService.estimatedDuration || 'À définir',
    availability: jsonService.availability || 'Disponible',
    responseTime: jsonService.responseTime || '24h',
    rating: jsonService.rating,
    reviewCount: jsonService.reviewCount,
    completedProjects: jsonService.completedProjects,
    createdAt: jsonService.createdAt,
    updatedAt: jsonService.updatedAt
  };
}

/**
 * GET /api/services/[slug]
 * Récupère un service par son slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const jsonService = services.find(s => {
      const serviceSlug = s.slug || s.title.toLowerCase().replace(/\s+/g, '-');
      return serviceSlug === slug;
    });
    
    if (!jsonService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }
    
    const service = transformServiceData(jsonService);
    
    return NextResponse.json(service, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
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
