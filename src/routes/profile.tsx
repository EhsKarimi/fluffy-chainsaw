import { Avatar, Card, Group, Stack, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { useAuth } from "@/modules/auth/context/useAuth";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { SharedTexts } from "@/shared/constants/SharedTexts";

export const Route = createFileRoute("/profile")({
  component: ProfileRoute,
});

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0))
    .join("");
}

function ProfileRoute() {
  return (
    <RequirePermission permission={PermissionKeys.ProfileView}>
      <ProfilePage />
    </RequirePermission>
  );
}

function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Stack gap="lg" dir="rtl">
      <div>
        <Title order={1}>{SharedTexts.Navigation.Profile}</Title>
        <Text c="dimmed" mt={6}>
          اطلاعات حساب کاربری فعال در جریان mock auth.
        </Text>
      </div>

      <Card radius="xl" padding="xl" shadow="sm" className="border border-slate-200 bg-white">
        <Group align="flex-start" gap="lg">
          <Avatar color={user.avatarColor} radius="xl" size={72}>
            {getInitials(user.fullName)}
          </Avatar>
          <Stack gap="xs">
            <Title order={3}>{user.fullName}</Title>
            <Text c="dimmed" dir="ltr">
              {user.email}
            </Text>
            <Group gap="xs">
              <AppBadge tone={user.avatarColor === "blue" || user.avatarColor === "teal" ? user.avatarColor : "atisCyan"}>
                {user.roleLabel}
              </AppBadge>
              <AppBadge tone="gray" variant="outline">{user.permissions.length} {SharedTexts.Profile.PermissionCountLabel}</AppBadge>
            </Group>
          </Stack>
        </Group>
      </Card>
    </Stack>
  );
}
