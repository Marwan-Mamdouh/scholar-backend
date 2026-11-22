"use client";

import { useEffect, useState, type ReactNode } from "react";
import Button from "@/src/components/ui/Button/Button";
import { api, type ApiResponse } from "@/src/lib/api-client";

export default function CatalogFacetLoader<T>({
  catalog,
  children,
}: {
  catalog: "jobs" | "researchers" | "projects" | "publications";
  children: (facets: T) => ReactNode;
}) {
  const [result, setResult] = useState<{ facets: T } | { error: true }>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get<ApiResponse<T>>(`/${catalog}/filters`, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setResult({ facets: data.data });
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ error: true });
      });
    return () => controller.abort();
  }, [catalog, attempt]);

  if (!result)
    return (
      <p role="status" className="text-sm text-neutral-300">
        Loading filters…
      </p>
    );
  if ("facets" in result) return children(result.facets);

  return (
    <div className="text-sm text-neutral-200">
      <p>Couldn’t load filter options.</p>
      <Button
        type="button"
        variant="link"
        intent="accent"
        onClick={() => {
          setResult(undefined);
          setAttempt((value) => value + 1);
        }}
      >
        Try again
      </Button>
    </div>
  );
}
