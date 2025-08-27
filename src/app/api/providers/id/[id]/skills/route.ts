import { NextRequest, NextResponse } from 'next/server';
import providerSkills from '@/data/providerSkills.json';
import skills from '@/data/skills.json';
import { Skill } from '@/app/types/skill';

interface ProviderSkillResolved extends Skill {
  yearsOfExperience?: number;
  certified?: boolean;
  certificationDate?: string;
}

/**
 * GET /api/providers/id/[id]/skills
 * Récupère les compétences d'un provider (jointure providerSkills + skills)
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

    const providerSkillRows = (providerSkills as any[]).filter(
      (ps) => ps.providerId === providerId
    );

    const resolved: ProviderSkillResolved[] = providerSkillRows
      .map((ps) => {
        const skill = (skills as any[]).find((s) => (s.skillId ?? s.skill_id) === ps.skillId);
        if (!skill) return undefined;
        return {
          skillId: skill.skillId ?? skill.skill_id,
          name: skill.name,
          yearsOfExperience: ps.yearsOfExperience,
          certified: ps.certified,
          certificationDate: ps.certificationDate ?? undefined,
        } as ProviderSkillResolved;
      })
      .filter((v): v is ProviderSkillResolved => Boolean(v));

    return NextResponse.json(resolved, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}


