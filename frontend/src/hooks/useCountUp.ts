"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 3500;

const parseValue = (value: string) => {
  const match = /^(\D*?)([\d.]+)(.*)$/.exec(value);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const target = Number.parseFloat(digits);

  return Number.isNaN(target) ? null : { prefix, target, suffix };
};

export default function useCountUp(
  value: string | null,
  duration = DEFAULT_DURATION,
): string {
  const parsed = value === null ? null : parseValue(value);
  const prefix = parsed?.prefix;
  const target = parsed?.target;
  const suffix = parsed?.suffix;

  const [display, setDisplay] = useState(() =>
    parsed ? `${parsed.prefix}0${parsed.suffix}` : (value ?? "-"),
  );
  const frameRef = useRef<number>(null);

  useEffect(() => {
    if (target === undefined) {
      setDisplay(value ?? "-");
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${prefix}${Math.floor(eased * target)}${suffix}`);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [prefix, target, suffix, value, duration]);

  return display;
}
