"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LAYER } from "./semiconductorChain.data";
import { consumePendingLayerChange, scrollToLayerDetail } from "./useLayerNavigation";

/** Brings the newly selected layer into view. Lives in the container, so it
 *  outlives the links that come and go at the ends of the chain. */
export default function LayerScrollAnchor() {
  const searchParams = useSearchParams();
  const activeLayer = searchParams.get("layer") ?? DEFAULT_LAYER;

  useEffect(() => {
    if (!consumePendingLayerChange()) return;

    // Called straight out of the effect: effects already run after layout, and
    // a backgrounded tab never fires requestAnimationFrame.
    scrollToLayerDetail();
  }, [activeLayer]);

  return null;
}
