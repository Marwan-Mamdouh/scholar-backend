import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/src/components/ui/Button/Button";

export default function CatalogPagination({
  label,
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: {
  label: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={label}
      className="flex flex-wrap items-center justify-center gap-4 border-t border-neutral-600 pt-6"
    >
      <Button
        variant="outlined"
        intent="accent"
        size="md"
        className="min-h-11"
        iconLeft={<ChevronLeft aria-hidden="true" className="size-4" />}
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-neutral-100">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outlined"
        intent="accent"
        size="md"
        className="min-h-11"
        iconRight={<ChevronRight aria-hidden="true" className="size-4" />}
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
