import { TeamsData } from "@/src/features/about/about.type";
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

const teams: TeamsData ={
  meta:{
    teamCount:3,
    memberCount:17
  },
  data:[
    {
      title:"web app team",
      count:6,
      members: [
        {
          id: "1",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "2",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "3",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "4",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "5",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "6",
          name: "heba",
          role: "web",
          linkedIn: "",
        },
      ]
    },
    {
      title:"Academia team",
      count: 4,
      members: [
        {
          id: "1",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "2",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "3",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "4",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
      ]
    },
    {
      title:"Industry Team",
      count: 7,
      members: [
        {
          id: "1",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "2",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "3",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "4",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "5",
          name: "heba",
          role: "web",
          linkedIn: "linkedIn.com",
        },
        {
          id: "6",
          name: "heba",
          role: "web",
          linkedIn: "",
        },
        {
          id: "7",
          name: "heba",
          role: "",
        },
      ]
    },
  ]
}

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-5 font-main tracking-display space-y-14 md:space-y-16 lg:space-y-20 pt-26 pb-14 lg:py-21.5">
      <AboutTitle />
      <Pillars />
      <WhyNexus />
      <MeetOurTeam teams={teams}/>
      <Contact />
    </main>
  );
}
