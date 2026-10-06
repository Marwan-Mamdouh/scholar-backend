import type { ReactNode } from "react";
import { BookOpen, GraduationCap, Landmark, Tag } from "lucide-react";
import getButtonClasses from "@/src/components/ui/Button/button.style";
import ResearcherAvatar from "../ResearcherAvatar";
import type { AcademicResearcher, ScholarProfile } from "../researcher.type";
import {
  fullName,
  getInitials,
  googleScholarUrl,
  hasValue,
  semanticScholarUrl,
  toTopicList,
} from "../researcher.utils";

interface ProfileHeaderProps {
  researcher: AcademicResearcher;
  scholar: ScholarProfile | null | undefined;
  /** Stats row (or its skeleton) rendered inside the header panel */
  children?: ReactNode;
}

export const PROFILE_NAME_ID = "researcher-profile-name";

const ProfileHeader = ({ researcher, scholar, children }: ProfileHeaderProps) => {
  const name = fullName(researcher);
  const institution = [researcher.institutionName, researcher.affiliation].find(hasValue);
  const field = hasValue(researcher.mainTopic)
    ? researcher.mainTopic.trim()
    : scholar?.primaryField;
  const interests = toTopicList(researcher.subtopics).filter(
    (topic) => topic.toLowerCase() !== field?.toLowerCase(),
  );

  return (
    <section
      aria-labelledby={PROFILE_NAME_ID}
      className="relative overflow-hidden rounded-2xl border border-neutral-500 bg-neutral-800/60 p-5 md:p-8 flex flex-col gap-8"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-5 md:gap-7 min-w-0">
          <ResearcherAvatar id={researcher.id} initials={getInitials(name)} size="lg" />
          <div className="flex min-w-0 flex-col gap-2">
            <h2
              id={PROFILE_NAME_ID}
              className="text-3xl md:text-4xl font-bold text-primary-100 wrap-break-word"
            >
              {name}
            </h2>
            <p className="flex items-center gap-2 text-neutral-200">
              <Landmark className="size-4 shrink-0" aria-label="Institution" />
              {institution?.trim() ?? "Unknown Institution"}
            </p>
            {field && <p className="text-accent-300">{field}</p>}
            {interests.length > 0 && (
              <p className="flex items-start gap-2 text-sm text-neutral-100">
                <Tag className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="text-neutral-200">Interests: </span>
                  {interests.join(" / ")}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 lg:shrink-0">
          <a
            href={googleScholarUrl(researcher)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${getButtonClasses({ variant: "solid", intent: "primary", size: "md" })} rounded-full! px-4 hover:bg-primary-400`}
          >
            <GraduationCap className="size-4" aria-hidden="true" />
            <span className="ml-1.5">Google Scholar</span>
          </a>
          <a
            href={semanticScholarUrl(researcher, scholar)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${getButtonClasses({ variant: "outlined", intent: "accent", size: "md" })} rounded-full! px-4`}
          >
            <BookOpen className="size-4" aria-hidden="true" />
            <span className="ml-1.5">Semantic Scholar</span>
          </a>
        </div>
      </div>

      {children}
    </section>
  );
};

export default ProfileHeader;
