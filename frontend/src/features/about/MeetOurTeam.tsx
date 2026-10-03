"use client";
import Accordion from "@/src/components/ui/accordion/Accordion";
import Button from "@/src/components/ui/Button/Button";
import CodeIcon from "@iconify-react/tabler/code";
import BookOutlineIcon from "@iconify-react/basil/book-outline";
import IndustryIcon from "@iconify-react/cil/industry";
import AccountGroupIcon from "@iconify-react/mdi/account-group";
import TeamCard from "./TeamCard";
import { MeetOurTeamProps } from "./about.type";
import { ComponentType } from "react";

const teamsIcon: ComponentType<{ className?: string }>[] = [
  CodeIcon,
  BookOutlineIcon,
  IndustryIcon,
];

export default function MeetOurTeam({ teams }: MeetOurTeamProps) {
  return (
    <section>
      {/* header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 py-8">
        <div className="text-center lg:text-start">
          <span className="font-normal text-base leading-5 capitalize text-accent-300">
            The people behind it
          </span>
          <h2 className=" text-4xl lg:text-5xl capitalize font-semibold  leading-10 text-neutral-50 mb-4">
            Meet our <span className="text-accent-400">teams</span>
          </h2>
          <p className="text-neutral-100 text-lg lg:max-w-xl">
            Three specialized teams. One shared mission — bridging academia,
            industry, and the web.
          </p>
        </div>
        <div className="text-center grid grid-cols-2 gap-5">
          <div className="border border-accent-300 rounded-xl p-2.5 bg-linear-to-b from-primary-300/30 to-accent-400/10">
            <p className="text-3xl sm:text-[32px] text-neutral-50 font-normal ">
              {teams.meta.teamCount}
            </p>
            <p className="text-xl sm:text-2xl text-accent-300 font-normal capitalize">
              Teams
            </p>
          </div>
          <div className="border border-accent-300 rounded-xl p-2.5 bg-linear-to-b from-primary-300/30 to-accent-400/10">
            <p className="text-3xl sm:text-[32px] text-neutral-50 font-normal ">
              {teams.meta.memberCount}
            </p>
            <p className="text-xl sm:text-2xl text-accent-300 font-normal capitalize">
              Members
            </p>
          </div>
          <div className="col-span-2">
            <Button
              variant="outlined"
              intent="accent"
              disabled
              size="2xl"
              className="w-full"
            >
              Join the Team
            </Button>
          </div>
        </div>
      </div>
      {/* tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 ">
        {teams.data.map((team, index) => {
          const teamIcon = teamsIcon[index] ?? AccountGroupIcon;
          return (
            <Accordion
              key={index}
              title={team.title}
              subtitle={`${team.count} members`}
              icon={teamIcon}
              defaultOpen={false}
            >
              <div className="space-y-4">
                {team.members.map((member) => (
                  <TeamCard key={member.id} {...member} />
                ))}
              </div>
            </Accordion>
          );
        })}
      </div>
    </section>
  );
}