import { ReactNode } from "react";
import Link from "next/link";
import { CardVariant, CardIntent } from "./card.type";
import getCardClasses, { getDescAndBtnClasses } from "./card.style";
import Button from "../Button/Button";
import getButtonClasses from "../Button/button.style";
import { Icon } from "@iconify/react";
import { ButtonIntent } from "../Button/button.type";
import { twMerge } from "tailwind-merge";

interface CardProps {
  variant?: CardVariant;
  intent?: CardIntent;
  btnIntent?: ButtonIntent;
  icon?: ReactNode;
  badge?: ReactNode;
  callToAction?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
  align?: "start" | "center" | "end";
  clickable?: boolean;
  href?: string;
  children?: ReactNode;
  size?: "default" | "compact";
}

const Card = ({
  intent = "primary",
  variant = "solid",
  btnIntent = intent,
  icon,
  badge,
  title = "card title",
  eyebrow,
  description,
  callToAction,
  className = "",
  align = "start",
  clickable = false,
  href,
  children,
  size = "default",
}: CardProps) => {
  const compact = size === "compact";
  const { descColor } = getDescAndBtnClasses(variant, intent);
  const arrow = <Icon className="h-full" icon="fe:arrow-right" />;

  const content = (
    <>
      {(icon || badge) && (
        <div className="flex items-center justify-between w-full">
          {icon && (
            <span className={compact ? "size-8 [&>svg]:size-8" : "w-17 h-17"}>
              {icon}
            </span>
          )}
          {badge && <span>{badge}</span>}
        </div>
      )}

      <div
        className={`min-w-0 w-full flex flex-col ${compact ? "gap-1.5" : "gap-2.5"}`}
      >
        {eyebrow && (
          <p className="line-clamp-2 text-sm leading-5 text-neutral-200">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2
            title={compact ? title : undefined}
            className={
              compact
                ? "line-clamp-3 min-h-18 text-lg leading-6 font-semibold text-primary-200 normal-case break-words"
                : "text-2xl capitalize text-neutral-50"
            }
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            className={
              compact
                ? "line-clamp-2 min-h-10 text-sm leading-5 text-neutral-200"
                : `${descColor} text-lg`
            }
          >
            {description}
          </p>
        )}
      </div>
      {children}
      {callToAction &&
        (href ? (
          <span
            className={getButtonClasses({
              variant: "link",
              intent: btnIntent,
              size: "lg",
            })}
          >
            {callToAction}
            <span className="transition-all ease-in-out duration-500 group-hover:ml-2">
              {arrow}
            </span>
          </span>
        ) : (
          <Button intent={btnIntent} variant="link" iconRight={arrow}>
            {callToAction}
          </Button>
        ))}
    </>
  );

  const cardClasses = twMerge(
    getCardClasses(variant, intent, align),
    compact ? "gap-3 px-5 py-5 text-sm leading-5" : "",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`group ${cardClasses} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div tabIndex={clickable ? 0 : undefined} className={cardClasses}>
      {content}
    </div>
  );
};

export default Card;
