import { type ReactNode } from "react";

import { cn } from "@/shared/utils/style";

type AppBadgeTone = "atisCyan" | "blue" | "gray" | "red" | "teal";
type AppBadgeVariant = "light" | "outline" | "solid" | "white";
type AppBadgeSize = "xs" | "sm" | "md" | "lg";

type AppBadgeProps = {
  children: ReactNode;
  className?: string;
  size?: AppBadgeSize;
  tone?: AppBadgeTone;
  variant?: AppBadgeVariant;
};

const sizeClassNames: Record<AppBadgeSize, string> = {
  xs: "min-h-5 px-2 py-0.5 text-badge-xs",
  sm: "min-h-6 px-2.5 py-1 text-xs",
  md: "min-h-7 px-3 py-1 text-sm",
  lg: "min-h-8 px-3.5 py-1.5 text-sm",
};

const toneClassNames: Record<AppBadgeTone, Record<AppBadgeVariant, string>> = {
  atisCyan: {
    light: "bg-atisCyan-50 text-atisCyan-700 ring-atisCyan-100",
    outline: "bg-white text-atisCyan-700 ring-atisCyan-300",
    solid: "bg-atisCyan-500 text-white ring-atisCyan-500",
    white: "bg-white text-atisCyan-700 ring-white",
  },
  blue: {
    light: "bg-blue-50 text-blue-700 ring-blue-100",
    outline: "bg-white text-blue-700 ring-blue-300",
    solid: "bg-blue-600 text-white ring-blue-600",
    white: "bg-white text-blue-700 ring-white",
  },
  gray: {
    light: "bg-slate-100 text-slate-700 ring-slate-200",
    outline: "bg-white text-slate-600 ring-slate-300",
    solid: "bg-slate-700 text-white ring-slate-700",
    white: "bg-white text-slate-700 ring-white",
  },
  red: {
    light: "bg-red-50 text-red-700 ring-red-100",
    outline: "bg-white text-red-700 ring-red-300",
    solid: "bg-red-600 text-white ring-red-600",
    white: "bg-white text-red-700 ring-white",
  },
  teal: {
    light: "bg-teal-50 text-teal-700 ring-teal-100",
    outline: "bg-white text-teal-700 ring-teal-300",
    solid: "bg-teal-600 text-white ring-teal-600",
    white: "bg-white text-teal-700 ring-white",
  },
};

export function AppBadge({ children, className, size = "sm", tone = "atisCyan", variant = "light" }: AppBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-none shrink-0 items-center justify-center rounded-full align-middle leading-none font-bold whitespace-nowrap ring-1 ring-inset",
        sizeClassNames[size],
        toneClassNames[tone][variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
