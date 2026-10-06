import { ReactNode } from "react";

export const CodeBlock = ({ children }: { children: ReactNode }) => (
  <pre className="mt-3 overflow-x-auto rounded-xl border border-neutral-700 bg-neutral-900/70 px-4 py-3 font-mono text-sm leading-relaxed text-accent-200">
    <code>{children}</code>
  </pre>
);

export const InlineCode = ({
  children,
  highlight = false,
}: {
  children: ReactNode;
  highlight?: boolean;
}) => (
  <code
    className={`rounded-md px-1.5 py-0.5 font-mono text-[0.9em] ${
      highlight
        ? "bg-accent-600/40 text-accent-100"
        : "bg-neutral-700/60 text-neutral-50"
    }`}
  >
    {children}
  </code>
);

export const NoteBlock = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="mt-4 rounded-2xl border-l-4 border-primary-400 bg-neutral-800/40 px-4 py-3.5">
    <p className="font-main font-semibold text-primary-200">{title}</p>
    <div className="mt-2 flex flex-col gap-2 text-neutral-100">{children}</div>
  </div>
);

export const GuideList = ({ items }: { items: ReactNode[] }) => (
  <ul className="flex flex-col gap-1.5">
    {items.map((item, index) => (
      <li key={index} className="flex items-center gap-2.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-400" />
        {item}
      </li>
    ))}
  </ul>
);

export const GuideLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="text-primary-300 underline underline-offset-4 transition-colors duration-300 hover:text-primary-200"
  >
    {children}
  </a>
);
