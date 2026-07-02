import { PermissionKeys, type PermissionKey } from "@/modules/auth/types/auth.types";
import { SharedTexts } from "@/shared/constants/SharedTexts";

export type AppCommandId =
  | "dashboard-open"
  | "customer-list"
  | "customer-create"
  | "project-list"
  | "reports-open"
  | "settings-users"
  | "settings-roles"
  | "profile-open";

export type AppCommand = {
  id: AppCommandId;
  code: string;
  label: string;
  permission?: PermissionKey;
};

export const appCommands = [
  {
    id: "dashboard-open",
    code: "1000",
    label: SharedTexts.CommandPalette.Commands.Dashboard,
    permission: PermissionKeys.DashboardView,
  },
  {
    id: "customer-list",
    code: "1100",
    label: SharedTexts.CommandPalette.Commands.CustomerList,
    permission: PermissionKeys.CrmCustomersView,
  },
  {
    id: "customer-create",
    code: "1101",
    label: SharedTexts.CommandPalette.Commands.NewCustomer,
    permission: PermissionKeys.CrmCustomersCreate,
  },
  {
    id: "project-list",
    code: "1200",
    label: SharedTexts.CommandPalette.Commands.ProjectList,
    permission: PermissionKeys.CrmProjectsView,
  },
  {
    id: "reports-open",
    code: "1300",
    label: SharedTexts.CommandPalette.Commands.Reports,
    permission: PermissionKeys.ReportsView,
  },
  {
    id: "settings-users",
    code: "9001",
    label: SharedTexts.CommandPalette.Commands.Users,
    permission: PermissionKeys.SettingsUsersView,
  },
  {
    id: "settings-roles",
    code: "9002",
    label: SharedTexts.CommandPalette.Commands.Roles,
    permission: PermissionKeys.SettingsRolesView,
  },
  {
    id: "profile-open",
    code: "9900",
    label: SharedTexts.CommandPalette.Commands.Profile,
    permission: PermissionKeys.ProfileView,
  },
] satisfies AppCommand[];
