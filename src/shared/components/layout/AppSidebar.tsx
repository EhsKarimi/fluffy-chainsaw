import { Collapse, ScrollArea, TextInput, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useAuth } from "@/modules/auth/context/useAuth";
import { type AuthRole } from "@/modules/auth/types/auth.types";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { navigationItems } from "@/shared/constants/navigation-items";
import { type NavigationItem } from "@/shared/types/navigation.types";
import { cn } from "@/shared/utils/style";

type AppSidebarProps = {
  onNavigate?: () => void;
};

function roleCanSeeItem(item: NavigationItem, userRole: AuthRole | undefined) {
  return !item.allowedRoles?.length || Boolean(userRole && item.allowedRoles.includes(userRole));
}

function itemIsAllowed(item: NavigationItem, hasPermission: ReturnType<typeof useAuth>["hasPermission"], userRole: AuthRole | undefined): boolean {
  if (!roleCanSeeItem(item, userRole)) {
    return false;
  }

  if (item.children?.length) {
    return item.children.some((child) => itemIsAllowed(child, hasPermission, userRole));
  }

  return item.permission ? hasPermission(item.permission) : true;
}

function itemIsActive(item: NavigationItem, pathname: string): boolean {
  if (item.href === pathname) {
    return true;
  }

  return Boolean(item.children?.some((child) => itemIsActive(child, pathname)));
}

function getActiveParentIds(items: NavigationItem[], pathname: string): string[] {
  const activeParentIds: string[] = [];

  items.forEach((item) => {
    if (!item.children?.length) {
      return;
    }

    if (item.children.some((child) => itemIsActive(child, pathname))) {
      activeParentIds.push(item.id);
    }
  });

  return activeParentIds;
}

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase("fa-IR");
}

function navigationItemMatches(item: NavigationItem, normalizedSearchValue: string) {
  return item.label.toLocaleLowerCase("fa-IR").includes(normalizedSearchValue);
}

function filterNavigationItems(items: NavigationItem[], normalizedSearchValue: string): NavigationItem[] {
  if (!normalizedSearchValue) {
    return items;
  }

  return items.flatMap((item) => {
    const itemMatches = navigationItemMatches(item, normalizedSearchValue);

    if (!item.children?.length) {
      return itemMatches ? [item] : [];
    }

    if (itemMatches) {
      return [item];
    }

    const matchingChildren = item.children.filter((child) => navigationItemMatches(child, normalizedSearchValue));

    return matchingChildren.length > 0 ? [{ ...item, children: matchingChildren }] : [];
  });
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const { hasPermission, user } = useAuth();
  const pathname = useLocation({ select: (location) => location.pathname });
  const [searchValue, setSearchValue] = useState("");
  const allowedNavigationItems = useMemo(
    () => navigationItems.filter((item) => itemIsAllowed(item, hasPermission, user?.role)),
    [hasPermission, user?.role],
  );
  const normalizedSearchValue = normalizeSearchValue(searchValue);
  const visibleNavigationItems = useMemo(
    () => filterNavigationItems(allowedNavigationItems, normalizedSearchValue),
    [allowedNavigationItems, normalizedSearchValue],
  );
  const activeParentIds = useMemo(() => getActiveParentIds(allowedNavigationItems, pathname), [pathname, allowedNavigationItems]);
  const [openedParents, setOpenedParents] = useState<Record<string, boolean>>({});

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    const Icon = item.icon;
    const isActive = itemIsActive(item, pathname);
    const isParent = Boolean(item.children?.length);
    const isOpen = normalizedSearchValue ? true : (openedParents[item.id] ?? activeParentIds.includes(item.id));

    if (isParent) {
      return (
        <div key={item.id} className="space-y-1">
          <UnstyledButton
            className={cn(
              "group text-nav-root flex w-full items-center justify-between rounded-2xl px-3 py-2.5 font-semibold transition duration-200",
              isActive ? "bg-atisCyan-50 text-atisCyan-700 shadow-sm shadow-cyan-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
            )}
            onClick={() => {
              setOpenedParents((currentOpenedParents) => ({
                ...currentOpenedParents,
                [item.id]: !isOpen,
              }));
            }}
          >
            <span className="flex min-w-0 items-center gap-3">
              <ThemeIcon variant={isActive ? "light" : "transparent"} color={isActive ? "atisCyan" : "gray"} radius="xl" size="md">
                <Icon size={17} />
              </ThemeIcon>
              <span className="truncate">{item.label}</span>
            </span>

            <IconChevronLeft className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen ? "-rotate-90" : "rotate-0")} />
          </UnstyledButton>

          <Collapse expanded={isOpen} transitionDuration={220} transitionTimingFunction="ease">
            <div className="mr-2 space-y-1 border-r border-slate-200">
              {item.children
                ?.filter((child) => itemIsAllowed(child, hasPermission, user?.role))
                .map((child) => renderNavigationItem(child, depth + 1))}
            </div>
          </Collapse>
        </div>
      );
    }

    if (!item.href) {
      return (
        <div
          key={item.id}
          aria-disabled
          className={cn("flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400", depth > 0 && "mr-0")}
        >
          <span className="flex min-w-0 items-center gap-1">
            <ThemeIcon variant="transparent" color="gray" radius="xl" size="md">
              <Icon size={depth > 0 ? 16 : 17} />
            </ThemeIcon>
            <span className="truncate">{item.label}</span>
          </span>
          <AppBadge size="xs" tone="gray" variant="outline">
            {SharedTexts.Layout.ComingSoonBadge}
          </AppBadge>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.href}
        onClick={onNavigate}
        className={cn(
          "text-nav-root flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold no-underline transition duration-200",
          depth > 0 && "rounded-xl py-2 text-sm",
          isActive ? "bg-atisCyan-500 text-white shadow-sm shadow-cyan-500/25" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        )}
      >
        <ThemeIcon variant={isActive ? "white" : "transparent"} color={isActive ? "atisCyan" : "gray"} radius="xl" size="md">
          <Icon size={depth > 0 ? 16 : 17} />
        </ThemeIcon>
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="flex h-full flex-col border-l border-slate-200 bg-white" dir="rtl">
      <div className="border-b border-slate-100 px-3 py-3">
        <TextInput
          aria-label={SharedTexts.Layout.SidebarSearchPlaceholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          placeholder={SharedTexts.Layout.SidebarSearchPlaceholder}
          rightSection={<IconSearch size={16} />}
          size="xs"
          radius="xl"
        />
      </div>
      <ScrollArea className="min-h-0 flex-1 px-3 py-4">
        {visibleNavigationItems.length > 0 ? (
          <nav className="space-y-1.5">{visibleNavigationItems.map((item) => renderNavigationItem(item))}</nav>
        ) : (
          <p className="px-3 py-4 text-center text-xs text-slate-500">{SharedTexts.Layout.SidebarNoResults}</p>
        )}
      </ScrollArea>
    </aside>
  );
}
