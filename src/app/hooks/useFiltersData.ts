"use client";

import { useEffect, useState } from "react";
import { getLanguages } from "@/app/utils/languages";
import { getJobs } from "@/app/utils/jobs";
import { getCountries } from "@/app/utils/countries";
import type { Language } from "@/app/types/language";
import type { Job } from "@/app/types/job";
import type { Country } from "@/app/types/country";

type FetchState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
};


export function useFiltersData() {
  const [languages, setLanguages] = useState<FetchState<Language>>({
    data: [],
    loading: true,
    error: null,
  });
  const [jobs, setJobs] = useState<FetchState<Job>>({
    data: [],
    loading: true,
    error: null,
  });
  const [countries, setCountries] = useState<FetchState<Country>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [langs, js, cs] = await Promise.all([
          getLanguages(),
          getJobs(),
          getCountries(),
        ]);
        setLanguages({ data: langs, loading: false, error: null });
        setJobs({ data: js, loading: false, error: null });
        setCountries({ data: cs, loading: false, error: null });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Erreur lors du chargement";
        setLanguages((s) => ({ ...s, loading: false, error: msg }));
        setJobs((s) => ({ ...s, loading: false, error: msg }));
        setCountries((s) => ({ ...s, loading: false, error: msg }));
      }
    };

    load();
  }, []);

  return {
    languages: languages.data,
    languagesLoading: languages.loading,
    languagesError: languages.error,
    jobs: jobs.data,
    jobsLoading: jobs.loading,
    jobsError: jobs.error,
    countries: countries.data,
    countriesLoading: countries.loading,
    countriesError: countries.error,
  };
}


