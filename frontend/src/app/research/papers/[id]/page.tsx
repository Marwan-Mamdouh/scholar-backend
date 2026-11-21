import type { Metadata } from "next";
import PaperDetails from "@/src/features/research/papers/PaperDetails";

export const metadata: Metadata = { title: "Paper details | NEXUS" };

export default async function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PaperDetails id={id} />;
}
