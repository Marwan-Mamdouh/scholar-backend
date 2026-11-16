export const getAccordionClasses = (open: boolean) =>
  `rounded-xl overflow-hidden transition-all ease-in-out duration-500 px-6 py-4 bg-linear-to-b
  ${open ? " from-accent-300/30 to-transparent" : "from-accent-300/30 to-transparent h-fit"}`;

export const getHeaderClasses = () =>
  `flex items-center justify-between cursor-pointer select-none w-full`;

export const getBodyClasses = (open: boolean) =>
  `transition-all duration-500 ease-in-out overflow-hidden
${open ? "max-h-100 opacity-100 overflow-y-scroll " : "max-h-0 opacity-0"}`;

export const getAccordionIcon = (open: boolean) =>
  `transition-color duration-500 ease-in-out flex h-12.5 w-12.5 p-1 items-center justify-center rounded-xl
    ${open ? "bg-accent-300" : "bg-primary-300"}`;

export const getAccordionRightIcon = (open: boolean) =>
  `text-3xl ${open ? "text-accent-300" : "text-primary-300"}`;

export const getAccordionLine = (open: boolean) =>
  `absolute top-0 bottom-0 w-1 left-0 transition-color duration-500 ease-in-out
${open ? "bg-linear-to-b from-accent-200 to-[#085B53]" : "bg-primary-300"}`;
