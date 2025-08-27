import { NextRequest, NextResponse } from 'next/server';
import { Experience } from '@/app/types/experience';
import providerExperiences from '@/data/providerExperiences.json';

/**
 * GET /api/providers/id/[id]/experiences
 * Récupère les expériences d'un provider
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

    const experiences: Experience[] = (providerExperiences as any[])
      .filter(exp => exp.providerId === providerId)
      .map(exp => ({
        experienceId: exp.experienceId,
        jobTitle: exp.jobTitle,
        companyName: exp.companyName,
        description: exp.description,
        task1: exp.task1,
        task2: exp.task2,
        startDate: exp.startDate,
        endDate: exp.endDate ?? undefined,
        experienceImage: exp.experienceImage
      }));

    return NextResponse.json(experiences, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des expériences:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}


