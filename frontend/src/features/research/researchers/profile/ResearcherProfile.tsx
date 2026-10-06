"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import ProfileHeader from "./ProfileHeader";
import { ProfileStats, ProfileStatsSkeleton } from "./ProfileStats";
import ProfileTabs, { type ProfileTabId } from "./ProfileTabs";
import PapersTab from "./PapersTab";
import CoAuthorsTab from "./CoAuthorsTab";
import AnalyticsTab from "./AnalyticsTab";
import ProfileEmptyState from "./ProfileEmptyState";
import { useResearcherProfile, type ScholarState } from "./useResearcherProfile";
import type { AcademicResearcher } from "../researcher.type";

interface ResearcherProfileProps {
  id: number;
  /** Row already loaded by the grid, so the header renders without a round trip */
  initialResearcher?: AcademicResearcher;
  onBack: () => void;
}

const CONTENT_PANEL = "rounded-2xl border border-neutral-500 bg-neutral-800/40 p-3 md:p-6";

function renderTab(tab: ProfileTabId, scholar: ScholarState) {
  if (scholar.status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-neutral-200" role="status">
        <Loader2 className="size-5 animate-spin text-accent-300" aria-hidden="true" />
        Loading publication data…
      </div>
    );
  }
  if (scholar.status === "error") {
    return (
      <ProfileEmptyState title="Publication data is unavailable">
        {scholar.message}
      </ProfileEmptyState>
    );
  }
  const { profile } = scholar;
  if (!profile) {
    return (
      <ProfileEmptyState title="No Semantic Scholar profile found">
        We couldn&apos;t match this researcher to a Semantic Scholar author yet.
      </ProfileEmptyState>
    );
  }

  switch (tab) {
    case "papers":
      return <PapersTab papers={profile.papers} />;
    case "coauthors":
      return <CoAuthorsTab coAuthors={profile.coAuthors} />;
    case "analytics":
      return <AnalyticsTab fields={profile.fields} stats={profile.stats} />;
  }
}

const ResearcherProfile = ({ id, initialResearcher, onBack }: ResearcherProfileProps) => {
  const { researcher, scholar } = useResearcherProfile(id, initialResearcher);
  const profile = scholar.status === "ready" ? scholar.profile : null;

  return (
    <div className="flex flex-col gap-8">
      <button
        type="button"
        onClick={onBack}
        className="self-start inline-flex items-center gap-2 rounded-full border border-neutral-500 bg-white/5 px-4 py-1.5 text-sm text-neutral-100 transition-colors duration-200 hover:border-primary-300 hover:text-primary-200 cursor-pointer"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to list
      </button>

      {researcher.status === "loading" && (
        <div className="flex items-center justify-center gap-2 py-24 text-neutral-200" role="status">
          <Loader2 className="size-5 animate-spin text-accent-300" aria-hidden="true" />
          Loading researcher…
        </div>
      )}

      {researcher.status === "error" && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <h2 className="text-2xl font-semibold text-danger-300">Researcher unavailable</h2>
          <p className="max-w-md text-neutral-100">{researcher.message}</p>
        </div>
      )}

      {researcher.status === "ready" && (
        <>
          <ProfileHeader researcher={researcher.researcher} scholar={profile}>
            {scholar.status === "loading" && <ProfileStatsSkeleton />}
            {profile && <ProfileStats stats={profile.stats} />}
          </ProfileHeader>

          <ProfileTabs
            renderPanel={(tab) =>
              // Analytics brings its own two sub-panels; everything else sits in one panel
              tab === "analytics" && profile ? (
                renderTab(tab, scholar)
              ) : (
                <div className={CONTENT_PANEL}>{renderTab(tab, scholar)}</div>
              )
            }
          />
        </>
      )}
    </div>
  );
};

export default ResearcherProfile;
