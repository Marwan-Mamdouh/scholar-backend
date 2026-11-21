import type { Metadata } from "next";
import ProjectDetails from "@/src/features/research/projects/ProjectDetails";

export const metadata: Metadata = { title: "Project details | NEXUS" };

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetails id={id} />;
}
