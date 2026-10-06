"use client";

import { useEffect, useState } from "react";
import { fetchResearcher, fetchScholarProfile } from "../researcher.api";
import type { AcademicResearcher, ScholarProfile } from "../researcher.type";

export type ResearcherState =
  | { status: "loading" }
  | { status: "ready"; researcher: AcademicResearcher }
  | { status: "error"; message: string };

export type ScholarState =
  | { status: "loading" }
  | { status: "ready"; profile: ScholarProfile | null }
  | { status: "error"; message: string };

function errorMessage(cause: unknown, fallback: string): string {
  return cause instanceof Error && cause.message ? cause.message : fallback;
}

/**
 * Loads one researcher (DB row, then Semantic Scholar metrics/papers/co-authors).
 * Mount it under `key={id}` so switching researchers starts from fresh state.
 */
export function useResearcherProfile(id: number, initial?: AcademicResearcher) {
  const [researcher, setResearcher] = useState<ResearcherState>(
    initial ? { status: "ready", researcher: initial } : { status: "loading" },
  );
  const [scholar, setScholar] = useState<ScholarState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      let record = initial;
      if (!record) {
        try {
          record = await fetchResearcher(id, signal);
          setResearcher({ status: "ready", researcher: record });
        } catch (cause) {
          if (signal.aborted) return;
          setResearcher({
            status: "error",
            message: errorMessage(cause, "Couldn't load this researcher."),
          });
          return;
        }
      }

      try {
        const profile = await fetchScholarProfile(record, signal);
        setScholar({ status: "ready", profile });
      } catch (cause) {
        if (signal.aborted) return;
        setScholar({
          status: "error",
          message: errorMessage(cause, "Publication data is unavailable right now."),
        });
      }
    })();

    return () => controller.abort();
  }, [id, initial]);

  return { researcher, scholar };
}
