import { type ReactNode } from "react";

import { cn } from "@/shared/utils/style";

export type AppListPageHeaderProps = {
  actions?: ReactNode;
  actionsClassName?: string;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  eyebrow?: ReactNode;
  eyebrowClassName?: string;
  extra?: ReactNode;
  title: ReactNode;
  titleClassName?: string;
};

export function AppListPageHeader({
  actions,
  actionsClassName,
  className,
  contentClassName,
  description,
  descriptionClassName,
  eyebrow,
  eyebrowClassName,
  extra,
  title,
  titleClassName,
}: AppListPageHeaderProps) {
  return (
    <div className={cn("flex flex-col justify-between gap-4 md:flex-row md:items-start", className)}>
      <div className={cn("min-w-0", contentClassName)}>
        {eyebrow ? <div className={cn("mb-1 text-xs font-bold text-slate-400", eyebrowClassName)}>{eyebrow}</div> : null}
        <h1 className={cn("text-2xl font-extrabold text-slate-900", titleClassName)}>{title}</h1>
        {description ? <p className={cn("mt-1.5 text-sm text-slate-500", descriptionClassName)}>{description}</p> : null}
        {extra ? <div className="mt-3">{extra}</div> : null}
      </div>

      {actions ? <div className={cn("flex shrink-0 flex-wrap gap-2", actionsClassName)}>{actions}</div> : null}
    </div>
  );
}
