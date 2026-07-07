import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { AppTable, createAppTableColumns } from "@/shared/components/table";
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
    usersCount: "1 کاربر",
    createdAt: "1403/06/01",
    updatedAt: "1403/07/01",
    status: "فعال",
    permissions: ["همه بخش‌ها", "مدیریت کاربران", "گزارش‌ها"],
  },
  {
    id: 2002,
    title: "کارشناس فروش",
    department: "فروش و CRM",
    scope: "CRM و پروژه‌ها",
    usersCount: "1 کاربر",
    createdAt: "1403/06/05",
    updatedAt: "1403/07/03",
    status: "فعال",
    permissions: ["داشبورد", "مشتریان", "پروژه‌ها"],
  },
  {
    id: 2003,
    title: "مدیر فروش",
    department: "فروش و CRM",
    scope: "فروش، تاییدها و گزارش‌ها",
    usersCount: "0 کاربر",
    createdAt: "1403/06/10",
    updatedAt: "1403/06/28",
    status: "نمونه",
    permissions: ["تایید فروش", "گزارش‌ها", "CRM"],
  },
];

type RoleRow = (typeof mockRoles)[number];

const roleColumn = createAppTableColumns<RoleRow>();

const roleColumns = [
  roleColumn.field("id", { title: "کد نقش", width: 110, sortable: true }),
  roleColumn.field("title", { title: "عنوان نقش", width: 180, sortable: true, render: (value) => <strong>{value}</strong> }),
  roleColumn.field("department", { title: "دپارتمان", width: 170 }),
  roleColumn.field("scope", { title: "دامنه دسترسی", width: 210 }),
  roleColumn.field("usersCount", { title: "تعداد کاربران", width: 140 }),
  roleColumn.field("permissions", {
    title: "مجوزها",
    width: 280,
    render: (permissions) => (
      <div className="flex flex-wrap gap-1.5">
        {permissions.map((permission) => (
          <AppBadge key={permission}>{permission}</AppBadge>
        ))}
      </div>
    ),
  }),
  roleColumn.field("createdAt", { title: "تاریخ ایجاد", width: 140 }),
  roleColumn.field("updatedAt", { title: "آخرین بروزرسانی", width: 160 }),
  roleColumn.field("status", {
    title: "وضعیت",
    width: 120,
    render: (value) => <AppBadge tone={value === "فعال" ? "atisCyan" : "gray"}>{value}</AppBadge>,
  }),
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
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{SharedTexts.Navigation.Roles}</h1>
        <p className="mt-1.5 text-sm text-slate-500">مدل اولیه نقش‌ها و مجوزهای احراز هویت آتیس همراه با ستون‌های سازمانی و سطح دسترسی.</p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <AppTable columns={roleColumns} dataSource={mockRoles} minWidth={1040} rowKey="id" />
      </section>
    </div>
  );
}
