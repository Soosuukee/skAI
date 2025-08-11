import { useState, useEffect } from 'react';
import { Article } from '@/app/utils/articleUtils';

export interface Provider {
  id: number;
  slug: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  avatar: string;
  location: string;
  languages: string[];
}

export interface SocialLink {
  name: string;
  icon: string;
  link: string;
}

export interface ProviderAbout {
  intro: {
    display: boolean;
    title: string;
    description: string;
  };
  work: {
    display: boolean;
    title: string;
    experiences: Array<{
      company: string;
      timeframe: string;
      role: string;
      achievements: string[];
      images: Array<{
        src: string;
        alt: string;
        width: number;
        height: number;
      }>;
    }>;
  };
  studies: {
    display: boolean;
    title: string;
    institutions: Array<{
      degreeTitle: string;
      institutionName: string;
      yearsAttended: string;
      programDescription: string;
    }>;
  };
  technical: {
    display: boolean;
    title: string;
    skills: Array<{
      title: string;
      description: string;
      images: Array<{
        src: string;
        alt: string;
        width: number;
        height: number;
      }>;
    }>;
  };
}

export function useProvider(slug: string) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [social, setSocial] = useState<SocialLink[]>([]);
  const [about, setAbout] = useState<ProviderAbout | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviderData() {
      try {
        setLoading(true);
        setError(null);

        // Appels API séparés
        const [providerRes, socialRes, aboutRes, articlesRes] = await Promise.all([
          fetch(`/api/providers/${slug}`),
          fetch(`/api/providers/${slug}/social`),
          fetch(`/api/providers/${slug}/about`),
          fetch(`/api/providers/${slug}/articles`)
        ]);

        if (!providerRes.ok) {
          throw new Error('Provider not found');
        }

        const providerData = await providerRes.json();
        const socialData = await socialRes.json();
        const aboutData = await aboutRes.json();
        const articlesData = await articlesRes.json();

        setProvider(providerData);
        setSocial(socialData.social || []);
        setAbout(aboutData.about || null);
        setArticles(articlesData.articles || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProviderData();
    }
  }, [slug]);

  return { 
    provider, 
    social, 
    about, 
    articles, 
    loading, 
    error 
  };
}
