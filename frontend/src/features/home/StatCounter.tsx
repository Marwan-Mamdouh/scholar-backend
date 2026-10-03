"use client";

import useCountUp from "@/src/hooks/useCountUp";

interface StatCounterProps {
  value: string | null;
  label: string;
}

export default function StatCounter({
  value,
  label,
}: Readonly<StatCounterProps>) {
  const display = useCountUp(value);

  return (
    <div className="flex flex-col items-center gap-2.5 w-30 lg:w-33.25">
      <span className="font-[kanit] font-bold tracking-[0.05em] capitalize text-#FFFFFF text-[32px] leading-7.5 lg:text-[40px]">
        {display}
      </span>
      <span className="font-[kanit] font-medium tracking-[0.05em] capitalize text-neutral-100 text-[20px] leading-7.5 lg:text-[24px]">
        {label}
      </span>
    </div>
  );
}
