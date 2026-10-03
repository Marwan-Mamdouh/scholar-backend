import type { Metadata } from "next";
import SemiconductorChainContainer from "@/src/features/semiconductorChain/SemiconductorChainContainer";
import { DEFAULT_LAYER, isLayerId } from "@/src/features/semiconductorChain/semiconductorChain.data";

export const metadata: Metadata = {
  title: "The Semiconductor Supply Chain | NEXUS",
  description:
    "A layer-by-layer guide to the semiconductor value chain — from chip design and IP, through fab equipment and foundries, down to materials, packaging and the devices people actually buy.",
};

export default async function SemiconductorChainPage(
  props: Readonly<{
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }>,
) {
  const searchParams = await props.searchParams;
  const layer = searchParams?.layer;
  const activeLayer = isLayerId(layer) ? layer : DEFAULT_LAYER;

  return (
    <main className="flex-1 w-full flex flex-col items-end relative overflow-hidden pt-10 font-main">
      {/* Hero Section */}
      <section className="w-full pt-26 px-4 flex flex-col items-center text-center gap-2">
        <h1 className="text-4xl md:text-h1-sm font-bold text-neutral-50 tracking-eyebrow">
          The Semiconductor Supply Chain
        </h1>
        <p className="text-neutral-50 text-lg max-w-3xl">
          Every chip travels the same path: an idea at the top, a finished device at the bottom.
          Select a layer of the pyramid to see who works there, who they sell to, and how they
          depend on the layer above.
        </p>
      </section>

      {/* Main Interactive Section */}
      <SemiconductorChainContainer activeLayer={activeLayer} />
    </main>
  );
}
