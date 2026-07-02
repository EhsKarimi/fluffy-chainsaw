import { type MockAuthUser, PermissionKeys } from "@/modules/auth/types/auth.types";

export const mockAuthUsers: MockAuthUser[] = [
  {
    user: {
      id: 1001,
      fullName: "مدیر سیستم آتیس",
      username: "admin@atis.local",
      email: "admin@atis.local",
      role: "admin",
      roleLabel: "مدیر سیستم",
      avatarColor: "blue",
      permissions: [
        PermissionKeys.DashboardView,
        PermissionKeys.CrmCustomersView,
        PermissionKeys.CrmCustomersCreate,
        PermissionKeys.CrmProjectsView,
        PermissionKeys.CrmProjectsCreate,
        PermissionKeys.ReportsView,
        PermissionKeys.SettingsUsersView,
        PermissionKeys.SettingsRolesView,
        PermissionKeys.ProfileView,
      ],
    },
    password: "Admin@123",
    token: "mock-admin-auth-token",
  },
  {
    user: {
      id: 1002,
      fullName: "کارشناس فروش آتیس",
      username: "sales@atis.local",
      email: "sales@atis.local",
      role: "sales",
      roleLabel: "کارشناس فروش",
      avatarColor: "teal",
      permissions: [
        PermissionKeys.DashboardView,
        PermissionKeys.CrmCustomersView,
        PermissionKeys.CrmCustomersCreate,
        PermissionKeys.CrmProjectsView,
        PermissionKeys.CrmProjectsCreate,
        PermissionKeys.ProfileView,
      ],
    },
    password: "Sales@123",
    token: "mock-sales-auth-token",
  },
];

export function findMockUserByCredentials(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase();

  return mockAuthUsers.find((mockUser) => mockUser.user.username.toLowerCase() === normalizedUsername && mockUser.password === password);
}

export function findMockUserByToken(token: string) {
  return mockAuthUsers.find((mockUser) => mockUser.token === token);
}
