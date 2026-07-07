import { ThemeIcon } from "@mantine/core";
import { Link, createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { useAuth } from "@/modules/auth/context/useAuth";
import { type AuthRole, PermissionKeys } from "@/modules/auth/types/auth.types";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { type ErpModuleItem, erpModules } from "@/shared/constants/erp-modules";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <RequirePermission permission={PermissionKeys.DashboardView}>
      <DashboardPage />
    </RequirePermission>
  );
}

function userCanSeeErpModule(erpModule: ErpModuleItem, userRole: AuthRole | undefined) {
  return Boolean(userRole && erpModule.allowedRoles.includes(userRole));
}

function submenuIsAllowed(submenu: ErpModuleItem["submenus"][number], hasPermission: ReturnType<typeof useAuth>["hasPermission"]) {
  return submenu.permission ? hasPermission(submenu.permission) : true;
}

function DashboardPage() {
  const { hasPermission, user } = useAuth();
  const visibleErpModules = erpModules.filter((erpModule) => userCanSeeErpModule(erpModule, user?.role));

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{SharedTexts.Navigation.Dashboard}</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {SharedTexts.Dashboard.WelcomePrefix} {user?.fullName}. {SharedTexts.Dashboard.WelcomeSuffix}
          </p>
        </div>
        <AppBadge size="lg" tone={user?.avatarColor === "blue" || user?.avatarColor === "teal" ? user.avatarColor : "atisCyan"}>
          {user?.roleLabel}
        </AppBadge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleErpModules.map((erpModule) => {
          const Icon = erpModule.icon;
          const visibleSubmenus = erpModule.submenus.filter((submenu) => submenuIsAllowed(submenu, hasPermission)).slice(0, 3);

          return (
            <section
              key={erpModule.id}
              className="group hover:border-atisCyan-500/60 relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/70"
            >
              <div className="bg-atisCyan-500 absolute inset-x-0 top-0 h-1 opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ThemeIcon
                      size={44}
                      radius="xl"
                      variant="light"
                      color="atisCyan"
                      className={`bg-linear-to-br ${erpModule.accent} transition duration-300 group-hover:scale-110`}
                    >
                      <Icon size={24} />
                    </ThemeIcon>

                    <h3 className="text-base leading-7 font-extrabold text-slate-900">{erpModule.title}</h3>
                  </div>

                  {erpModule.featured ? <AppBadge>{SharedTexts.Dashboard.FeaturedModuleBadge}</AppBadge> : null}
                </div>

                <p className="text-sm leading-7 text-slate-500">{erpModule.description}</p>

                <div className="flex flex-wrap gap-2">
                  {visibleSubmenus.map((submenu) =>
                    submenu.href ? (
                      <Link key={submenu.id} to={submenu.href} className="inline-flex no-underline transition duration-200 hover:-translate-y-0.5">
                        <AppBadge
                          tone="gray"
                          variant="outline"
                          className="hover:border-atisCyan-300 hover:text-atisCyan-700 font-medium transition duration-200"
                        >
                          {submenu.label}
                        </AppBadge>
                      </Link>
                    ) : (
                      <AppBadge key={submenu.id} tone="gray" variant="outline" className="font-medium">
                        {submenu.label}
                      </AppBadge>
                    ),
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
