import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { AppTable, createAppTableColumns } from "@/shared/components/table";
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
    phone: "09121234567",
    department: "مدیریت فناوری اطلاعات",
    role: "مدیر سیستم",
    accessLevel: "دسترسی کامل",
    lastLogin: "1403/07/12 10:30",
    createdAt: "1403/06/01",
    status: "فعال",
  },
  {
    id: 1002,
    name: "کارشناس فروش آتیس",
    username: "sales@atis.local",
    email: "sales@atis.local",
    phone: "09122345678",
    department: "فروش و CRM",
    role: "کارشناس فروش",
    accessLevel: "CRM و پروژه‌ها",
    lastLogin: "1403/07/12 09:15",
    createdAt: "1403/06/05",
    status: "فعال",
  },
  {
    id: 1003,
    name: "مدیر فروش",
    username: "sales-manager@atis.local",
    email: "sales-manager@atis.local",
    phone: "09123456789",
    department: "فروش و CRM",
    role: "مدیر فروش",
    accessLevel: "تایید فروش و گزارش‌ها",
    lastLogin: "1403/07/10 16:45",
    createdAt: "1403/06/10",
    status: "نمونه",
  },
];

type UserRow = (typeof mockUsers)[number];

const userColumn = createAppTableColumns<UserRow>();

const userColumns = [
  userColumn.field("id", { title: "کد", width: 90, sortable: true }),
  userColumn.field("name", { title: "نام کاربر", width: 220, sortable: true, render: (value) => <strong>{value}</strong> }),
  userColumn.field("username", { title: "نام کاربری", width: 180, cellClassName: "text-left", sortable: true }),
  userColumn.field("email", { title: SharedTexts.Email, width: 180, cellClassName: "text-left" }),
  userColumn.field("phone", { title: SharedTexts.ContactNumber, width: 150 }),
  userColumn.field("department", { title: "دپارتمان", width: 190 }),
  userColumn.field("role", { title: "نقش", width: 150 }),
  userColumn.field("accessLevel", { title: "سطح دسترسی", width: 190 }),
  userColumn.field("lastLogin", { title: "آخرین ورود", width: 170 }),
  userColumn.field("createdAt", { title: "تاریخ ایجاد", width: 140 }),
  userColumn.field("status", {
    title: "وضعیت",
    width: 120,
    render: (value) => <AppBadge tone={value === "فعال" ? "atisCyan" : "gray"}>{value}</AppBadge>,
  }),
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
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{SharedTexts.Navigation.Users}</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          مدیریت کاربران بعداً به API سازمان متصل می‌شود؛ این جدول ستون‌های کلیدی برای نسخه اولیه پنل را نشان می‌دهد.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <AppTable columns={userColumns} dataSource={mockUsers} minWidth={1180} rowKey="id" />
      </section>
    </div>
  );
}
