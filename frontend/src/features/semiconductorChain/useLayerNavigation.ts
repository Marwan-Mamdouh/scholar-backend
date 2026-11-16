"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LAYER, LAYER_DETAIL_ID, LAYER_HEADING_ID } from "./semiconductorChain.data";
import { LayerId } from "./semiconductorChain.type";

/**
 * Module scope, not a ref: the control that starts a change often unmounts on
 * arrival (no "next" on the last layer, no "previous" on the first). Left false
 * by back and forward, so those keep the browser's restored position.
 */
let pendingLayerChange = false;

export const consumePendingLayerChange = () => {
  const wasPending = pendingLayerChange;
  pendingLayerChange = false;
  return wasPending;
};

/** Layers differ in height by ~1,700px, so one selected from the bottom of the
 *  page lands entirely above the viewport. */
export const scrollToLayerDetail = () => {
  const detail = document.getElementById(LAYER_DETAIL_ID);
  if (!detail) return;

  const distance = Math.abs(detail.getBoundingClientRect().top);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  detail.scrollIntoView({
    // Jumps reach ~3,000px, which is slow to animate; smooth is for short hops.
    behavior: prefersReducedMotion || distance > window.innerHeight ? "auto" : "smooth",
    block: "start",
  });

  // Stops focus falling to <body> when the clicked link unmounts, and is what
  // announces the new layer.
  document.getElementById(LAYER_HEADING_ID)?.focus({ preventScroll: true });
};

/** Shared by the pyramid, the previous/next links and the chain-flow pills, so
 *  they agree on the history entry and where the reader lands. */
export default function useLayerNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (layer: LayerId) => {
      // No URL change means nothing would wake the anchor, so scroll directly.
      if (layer === (searchParams.get("layer") ?? DEFAULT_LAYER)) {
        scrollToLayerDetail();
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("layer", layer);
      pendingLayerChange = true;
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );
}
