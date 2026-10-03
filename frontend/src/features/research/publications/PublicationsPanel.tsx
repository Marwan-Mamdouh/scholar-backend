import PublicationsExplorer from "./PublicationsExplorer";
import { EMPTY_FILTERS } from "./publication.constants";
import {
  fetchDomains,
  fetchFilterRanges,
  fetchPublications,
} from "./publication.api";

export const PANEL_SHELL =
  "w-full bg-transparent border-2 border-accent-200 rounded-b-2xl rounded-tr-2xl p-6 min-h-100 flex flex-col gap-6 relative -mt-px";

const PublicationsPanel = async () => {
  try {
    const [domains, ranges, publications] = await Promise.all([
      fetchDomains(),
      fetchFilterRanges(),
      fetchPublications(EMPTY_FILTERS),
    ]);

    return (
      <div className={PANEL_SHELL}>
        <PublicationsExplorer
          domains={domains}
          ranges={ranges}
          initialPublications={publications}
        />
      </div>
    );
  } catch (cause) {
    const message =
      cause instanceof Error
        ? cause.message
        : "The publications service is unavailable.";

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
  }
};

export default PublicationsPanel;
