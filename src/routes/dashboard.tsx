import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { useAuth } from "@/modules/auth/context/useAuth";
import { PermissionKeys, type AuthRole } from "@/modules/auth/types/auth.types";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { erpModules, type ErpModuleItem } from "@/shared/constants/erp-modules";
import { SharedTexts } from "@/shared/constants/SharedTexts";

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
    <Stack gap="xl" dir="rtl">
      <Group justify="space-between" align="flex-start" gap="md">
        <div>
          <Title order={1} className="text-slate-900">
            {SharedTexts.Navigation.Dashboard}
          </Title>
          <Text c="dimmed" mt={6}>
            {SharedTexts.Dashboard.WelcomePrefix} {user?.fullName}. {SharedTexts.Dashboard.WelcomeSuffix}
          </Text>
        </div>
        <AppBadge size="lg" tone={user?.avatarColor === "blue" || user?.avatarColor === "teal" ? user.avatarColor : "atisCyan"}>
          {user?.roleLabel}
        </AppBadge>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
        {visibleErpModules.map((erpModule) => {
          const Icon = erpModule.icon;
          const visibleSubmenus = erpModule.submenus.filter((submenu) => submenuIsAllowed(submenu, hasPermission)).slice(0, 3);

          return (
            <Card
              key={erpModule.id}
              radius="xl"
              padding="lg"
              shadow="sm"
              className="group hover:border-atisCyan-500/60 relative overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/70"
            >
              <div className="bg-atisCyan-500 absolute inset-x-0 top-0 h-1 opacity-0 transition duration-300 group-hover:opacity-100" />
              <Stack gap="md">
                <Group justify="space-between" align="flex-start" gap="md" wrap="nowrap">
                  <Group gap="sm" align="center" wrap="nowrap">
                    <ThemeIcon
                      size={44}
                      radius="xl"
                      variant="light"
                      color="atisCyan"
                      className={`bg-linear-to-br ${erpModule.accent} transition duration-300 group-hover:scale-110`}
                    >
                      <Icon size={24} />
                    </ThemeIcon>

                    <Title order={3} className="text-base leading-7 text-slate-900">
                      {erpModule.title}
                    </Title>
                  </Group>

                  {erpModule.featured ? <AppBadge>{SharedTexts.Dashboard.FeaturedModuleBadge}</AppBadge> : null}
                </Group>

                <Text size="sm" c="dimmed" className="leading-7">
                  {erpModule.description}
                </Text>

                <Group gap="xs">
                  {visibleSubmenus.map((submenu) =>
                    submenu.href ? (
                      <Link key={submenu.id} to={submenu.href} className="inline-flex no-underline transition duration-200 hover:-translate-y-0.5">
                        <AppBadge tone="gray" variant="outline" className="font-medium transition duration-200 hover:border-atisCyan-300 hover:text-atisCyan-700">
                          {submenu.label}
                        </AppBadge>
                      </Link>
                    ) : (
                      <AppBadge key={submenu.id} tone="gray" variant="outline" className="font-medium">
                        {submenu.label}
                      </AppBadge>
                    ),
                  )}
                </Group>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
