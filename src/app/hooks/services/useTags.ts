"use client";

import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/app/utils/api";

export interface TagDTO {
  id?: number;
  title: string;
  slug?: string;
}

const cache = new Map<string, { data: TagDTO[]; timestamp: number; ttl: number }>();
const TTL = 10 * 60 * 1000;

export function useTags() {
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const key = "tags";
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          setTags(cached.data);
          setLoading(false);
          return;
        }

        const api = getApiBaseUrl();
        const res = await fetch(`${api}/tags`);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const json = await res.json();
        const data: TagDTO[] = json.data || json || [];
        setTags(data);
        cache.set(key, { data, timestamp: Date.now(), ttl: TTL });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur lors du chargement des tags");
        setTags([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return { tags, loading, error };
}


