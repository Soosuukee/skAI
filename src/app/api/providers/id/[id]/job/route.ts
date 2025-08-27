import { NextRequest, NextResponse } from 'next/server';
import { Job } from '@/app/types/job';
import providerJobs from '@/data/providerJobs.json';
import jobs from '@/data/jobs.json';

/**
 * GET /api/providers/id/[id]/job
 * Récupère le job d'un provider
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
    
    const providerJob = providerJobs.find(pj => pj.provider_id === providerId);
    
    if (!providerJob) {
      return NextResponse.json(
        { error: 'Job non trouvé pour ce provider' },
        { status: 404 }
      );
    }
    
    const job = jobs.find(job => job.jobId === providerJob.job_id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(job, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du job:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
