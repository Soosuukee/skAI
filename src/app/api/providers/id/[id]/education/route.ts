import { NextRequest, NextResponse } from 'next/server';
import { Education } from '@/app/types/education';
import providerEducation from '@/data/providerEducation.json';

/**
 * GET /api/providers/id/[id]/education
 * Récupère les diplômes/éducation d'un provider
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const providerId = parseInt(id);

    if (isNaN(providerId)) {
      return NextResponse.json(
        { error: 'ID de provider invalide' },
        { status: 400 }
      );
    }

    const items: Education[] = (providerEducation as any[])
      .filter((e) => (e.providerId ?? e.provider_id) === providerId)
      .map((e) => ({
        diplomaId: e.diplomaId ?? e.diploma_id,
        diplomaTitle: e.diplomaTitle ?? e.diploma_title,
        institutionName: e.institutionName ?? e.institution_name,
        description: e.description,
        startDate: e.startDate ?? e.start_date,
        endDate: (e.endDate ?? e.end_date) ?? undefined,
        diplomaImageUrl: e.diplomaImageUrl ?? e.diploma_image_url,
      }));

    return NextResponse.json(items, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des diplômes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}


