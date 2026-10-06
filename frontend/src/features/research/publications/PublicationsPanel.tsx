import { connection } from "next/server";
import PublicationsExplorer from "./PublicationsExplorer";
import type { Paginated } from "@/src/lib/api-client";
import { fetchPublications } from "./publication.api";
import type { Publication } from "./publication.type";

export const PANEL_SHELL =
  "w-full bg-transparent border-2 border-accent-200 rounded-b-2xl rounded-tr-2xl p-6 min-h-100 flex flex-col gap-6 relative -mt-px";

const PublicationsPanel = async () => {
  // Fetch on every request, not once at build time
  await connection();

  let initialPage: Paginated<Publication> | undefined;
  let message = "";
  try {
    initialPage = await fetchPublications({ page: 1 });
  } catch (cause) {
    message =
      cause instanceof Error
        ? cause.message
        : "The publications service is unavailable.";
  }

  if (initialPage) {
    return (
      <div className={PANEL_SHELL}>
        <PublicationsExplorer initialPage={initialPage} />
      </div>
    );
  }

  return (
    <div className={PANEL_SHELL}>
      <div className="flex flex-1 flex-col items-center justify-center gap-2.5 py-20 text-center">
        <h3 className="text-2xl font-semibold text-danger-300">
          Publications Are Unavailable
        </h3>
        <p className="text-neutral-100 max-w-md">{message}</p>
        <p className="text-sm text-neutral-300">
          Reload the page once the service is reachable again.
        </p>
      </div>
    </div>
  );
};

export default PublicationsPanel;
