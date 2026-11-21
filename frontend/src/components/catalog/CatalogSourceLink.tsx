import { ExternalLink } from "lucide-react";
import { safeExternalUrl } from "./CatalogDetails";

export default function CatalogSourceLink({
  url,
  label,
  title,
}: {
  url: string | null;
  label: string;
  title: string;
}) {
  const href = safeExternalUrl(url);
  if (!href) return null;

  return (
    <a
      className="inline-flex items-center gap-1 self-start text-accent-300 hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} for ${title} (opens in a new tab)`}
    >
      {label}
      <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
    </a>
  );
}
