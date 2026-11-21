import type { Metadata } from "next";
import PublicationDetails from "@/src/features/research/publications/PublicationDetails";

export const metadata: Metadata = { title: "Publication details | NEXUS" };

export default async function PublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicationDetails id={id} />;
}
