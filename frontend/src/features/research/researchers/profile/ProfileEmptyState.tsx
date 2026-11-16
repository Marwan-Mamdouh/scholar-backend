import type { ReactNode } from "react";

interface ProfileEmptyStateProps {
  title: string;
  children?: ReactNode;
}

const ProfileEmptyState = ({ title, children }: ProfileEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
    <p className="text-lg font-semibold text-accent-300">{title}</p>
    {children && <p className="max-w-md text-sm text-neutral-200">{children}</p>}
  </div>
);

export default ProfileEmptyState;
