import { JobDetails } from "@/src/features/jobs";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetails id={id} />;
}
