import { Alert, Button, Stack, Text, Title } from "@mantine/core";
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
    <div className="mx-auto flex min-h-permission-page max-w-xl items-center justify-center p-4" dir="rtl">
      <Alert color="red" icon={<IconLockAccess size={22} />} radius="lg" className="w-full shadow-sm">
        <Stack gap="sm">
          <Title order={3}>{AuthTexts.Auth.AccessDeniedTitle}</Title>
          <Text size="sm" c="dimmed">
            {AuthTexts.Auth.AccessDeniedDescription}
          </Text>
          <Button component={Link} to="/dashboard" variant="light" className="self-start">
            {AuthTexts.Auth.BackToDashboard}
          </Button>
        </Stack>
      </Alert>
    </div>
  );
}
