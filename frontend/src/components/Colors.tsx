import React from "react";

export default function Colors() {
  const colors = {
    primary: [
      { name: "100", class: "bg-primary-100" },
      { name: "200", class: "bg-primary-200" },
      { name: "300", class: "bg-primary-300" },
      { name: "400", class: "bg-primary-400" },
      { name: "500", class: "bg-primary-500" },
      { name: "600", class: "bg-primary-600" },
      { name: "700", class: "bg-primary-700" },
    ],
    Neutral: [
      { name: "50", class: "bg-neutral-50" },
      { name: "100", class: "bg-neutral-100" },
      { name: "200", class: "bg-neutral-200" },
      { name: "300", class: "bg-neutral-300" },
      { name: "400", class: "bg-neutral-400" },
      { name: "500", class: "bg-neutral-500" },
      { name: "600", class: "bg-neutral-600" },
      { name: "700", class: "bg-neutral-700" },
      { name: "800", class: "bg-neutral-800" },
      { name: "900", class: "bg-neutral-900" },
    ],
    accent: [
      { name: "100", class: "bg-accent-100" },
      { name: "200", class: "bg-accent-200" },
      { name: "300", class: "bg-accent-300" },
      { name: "400", class: "bg-accent-400" },
      { name: "600", class: "bg-accent-600" },
      { name: "700", class: "bg-accent-700" },
    ],
  };
  return (
    <div className="p-8 space-y-12 bg-background text-foreground">
      <h2 className="text-3xl font-bold mb-6">Project Theme Palette</h2>
      <h3 className="text-xl font-semibold capitalize mb-4">primary Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {colors.primary.map((item) => (
          <div key={item.name} className="flex flex-col gap-2">
            <div className={`h-20 w-full rounded ${item.class}`} />
            <span className="text-xs">Primary {item.name}</span>
          </div>
        ))}
      </div>
      <h3 className="text-xl font-semibold capitalize mb-4">Neutral Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {colors.Neutral.map((item) => (
          <div key={item.name} className="flex flex-col gap-2">
            <div className={`h-20 w-full rounded ${item.class}`} />
            <span className="text-xs">Neutral {item.name}</span>
          </div>
        ))}
      </div>
      <h3 className="text-xl font-semibold capitalize mb-4">accent Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {colors.accent.map((item) => (
          <div key={item.name} className="flex flex-col gap-2">
            <div className={`h-20 w-full rounded ${item.class}`} />
            <span className="text-xs">accent {item.name}</span>
          </div>
        ))}
      </div>
      {/* Special Colors Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Special Utilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-24 w-full rounded-lg border bg-primary-error" />
            <p className="text-sm font-medium">Primary Error</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-24 w-full rounded-lg border bg-white-surface" />
            <p className="text-sm font-medium">White Surface</p>
          </div>
        </div>
      </div>
    </div>
  );
}
