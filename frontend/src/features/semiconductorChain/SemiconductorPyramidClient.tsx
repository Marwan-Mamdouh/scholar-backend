"use client";

import SemiconductorPyramid from "./SemiconductorPyramid";
import useLayerNavigation from "./useLayerNavigation";
import { SEMICONDUCTOR_LAYERS } from "./semiconductorChain.data";
import { LayerId } from "./semiconductorChain.type";

interface SemiconductorPyramidClientProps {
  activeLayer: LayerId;
}

export default function SemiconductorPyramidClient({
  activeLayer,
}: Readonly<SemiconductorPyramidClientProps>) {
  const goToLayer = useLayerNavigation();

  return (
    <SemiconductorPyramid
      layers={SEMICONDUCTOR_LAYERS}
      activeLayer={activeLayer}
      onLayerChange={goToLayer}
    />
  );
}
