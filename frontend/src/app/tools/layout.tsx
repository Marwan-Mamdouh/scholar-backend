import { ReactNode } from "react";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-full flex-1 pb-25 font-main">{children}</main>
  );
}
