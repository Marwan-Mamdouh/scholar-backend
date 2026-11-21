import type { Metadata } from "next";
import { JobsContainer } from "@/src/features/jobs";

export const metadata: Metadata = {
  title: "Jobs & Opportunities | NEXUS",
  description:
    "Discover jobs and internships across research, engineering, and industry.",
};

export default function JobsPage() {
  return <JobsContainer />;
}
