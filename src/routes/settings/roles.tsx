import { Card, Group, Stack, Table, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { SharedTexts } from "@/shared/constants/SharedTexts";

export const Route = createFileRoute("/settings/roles")({
  component: RolesRoute,
});

const mockRoles = [
  {
    id: 2001,
    title: "مدیر سیستم",
    department: "فناوری اطلاعات",
    scope: "کل سامانه",
    usersCount: "۱ کاربر",
    createdAt: "۱۴۰۳/۰۶/۰۱",
    updatedAt: "۱۴۰۳/۰۷/۰۱",
    status: "فعال",
    permissions: ["همه بخش‌ها", "مدیریت کاربران", "گزارش‌ها"],
  },
  {
    id: 2002,
    title: "کارشناس فروش",
    department: "فروش و CRM",
    scope: "CRM و پروژه‌ها",
    usersCount: "۱ کاربر",
    createdAt: "۱۴۰۳/۰۶/۰۵",
    updatedAt: "۱۴۰۳/۰۷/۰۳",
    status: "فعال",
    permissions: ["داشبورد", "مشتریان", "پروژه‌ها"],
  },
  {
    id: 2003,
    title: "مدیر فروش",
    department: "فروش و CRM",
    scope: "فروش، تاییدها و گزارش‌ها",
    usersCount: "۰ کاربر",
    createdAt: "۱۴۰۳/۰۶/۱۰",
    updatedAt: "۱۴۰۳/۰۶/۲۸",
    status: "نمونه",
    permissions: ["تایید فروش", "گزارش‌ها", "CRM"],
  },
];

function RolesRoute() {
  return (
    <RequirePermission permission={PermissionKeys.SettingsRolesView}>
      <RolesPage />
    </RequirePermission>
  );
}

function RolesPage() {
  return (
    <Stack gap="lg" dir="rtl">
      <div>
        <Title order={1}>{SharedTexts.Navigation.Roles}</Title>
        <Text c="dimmed" mt={6}>
          مدل اولیه نقش‌ها و مجوزهای احراز هویت آتیس همراه با ستون‌های سازمانی و سطح دسترسی.
        </Text>
      </div>

      <Card radius="xl" padding="lg" shadow="sm" className="border border-slate-200 bg-white">
        <Table.ScrollContainer minWidth={1040}>
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="whitespace-nowrap">کد نقش</Table.Th>
                <Table.Th className="whitespace-nowrap">عنوان نقش</Table.Th>
                <Table.Th className="whitespace-nowrap">دپارتمان</Table.Th>
                <Table.Th className="whitespace-nowrap">دامنه دسترسی</Table.Th>
                <Table.Th className="whitespace-nowrap">تعداد کاربران</Table.Th>
                <Table.Th className="whitespace-nowrap">مجوزها</Table.Th>
                <Table.Th className="whitespace-nowrap">تاریخ ایجاد</Table.Th>
                <Table.Th className="whitespace-nowrap">آخرین بروزرسانی</Table.Th>
                <Table.Th className="whitespace-nowrap">وضعیت</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {mockRoles.map((role) => (
                <Table.Tr key={role.id}>
                  <Table.Td>{role.id}</Table.Td>
                  <Table.Td fw={700}>{role.title}</Table.Td>
                  <Table.Td>{role.department}</Table.Td>
                  <Table.Td>{role.scope}</Table.Td>
                  <Table.Td>{role.usersCount}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {role.permissions.map((permission) => (
                        <AppBadge key={permission}>{permission}</AppBadge>
                      ))}
                    </Group>
                  </Table.Td>
                  <Table.Td>{role.createdAt}</Table.Td>
                  <Table.Td>{role.updatedAt}</Table.Td>
                  <Table.Td>
                    <AppBadge tone={role.status === "فعال" ? "atisCyan" : "gray"}>{role.status}</AppBadge>
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
