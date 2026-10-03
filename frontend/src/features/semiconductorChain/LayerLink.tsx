"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import useLayerNavigation from "./useLayerNavigation";
import { LayerId } from "./semiconductorChain.type";

interface LayerLinkProps {
  layer: LayerId;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

/** A real anchor, so middle-click and new-tab keep working; onNavigate fires
 *  only for plain in-page clicks, which is the case we take over. */
const LayerLink: FC<LayerLinkProps> = ({ layer, className, ariaLabel, children }) => {
  const goToLayer = useLayerNavigation();

  return (
    <Link
      href={`/semiconductor-chain?layer=${layer}`}
      scroll={false}
      aria-label={ariaLabel}
      className={className}
      onNavigate={(event) => {
        event.preventDefault();
        goToLayer(layer);
      }}
    >
      {children}
    </Link>
  );
};

export default LayerLink;
