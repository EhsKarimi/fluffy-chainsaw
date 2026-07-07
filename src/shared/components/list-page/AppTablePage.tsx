import { type ReactNode } from "react";

import { AppListPageHeader } from "@/shared/components/list-page/AppListPageHeader";
import { cn } from "@/shared/utils/style";

export type AppTablePageProps = {
  actions?: ReactNode;
  actionsClassName?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  dir?: "ltr" | "rtl" | "auto";
  filters?: ReactNode;
  headerClassName?: string;
  headerExtra?: ReactNode;
  modals?: ReactNode;
  title: ReactNode;
};

export function AppTablePage({
  actions,
  actionsClassName,
  children,
  className,
  contentClassName,
  description,
  dir = "rtl",
  filters,
  headerClassName,
  headerExtra,
  modals,
  title,
}: AppTablePageProps) {
  return (
    <div className={cn("space-y-6", className)} dir={dir}>
      <AppListPageHeader
        actions={actions}
        actionsClassName={actionsClassName}
        className={headerClassName}
        description={description}
        extra={headerExtra}
        title={title}
      />

      {filters ? <div className={contentClassName}>{filters}</div> : null}

      {children}

      {modals}
    </div>
  );
}

export type AppTablePageSectionProps = {
  children: ReactNode;
  className?: string;
};

export function AppTablePageSection({ children, className }: AppTablePageSectionProps) {
  return <section className={cn("rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6", className)}>{children}</section>;
}
