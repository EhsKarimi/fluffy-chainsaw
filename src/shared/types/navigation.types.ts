import { type ComponentType } from "react";

import { type AuthRole, type PermissionKey } from "@/modules/auth/types/auth.types";

export type NavigationPath = "/dashboard" | "/crm/customers" | "/crm/projects" | "/reports" | "/settings/users" | "/settings/roles" | "/profile";

export type NavigationItem = {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
  href?: NavigationPath;
  permission?: PermissionKey;
  allowedRoles?: AuthRole[];
  badge?: string;
  children?: NavigationItem[];
};
