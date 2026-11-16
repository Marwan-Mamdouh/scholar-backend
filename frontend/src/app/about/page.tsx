import { connection } from "next/server";
import { fetchTeams } from "@/src/features/about/about.api";
import type { TeamsData } from "@/src/features/about/about.type";
import AboutTitle from "@/src/features/about/AboutTitle";
import Contact from "@/src/features/about/Contact";
import MeetOurTeam from "@/src/features/about/MeetOurTeam";
import Pillars from "@/src/features/about/Pillars";
import WhyNexus from "@/src/features/about/WhyNexus";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | NEXUS",
  description:
    "Meet the researchers, developers, and industry experts building a connected academic ecosystem.",
};

async function loadTeams(): Promise<TeamsData | null> {
  // Fetch on every request, not once at build time
  await connection();
  try {
    return await fetchTeams();
  } catch (cause) {
    console.error("Failed to load teams:", cause);
    return null;
  }
}

export default async function AboutPage() {
  const teams = await loadTeams();

  return (
    <main className="max-w-7xl mx-auto px-5 font-main tracking-display space-y-14 md:space-y-16 lg:space-y-20 pt-26 pb-14 lg:py-21.5">
      <AboutTitle />
      <Pillars />
      <WhyNexus />
      <MeetOurTeam teams={teams} />
      <Contact />
    </main>
  );
}
