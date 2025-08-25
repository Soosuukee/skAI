import { NextRequest, NextResponse } from 'next/server';
import { Language } from '@/app/types/language';
import spokenLanguages from '@/data/spokenLanguages.json';
import languages from '@/data/languages.json';

/**
 * GET /api/providers/id/[id]/languages
 * Récupère les langues d'un provider
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const providerId = parseInt(params.id);
    
    if (isNaN(providerId)) {
      return NextResponse.json(
        { error: 'ID de provider invalide' },
        { status: 400 }
      );
    }
    
    const providerLanguages = spokenLanguages.filter(sl => sl.provider_id === providerId);
    
    const languagesList = providerLanguages
      .map(sl => languages.find(lang => lang.languageId === sl.language_id))
      .filter((lang): lang is Language => lang !== undefined);
    
    return NextResponse.json(languagesList, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des langues:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
