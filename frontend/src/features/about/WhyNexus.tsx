"use client";
import UnlockIcon from "@iconify-react/lucide/unlock";
import IbmWatsonDiscoveryIcon from "@iconify-react/carbon/ibm-watson-discovery";
import CollaborationTeamChatIcon from "@iconify-react/streamline-freehand/collaboration-team-chat";
import IdeaIcon from "@iconify-react/icons8/idea";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Feature } from "./about.type";

const features: Feature[] = [
  {
    icon: UnlockIcon,
    title: "Unlock Opportunities",
    description: "Connect students and graduates with real career pathways.",
  },
  {
    icon: IbmWatsonDiscoveryIcon,
    title: "Accelerate Discovery",
    description: "Help researchers find papers, mentors, and insights faster.",
  },
  {
    icon: CollaborationTeamChatIcon,
    title: "Enable Collaboration",
    description: "Bring academia and industry together in one space.",
  },
  {
    icon: IdeaIcon,
    title: "Create Impact",
    description: "Turn ideas, talent, and research into real-world value.",
  },
];

export default function WhyNexus() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-2">
      <div className="w-full lg:w-1/2">
        <DotLottieReact
          src="https://lottie.host/dfe4cfa0-0e01-4eac-a0c8-753707905f4f/Wn5mxvk8Xd.lottie"
          loop
          autoplay
          className="relative w-full aspect-[22/9] lg:w-220 lg:h-90 lg:-left-1/4"
        />
      </div>
      <div className="space-y-4 lg:w-[60%]">
        {/* Heading */}
        <div className=" text-center lg:text-start">
          <h2 className=" text-4xl lg:text-5xl capitalize font-semibold  leading-10 text-neutral-50 mb-2">
            Why Nexus <span className="text-accent-400">Matters</span>
          </h2>
          <p className="text-neutral-100 text-lg max-w-2xl mx-auto ">
            Modern talent and research deserve better visibility, smarter tools,
            and stronger connections.
          </p>
        </div>
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div key={index} className="col-span-1 ">
                <div className="mt-1 shrink-0 flex items-center gap-1">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-accent-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-medium text-primary-100">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-neutral-50 text-lg leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}