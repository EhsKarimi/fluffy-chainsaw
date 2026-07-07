import { ActionIcon, Avatar, Burger, Button, Menu, Tooltip, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCommand, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { AuthTexts } from "@/modules/auth/constants/AuthTexts";
import { useAuth } from "@/modules/auth/context/useAuth";
import { AppCommandModal } from "@/shared/components/layout/AppCommandModal";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { getPublicAssetUrl } from "@/shared/utils/getPublicAssetUrl";
import { cn } from "@/shared/utils/style";

type AppHeaderProps = {
  mobileOpened: boolean;
  onToggleMobileMenu: () => void;
};

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0))
    .join("");
}

export function AppHeader({ mobileOpened, onToggleMobileMenu }: AppHeaderProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [commandModalOpened, { close: closeCommandModal, open: openCommandModal }] = useDisclosure(false);

  const handleLogout = async () => {
    logout();
    await navigate({ to: "/login", replace: true });
  };

  const handleProfileClick = async () => {
    await navigate({ to: "/profile" });
  };

  return (
    <header className="flex h-full items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 shadow-sm md:px-6" dir="rtl">
      <div className="flex items-center gap-4">
        <Burger
          opened={mobileOpened}
          onClick={onToggleMobileMenu}
          hiddenFrom="md"
          size="sm"
          aria-label={mobileOpened ? SharedTexts.Layout.CloseMobileMenuLabel : SharedTexts.Layout.MobileMenuLabel}
        />

        <div className="hidden h-32 w-32 sm:flex">
          <img src={getPublicAssetUrl("images/logo.png")} alt={SharedTexts.BrandName} className="h-full w-full object-contain" />
        </div>

        <div>
          <p className="text-sm font-extrabold text-slate-900 sm:text-base">{SharedTexts.Layout.HeaderTitle}</p>
          <p className="hidden text-xs text-slate-500 sm:block">{SharedTexts.Layout.HeaderSubtitle}</p>
        </div>

        <Button
          className="hidden sm:inline-flex"
          variant="light"
          color="atisCyan"
          radius="xl"
          leftSection={<IconCommand size={18} />}
          onClick={openCommandModal}
        >
          {SharedTexts.CommandPalette.OpenButtonLabel}
        </Button>
        <div className="sm:hidden">
          <Tooltip label={SharedTexts.CommandPalette.OpenButtonLabel}>
            <ActionIcon
              variant="light"
              color="atisCyan"
              radius="xl"
              size="lg"
              aria-label={SharedTexts.CommandPalette.OpenButtonLabel}
              onClick={openCommandModal}
            >
              <IconCommand size={18} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Menu width={240} position="bottom-start" shadow="lg" radius="lg" withArrow>
          <Menu.Target>
            <UnstyledButton
              className={cn(
                "rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100",
                "focus-visible:outline-atisCyan-500 focus-visible:outline-2 focus-visible:outline-offset-2",
              )}
            >
              <div className="flex items-center gap-2">
                <div className="hidden text-right sm:block">
                  <p className="text-sm leading-5 font-bold text-slate-900">{user?.fullName}</p>
                  <p className="text-xs leading-4 text-slate-500">{user?.roleLabel}</p>
                </div>
                <Avatar color={user?.avatarColor ?? "atisCyan"} radius="xl">
                  {user ? getInitials(user.fullName) : SharedTexts.BrandInitial}
                </Avatar>
              </div>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown dir="rtl">
            <Menu.Label>{AuthTexts.Profile.AccountLabel}</Menu.Label>
            <Menu.Item leftSection={<IconUserCircle size={18} />} onClick={() => void handleProfileClick()}>
              {AuthTexts.Profile.ProfileCommand}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconLogout size={18} />} onClick={() => void handleLogout()}>
              {AuthTexts.Profile.LogoutCommand}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      <AppCommandModal opened={commandModalOpened} onClose={closeCommandModal} />
    </header>
  );
}
