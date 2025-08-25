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
 * GET /api/services
 * Récupère tous les services
 */
export async function GET(request: NextRequest) {
  try {
    const transformedServices = services.map(transformServiceData);
    
    return NextResponse.json(transformedServices, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
