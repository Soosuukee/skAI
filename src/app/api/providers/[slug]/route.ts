import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/providers.json';

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

    // Retourner seulement les données de base du provider
    return NextResponse.json({
      id: provider.id,
      slug: provider.slug,
      firstName: provider.firstName,
      lastName: provider.lastName,
      role: provider.role,
      email: provider.email,
      avatar: provider.avatar,
      location: provider.location,
      languages: provider.languages
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
