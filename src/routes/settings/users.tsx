import { Card, Stack, Table, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { SharedTexts } from "@/shared/constants/SharedTexts";

export const Route = createFileRoute("/settings/users")({
  component: UsersRoute,
});

const mockUsers = [
  {
    id: 1001,
    name: "مدیر سیستم آتیس",
    username: "admin@atis.local",
    email: "admin@atis.local",
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    department: "مدیریت فناوری اطلاعات",
    role: "مدیر سیستم",
    accessLevel: "دسترسی کامل",
    lastLogin: "۱۴۰۳/۰۷/۱۲ ۱۰:۳۰",
    createdAt: "۱۴۰۳/۰۶/۰۱",
    status: "فعال",
  },
  {
    id: 1002,
    name: "کارشناس فروش آتیس",
    username: "sales@atis.local",
    email: "sales@atis.local",
    phone: "۰۹۱۲۲۳۴۵۶۷۸",
    department: "فروش و CRM",
    role: "کارشناس فروش",
    accessLevel: "CRM و پروژه‌ها",
    lastLogin: "۱۴۰۳/۰۷/۱۲ ۰۹:۱۵",
    createdAt: "۱۴۰۳/۰۶/۰۵",
    status: "فعال",
  },
  {
    id: 1003,
    name: "مدیر فروش",
    username: "sales-manager@atis.local",
    email: "sales-manager@atis.local",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    department: "فروش و CRM",
    role: "مدیر فروش",
    accessLevel: "تایید فروش و گزارش‌ها",
    lastLogin: "۱۴۰۳/۰۷/۱۰ ۱۶:۴۵",
    createdAt: "۱۴۰۳/۰۶/۱۰",
    status: "نمونه",
  },
];

function UsersRoute() {
  return (
    <RequirePermission permission={PermissionKeys.SettingsUsersView}>
      <UsersPage />
    </RequirePermission>
  );
}

function UsersPage() {
  return (
    <Stack gap="lg" dir="rtl">
      <div>
        <Title order={1}>{SharedTexts.Navigation.Users}</Title>
        <Text c="dimmed" mt={6}>
          مدیریت کاربران بعداً به API سازمان متصل می‌شود؛ این جدول ستون‌های کلیدی برای نسخه اولیه پنل را نشان می‌دهد.
        </Text>
      </div>

      <Card radius="xl" padding="lg" shadow="sm" className="border border-slate-200 bg-white">
        <Table.ScrollContainer minWidth={1180}>
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="whitespace-nowrap">کد</Table.Th>
                <Table.Th className="whitespace-nowrap">نام کاربر</Table.Th>
                <Table.Th className="whitespace-nowrap">نام کاربری</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.Email}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.ContactNumber}</Table.Th>
                <Table.Th className="whitespace-nowrap">دپارتمان</Table.Th>
                <Table.Th className="whitespace-nowrap">نقش</Table.Th>
                <Table.Th className="whitespace-nowrap">سطح دسترسی</Table.Th>
                <Table.Th className="whitespace-nowrap">آخرین ورود</Table.Th>
                <Table.Th className="whitespace-nowrap">تاریخ ایجاد</Table.Th>
                <Table.Th className="whitespace-nowrap">وضعیت</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {mockUsers.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.id}</Table.Td>
                  <Table.Td fw={700}>{user.name}</Table.Td>
                  <Table.Td dir="ltr">{user.username}</Table.Td>
                  <Table.Td dir="ltr">{user.email}</Table.Td>
                  <Table.Td>{user.phone}</Table.Td>
                  <Table.Td>{user.department}</Table.Td>
                  <Table.Td>{user.role}</Table.Td>
                  <Table.Td>{user.accessLevel}</Table.Td>
                  <Table.Td>{user.lastLogin}</Table.Td>
                  <Table.Td>{user.createdAt}</Table.Td>
                  <Table.Td>
                    <AppBadge tone={user.status === "فعال" ? "atisCyan" : "gray"}>{user.status}</AppBadge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </Stack>
  );
}
