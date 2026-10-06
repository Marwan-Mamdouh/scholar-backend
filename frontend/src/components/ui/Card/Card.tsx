import { ReactNode } from "react";
import Link from "next/link";
import { CardVariant, CardIntent } from "./card.type";
import getCardClasses, { getDescAndBtnClasses } from "./card.style";
import Button from "../Button/Button";
import getButtonClasses from "../Button/button.style";
import { Icon } from "@iconify/react";
import { ButtonIntent } from "../Button/button.type";

interface CardProps {
  variant?: CardVariant;
  intent?: CardIntent;
  btnIntent?: ButtonIntent
  icon?: ReactNode;
  badge?: ReactNode;
  callToAction?: string;
  title?: string;
  description?: string;
  className?: string;
  align?: "start" | "center" | "end";
  clickable?: boolean;
  href?: string;
}


const Card = ({
  intent = "primary",
  variant = "solid",
  btnIntent = intent,
  icon,
  badge,
  title = "card title",
  description,
  callToAction,
  className = "",
  align = "start",
  clickable = false,
  href,
}: CardProps) => {
  const { descColor } = getDescAndBtnClasses(variant, intent);
  const arrow = <Icon className="h-full" icon="fe:arrow-right" />;

  const content = (
    <>
      {(icon || badge) && (
        <div className="flex items-center justify-between w-full">
          {icon && <span className="w-17 h-17">{icon}</span>}
          {badge && <span>{badge}</span>}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {title && (
          <h2 className="text-2xl capitalize text-neutral-50">{title}</h2>
        )}
        {description && <p className={`${descColor} text-lg`}>{description}</p>}
      </div>
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

  const cardClasses = `${getCardClasses(variant, intent, align)} ${className} `;

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
