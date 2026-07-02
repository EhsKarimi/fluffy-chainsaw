export const PermissionKeys = {
  DashboardView: "dashboard.view",
  CrmCustomersView: "crm.customers.view",
  CrmCustomersCreate: "crm.customers.create",
  CrmProjectsView: "crm.projects.view",
  CrmProjectsCreate: "crm.projects.create",
  ReportsView: "reports.view",
  SettingsUsersView: "settings.users.view",
  SettingsRolesView: "settings.roles.view",
  ProfileView: "profile.view",
} as const;

export type PermissionKey = (typeof PermissionKeys)[keyof typeof PermissionKeys];

export type AuthRole = "admin" | "sales";

export type AuthUser = {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: AuthRole;
  roleLabel: string;
  avatarColor: string;
  permissions: PermissionKey[];
};

export type LoginValues = {
  username: string;
  password: string;
};

export type LoginResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export type MockAuthUser = {
  user: AuthUser;
  password: string;
  token: string;
};
