import { AudioWaveform, Container, Cpu, Wrench } from "lucide-react";
import { HubPage } from "../tools.type";

const iconClass = "h-11 w-11";

const hub: HubPage = {
  meta: {
    title: "Open-Source Silicon Toolchain Hub",
    description:
      "Curated indexes for digital and analog IC design, general infrastructure utilities, and environment setup — all open source.",
  },
  hero: {
    eyebrow: "NEXUS Ecosystem",
    title: (
      <>
        The Open-Source Silicon
        <br />
        <em>toolchain hub</em>.
      </>
    ),
    body: "Your central gateway to comprehensive, community-driven workflows. Explore curated indexes for Digital and Analog design, general infrastructure utilities, and seamless environment setup.",
    stats: [
      { value: "3", label: "Core Domains" },
      { value: "1", label: "Unified Flow" },
      { value: "$0", label: "Licensing Cost" },
      { value: "100%", label: "Open Source" },
    ],
  },
  section: {
    label: "Select your path",
    title: "Ecosystem Navigation",
    subtitle:
      "Choose a discipline below to explore interactive toolchain flows, comprehensive catalogs, and detailed usage documentation.",
  },
  cards: [
    {
      href: "/tools/digital-ic",
      icon: <Cpu className={iconClass} />,
      title: "Digital IC Tools",
      desc: "Explore complete RTL-to-GDS pipelines, including synthesis, place & route, static timing analysis, and functional verification tools.",
      cta: "Enter Digital Flow",
      intent: "primary",
    },
    {
      href: "/tools/analog-ic",
      icon: <AudioWaveform className={iconClass} />,
      title: "Analog IC Tools",
      desc: "Dive into analog design environments featuring schematic capture, SPICE simulation, custom layout, and parasitic extraction.",
      cta: "Enter Analog Flow",
      intent: "accent",
    },
    {
      href: "/tools/general-ic",
      icon: <Wrench className={iconClass} />,
      title: "General & Infra",
      desc: "The essential glue of the toolchain: package managers, format converters, PDK management, and system-level design generators.",
      cta: "View Infrastructure",
      intent: "primary",
    },
    {
      href: "/tools/environment-setup",
      icon: <Container className={iconClass} />,
      title: "Environment Setup",
      desc: "Get started instantly. A step-by-step professional guide to installing Docker and launching your pre-configured OSIC environment.",
      cta: "Start Installation",
      intent: "accent",
    },
  ],
};

export default hub;
