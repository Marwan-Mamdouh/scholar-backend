import { ReactNode } from "react";

interface ToolsContainerProps {
  children: ReactNode;
  className?: string;
}

const ToolsContainer = ({ children, className = "" }: ToolsContainerProps) => (
  <div className={`mx-auto w-full max-w-7xl px-4 md:px-8 ${className}`}>
    {children}
  </div>
);

export default ToolsContainer;
