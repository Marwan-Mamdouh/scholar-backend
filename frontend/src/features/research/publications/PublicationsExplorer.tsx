"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import notFoundAnimation from "@/src/components/assets/NotFound.json";
import { Input } from "@/src/components/ui/InputField/Input";
import type { Paginated } from "@/src/lib/api-client";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import PublicationsTable from "./PublicationsTable";
import { fetchPublications } from "./publication.api";
import type { Publication } from "./publication.type";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// The backend currently supports search + pagination only. The richer filter UI
// (PublicationFilterBar) is kept for when GET /api/publications accepts filter params again.

interface PublicationsExplorerProps {
  initialPage: Paginated<Publication>;
}

type Status = "idle" | "loading" | "error";

const PAGE_BUTTON =
  "flex items-center gap-1 rounded-full border border-accent-400 px-4 py-1.5 text-sm text-accent-200 hover:bg-accent-400/10 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

const PublicationsExplorer = ({ initialPage }: PublicationsExplorerProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(initialPage);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const debouncedSearch = useDebouncedValue(search, 300);

  const queryKey = `${debouncedSearch.trim()}|${page}`;
  const loadedKeyRef = useRef(queryKey);

  useEffect(() => {
    if (loadedKeyRef.current === queryKey && reloadToken === 0) return;

    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetchPublications({ search: debouncedSearch, page }, controller.signal)
      .then((data) => {
        loadedKeyRef.current = queryKey;
        setResult(data);
        setStatus("idle");
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "Something went wrong loading publications.",
        );
        setStatus("error");
      });

    return () => controller.abort();
  }, [queryKey, debouncedSearch, page, reloadToken]);

  const publications = result.data ?? [];
  const { total, totalPages } = result.pagination;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full lg:w-75">
        <Input
          placeholder="Search by title, acronym or ISSN"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 min-h-6">
        <span className="text-sm text-neutral-300">
          {status === "loading"
            ? "Loading publications…"
            : `${total} publication${total === 1 ? "" : "s"}`}
        </span>
        {status === "loading" && (
          <Loader2
            className="size-4 animate-spin text-accent-300"
            aria-hidden="true"
          />
        )}
      </div>

      {status === "error" ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <h3 className="text-xl font-semibold text-danger-300">
            Couldn&apos;t load publications
          </h3>
          <p className="text-neutral-100 max-w-md">{error}</p>
          <button
            type="button"
            onClick={() => setReloadToken((token) => token + 1)}
            className="mt-1 rounded-full border border-accent-400 px-5 py-2 text-sm text-accent-200 hover:bg-accent-400/10 cursor-pointer transition-colors"
          >
            Try again
          </button>
        </div>
      ) : publications.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2.5 pt-10.5 pb-16">
          <Lottie
            animationData={notFoundAnimation}
            loop
            className="w-64 mx-auto"
          />
          <h3 className="text-2xl font-semibold text-accent-300">
            No Publications Found
          </h3>
          <p className="text-neutral-100">
            Try a different title, acronym or ISSN.
          </p>
        </div>
      ) : (
        <div
          className={`flex flex-col gap-4 transition-opacity duration-300 ${status === "loading" ? "opacity-60" : "opacity-100"}`}
        >
          <PublicationsTable publications={publications} />

          {totalPages > 1 && (
            <nav
              aria-label="Publications pages"
              className="flex items-center justify-center gap-4"
            >
              <button
                type="button"
                className={PAGE_BUTTON}
                disabled={page <= 1 || status === "loading"}
                onClick={() => setPage((current) => current - 1)}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Previous
              </button>
              <span className="text-sm text-neutral-300">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className={PAGE_BUTTON}
                disabled={page >= totalPages || status === "loading"}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicationsExplorer;
