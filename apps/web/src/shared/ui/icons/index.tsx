import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const Svg = ({ size = 22, children, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const BagIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const MenuIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </Svg>
);

export const CloseIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const ArrowIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);

export const ChevronIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const PlusIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M5 12h14" />
  </Svg>
);

export const TelegramIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15Z" />
    <path d="m9 13 8-6" />
  </Svg>
);

export const VkIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M3 7c1 6 4 10 9 10v-4c2 0 3.5 2 4.5 4H20c-1-3-3-5-4.5-5.5C17 10.5 19 8.5 19.5 7h-3c-.5 2-2.5 4-4.5 4.5V7H9v7C7 13 5.5 10 5.5 7H3Z" />
  </Svg>
);

export const YoutubeIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect x="3" y="6" width="18" height="12" rx="3" />
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" />
  </Svg>
);

export const LinkIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
  </Svg>
);
