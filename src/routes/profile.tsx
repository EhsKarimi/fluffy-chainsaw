import { Avatar, Tabs } from "@mantine/core";
import { IconSettings, IconUserCircle } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { useAuth } from "@/modules/auth/context/useAuth";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { ProfilePersonalizationTab } from "@/modules/profile/components/ProfilePersonalizationTab";
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
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{SharedTexts.Navigation.Profile}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{SharedTexts.Profile.PageDescription}</p>
      </div>

      <Tabs defaultValue="personalization" variant="pills" radius="xl" keepMounted={false}>
        <Tabs.List grow>
          <Tabs.Tab value="personalization" rightSection={<IconSettings size={18} />}>
            {SharedTexts.Profile.Tabs.Personalization}
          </Tabs.Tab>
          <Tabs.Tab value="account" rightSection={<IconUserCircle size={18} />}>
            {SharedTexts.Profile.Tabs.Account}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personalization" pt="lg">
          <ProfilePersonalizationTab />
        </Tabs.Panel>

        <Tabs.Panel value="account" pt="lg">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start gap-6">
              <Avatar color={user.avatarColor} radius="xl" size={72}>
                {getInitials(user.fullName)}
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-slate-900">{user.fullName}</h3>
                <p className="text-sm text-slate-500" dir="ltr">
                  {user.email}
                </p>
                <p className="text-sm text-slate-500">{SharedTexts.Profile.Account.Description}</p>
                <div className="flex flex-wrap gap-2">
                  <AppBadge tone={user.avatarColor === "blue" || user.avatarColor === "teal" ? user.avatarColor : "atisCyan"}>
                    {user.roleLabel}
                  </AppBadge>
                  <AppBadge tone="gray" variant="outline">
                    {user.permissions.length} {SharedTexts.Profile.PermissionCountLabel}
                  </AppBadge>
                </div>
              </div>
            </div>
          </section>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
