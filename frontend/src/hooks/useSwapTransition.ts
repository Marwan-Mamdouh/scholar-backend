"use client";

import { useEffect, useState } from "react";

/**
 * Delays swapping rendered content so the outgoing view can animate out.
 * While `leaving` is true keep showing `shown` with exit styles; after `exitMs`
 * it becomes `target`. Re-targeting mid-exit restarts the timer, so rapid
 * changes always settle on the latest value.
 */
export function useSwapTransition<T>(target: T, exitMs: number) {
  const [shown, setShown] = useState(target);
  const leaving = !Object.is(shown, target);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setShown(target), exitMs);
    return () => clearTimeout(timer);
  }, [leaving, target, exitMs]);

  return { shown, leaving };
}
