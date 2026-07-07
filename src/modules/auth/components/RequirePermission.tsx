import { Alert, Button } from "@mantine/core";
import { IconLockAccess } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { type PropsWithChildren } from "react";

import { AuthTexts } from "@/modules/auth/constants/AuthTexts";
import { useAuth } from "@/modules/auth/context/useAuth";
import { type PermissionKey } from "@/modules/auth/types/auth.types";

type RequirePermissionProps = PropsWithChildren<{
  permission: PermissionKey;
}>;

export function RequirePermission({ children, permission }: RequirePermissionProps) {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return children;
  }

  return (
    <div className="min-h-permission-page mx-auto flex max-w-xl items-center justify-center p-4" dir="rtl">
      <Alert color="red" icon={<IconLockAccess size={22} />} radius="lg" className="w-full shadow-sm">
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-slate-900">{AuthTexts.Auth.AccessDeniedTitle}</h3>
          <p className="text-sm text-slate-500">{AuthTexts.Auth.AccessDeniedDescription}</p>
          <Button component={Link} to="/dashboard" variant="light" className="self-start">
            {AuthTexts.Auth.BackToDashboard}
          </Button>
        </div>
      </Alert>
    </div>
  );
}
