import { Member } from "./about.type";
import LinkedinIcon from "@iconify-react/mdi/linkedin";

const formatLinkedIn = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

export default function TeamCard({ name, role, linkedIn }: Member) {
  return (
    <div className=" flex items-center justify-between  border-b-2 border-b-neutral-300 p-2.5">
      <div className="flex gap-2.5 items-center">
        {/* Avatar */}
        <div className="w-12.5 h-12.5 p-2.5 rounded-full bg-radial from-[#5ABDB4] from-20% via-[#43978F]via-40% to-[#085B53] to-70% relative shrink-0">
          <span className="absolute inset-0 flex items-center justify-center text-accent-200 font-semibold text-xl">
            {name.charAt(0).toUpperCase()}
            {name.charAt(1).toUpperCase()}
          </span>
        </div>
        {/* content */}
        <div>
          <h4 className="font-medium text-xl text-accent-200  capitalize">
            {name}
          </h4>
          {role ? (
            <p className="font-semibold text-accent-400 capitalize text-base">
              {role}
            </p>
          ) : null}
        </div>
      </div>
      {linkedIn ? (
        <a
          href={formatLinkedIn(linkedIn)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
        >
          <LinkedinIcon className="w-8 text-accent-200" />
        </a>
      ) : null}
    </div>
  );
}