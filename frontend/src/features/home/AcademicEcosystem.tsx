"use client";

import Card from "@/src/components/ui/Card/Card";
import LightingGlow from "@/src/components/ui/LightingGlow/LightingGlow";
import GlobeIcon from "@iconify-react/lucide/globe";

const cards1 = [
  {
    title: "Meet the researchers",
    description:
      "Discover academic experts, research interests, and university connections.",
    cardAction: "View researchers",
    href: "/research?tab=researchers",
  },
  {
    title: "Find where to publish",
    description:
      "Compare journals by research area, access model, metrics, and publication fees.",
    cardAction: "Compare publications",
    href: "/research?tab=publications",
  },
];
const cards2 = [
  {
    title: "Explore academic papers",
    description:
      "Browse studies in semiconductor design, embedded systems, and applied research.",
    cardAction: "Explore papers",
    href: "/research?tab=papers",
  },
  {
    title: "Discover graduation projects",
    description:
      "See student ideas, academic supervisors, and industry-supported projects.",
    cardAction: "Browse projects",
    href: "/research?tab=projects",
  },
];

const acadicCardsClassName =
  "flex-1 flex-col w-full items-start lg:max-w-126.25 p-5!";

const AcademicEcosystem = () => {
  return (
    <div className="flex flex-col gap-2.5 px-2.5">
      {/* globe icon for mobile */}
      <div className="block lg:hidden">
        <GlobeIcon
          height="5em"
          className="globe-animation relative top-1/2 left-1/2 transform -translate-x-1/2"
        />
      </div>
      {/* text content - title and description */}
      <div className="flex flex-col items-center justify-center text-center mx-auto w-full max-w-90 lg:max-w-194.75 p-2.5 gap-2.5">
        <p className="font-main font-bold capitalize text-h2-sm lg:text-h1-sm tracking-display">
          Explore the Academic Ecosystem
        </p>
        <p className="font-main text-body tracking-eyebrow text-accent-400">
          access researchers, papers, and graduation projects — all in one place
        </p>
      </div>
      {/* cards container */}
      <div className="relative flex flex-col gap-2.5 lg:gap-16.5 mx-auto w-full max-w-311.25 lg:my-15 px-2.5">
        {/* lighting glow for mobile - first one - primary */}
        <div className="block absolute top-[-7%] right-[48%] w-73.5 h-54 lg:hidden">
          <LightingGlow variant="primary" className="blur-[150px]" />
        </div>
        {/* lighting glow for mobile - second one - accent */}
        <div className="block absolute bottom-[7%] left-[55%] w-73.5 h-54 lg:hidden">
          <LightingGlow variant="accent" className="blur-[150px]" />
        </div>
        {/* first set of cards */}
        <div className="flex flex-col lg:flex-row justify-between mx-auto w-full gap-2.5">
          {cards1.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              callToAction={card.cardAction}
              href={card.href}
              intent="primary"
              btnIntent="accent"
              className={acadicCardsClassName}
            />
          ))}
        </div>
        {/* globe icon and lighting glow  for desktop */}
        <div className="hidden lg:block mx-auto md:absolute md:bottom-[25%] md:left-[38.05%] w-73.5 h-54">
          <LightingGlow variant="accent" className="blur-[150px]" />
          <GlobeIcon
            height="8em"
            className="globe-animation absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        {/* second set of cards */}
        <div className="flex flex-col lg:flex-row justify-between mx-auto w-full gap-2.5">
          {cards2.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              callToAction={card.cardAction}
              href={card.href}
              intent="primary"
              btnIntent="accent"
              className={acadicCardsClassName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicEcosystem;
