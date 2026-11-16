import { avatarTone } from "./researcher.utils";

interface ResearcherAvatarProps {
  id: number;
  initials: string;
  size?: "sm" | "lg";
}

const SIZES = {
  sm: "size-10 text-sm",
  lg: "size-18 md:size-22 text-2xl md:text-3xl",
} as const;

const ResearcherAvatar = ({ id, initials, size = "sm" }: ResearcherAvatarProps) => (
  <span
    aria-hidden="true"
    className={`${SIZES[size]} ${avatarTone(id)} shrink-0 rounded-full flex items-center justify-center font-bold text-neutral-50 tracking-normal`}
  >
    {initials}
  </span>
);

export default ResearcherAvatar;
