import { IconDashboard, IconSettings, IconShieldLock, IconUserCircle } from "@tabler/icons-react";

import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { erpModules } from "@/shared/constants/erp-modules";

import { type NavigationItem } from "@/shared/types/navigation.types";
import { SharedTexts } from "@/shared/constants/SharedTexts";

const erpNavigationItems = erpModules.filter((erpModule) => erpModule.id !== "bi").map(
  (erpModule) =>
    ({
      id: erpModule.id,
      label: erpModule.title,
      icon: erpModule.icon,
      children: erpModule.submenus.map((submenu) => ({
        id: `${erpModule.id}-${submenu.id}`,
        label: submenu.label,
        href: submenu.href,
        icon: submenu.icon,
        permission: submenu.permission,
      })),
    }) satisfies NavigationItem,
);

export const navigationItems = [
  {
    id: "dashboard",
    label: SharedTexts.Navigation.Dashboard,
    href: "/dashboard",
    icon: IconDashboard,
    permission: PermissionKeys.DashboardView,
  },
  ...erpNavigationItems,
  {
    id: "settings",
    label: SharedTexts.Navigation.Settings,
    icon: IconSettings,
    children: [
      {
        id: "settings-users",
        label: SharedTexts.Navigation.Users,
        href: "/settings/users",
        icon: IconUserCircle,
        permission: PermissionKeys.SettingsUsersView,
      },
      {
        id: "settings-roles",
        label: SharedTexts.Navigation.Roles,
        href: "/settings/roles",
        icon: IconShieldLock,
        permission: PermissionKeys.SettingsRolesView,
      },
    ],
  },
] satisfies NavigationItem[];
