import {
  IconBuildingFactory2,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconCalendarStats,
  IconChartBar,
  IconChartFunnel,
  IconChartPie,
  IconChecklist,
  IconClipboardCheck,
  IconClipboardList,
  IconFileAnalytics,
  IconFileInvoice,
  IconFolderCog,
  IconHeadset,
  IconHeartHandshake,
  IconPackageExport,
  IconPackageImport,
  IconReportAnalytics,
  IconSettingsAutomation,
  IconShoppingBag,
  IconShoppingBagCheck,
  IconShoppingCart,
  IconShoppingCartPlus,
  IconSpeakerphone,
  IconTargetArrow,
  IconTimelineEvent,
  IconTool,
  IconTruckDelivery,
  IconUserCheck,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { type ComponentType } from "react";

import { PermissionKeys, type PermissionKey } from "@/modules/auth/types/auth.types";
import { type NavigationPath } from "@/shared/types/navigation.types";

type ErpModuleSubmenu = {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
  href?: NavigationPath;
  permission?: PermissionKey;
};

export type ErpModuleItem = {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
  accent: string;
  featured?: boolean;
  submenus: ErpModuleSubmenu[];
};

export const erpModules = [
  {
    id: "hrm",
    title: "منابع انسانی",
    description: "مدیریت چرخه کامل کارکنان",
    icon: IconUsersGroup,
    accent: "from-cyan-50 to-sky-50 text-cyan-700",
    submenus: [
      { id: "employees", label: "پرونده کارکنان", icon: IconUsers },
      { id: "attendance", label: "حضور و غیاب", icon: IconCalendarStats },
      { id: "performance", label: "ارزیابی عملکرد", icon: IconUserCheck },
    ],
  },
  {
    id: "crm",
    title: "مدیریت ارتباط با مشتری",
    description: "تمرکز اصلی این راهنما — در ادامه به تفصیل",
    icon: IconHeartHandshake,
    accent: "from-teal-50 to-cyan-50 text-teal-700",
    featured: true,
    submenus: [
      { id: "customers", label: "مشتریان", icon: IconUsers, href: "/crm/customers", permission: PermissionKeys.CrmCustomersView },
      { id: "projects", label: "پروژه‌ها", icon: IconFolderCog, href: "/crm/projects", permission: PermissionKeys.CrmProjectsView },
      { id: "pipeline", label: "قیف فروش و پیگیری", icon: IconChartFunnel, permission: PermissionKeys.CrmCustomersView },
    ],
  },
  {
    id: "manufacturing",
    title: "تولید",
    description: "مدیریت فرآیندهای تولیدی",
    icon: IconBuildingFactory2,
    accent: "from-orange-50 to-amber-50 text-orange-700",
    submenus: [
      { id: "bom", label: "ساختار محصول", icon: IconClipboardList },
      { id: "work-orders", label: "دستور تولید", icon: IconSettingsAutomation },
      { id: "quality-control", label: "کنترل کیفیت", icon: IconClipboardCheck },
    ],
  },
  {
    id: "scm",
    title: "زنجیره تأمین",
    description: "از تأمین‌کننده تا مشتری نهایی",
    icon: IconTruckDelivery,
    accent: "from-indigo-50 to-blue-50 text-indigo-700",
    submenus: [
      { id: "suppliers", label: "تأمین‌کنندگان", icon: IconBuildingStore },
      { id: "inbound", label: "ورودی کالا", icon: IconPackageImport },
      { id: "outbound", label: "ارسال و تحویل", icon: IconPackageExport },
    ],
  },
  {
    id: "inventory",
    title: "انبار و موجودی",
    description: "کنترل دقیق موجودی کالاها",
    icon: IconBuildingWarehouse,
    accent: "from-emerald-50 to-green-50 text-emerald-700",
    submenus: [
      { id: "stock", label: "موجودی لحظه‌ای", icon: IconBuildingWarehouse },
      { id: "counting", label: "انبارگردانی", icon: IconChecklist },
      { id: "reserved", label: "رزرو قطعات پروژه", icon: IconPackageExport },
    ],
  },
  {
    id: "sales",
    title: "فروش",
    description: "مدیریت چرخه کامل فروش",
    icon: IconShoppingCart,
    accent: "from-rose-50 to-pink-50 text-rose-700",
    submenus: [
      { id: "quotes", label: "پیش‌فاکتور و پیشنهاد قیمت", icon: IconFileInvoice },
      { id: "orders", label: "سفارش فروش", icon: IconShoppingCartPlus },
      { id: "approvals", label: "تاییدیه‌های فروش", icon: IconChecklist },
    ],
  },
  {
    id: "marketing",
    title: "بازاریابی",
    description: "کمپین‌ها و جذب مشتری",
    icon: IconSpeakerphone,
    accent: "from-purple-50 to-fuchsia-50 text-purple-700",
    submenus: [
      { id: "campaigns", label: "کمپین‌ها", icon: IconSpeakerphone },
      { id: "leads", label: "سرنخ‌ها", icon: IconTargetArrow },
      { id: "channels", label: "کانال‌های جذب", icon: IconChartBar },
    ],
  },
  {
    id: "procurement",
    title: "خرید",
    description: "مدیریت تأمین کالا و خدمات",
    icon: IconShoppingBag,
    accent: "from-lime-50 to-emerald-50 text-lime-700",
    submenus: [
      { id: "requests", label: "درخواست خرید", icon: IconShoppingBag },
      { id: "purchase-orders", label: "سفارش خرید", icon: IconShoppingBagCheck },
      { id: "supplier-invoices", label: "فاکتور تأمین‌کننده", icon: IconFileInvoice },
    ],
  },
  {
    id: "project-management",
    title: "مدیریت پروژه",
    description: "برنامه‌ریزی و اجرای پروژه‌ها",
    icon: IconTimelineEvent,
    accent: "from-slate-50 to-zinc-50 text-slate-700",
    submenus: [
      { id: "planning", label: "برنامه زمان‌بندی", icon: IconTimelineEvent },
      { id: "tasks", label: "وظایف و فعالیت‌ها", icon: IconClipboardList },
      { id: "milestones", label: "مایلستون‌ها", icon: IconTargetArrow },
    ],
  },
  {
    id: "bi",
    title: "هوش تجاری",
    description: "تحلیل داده‌ها و گزارش‌های مدیریتی",
    icon: IconChartPie,
    accent: "from-blue-50 to-cyan-50 text-blue-700",
    submenus: [
      { id: "reports", label: "گزارش‌های مدیریتی", icon: IconReportAnalytics, href: "/reports", permission: PermissionKeys.ReportsView },
      { id: "data-quality", label: "کیفیت داده", icon: IconFileAnalytics },
    ],
  },
  {
    id: "after-sales",
    title: "خدمات پس از فروش",
    description: "پشتیبانی و گارانتی",
    icon: IconHeadset,
    accent: "from-cyan-50 to-teal-50 text-cyan-700",
    submenus: [
      { id: "tickets", label: "تیکت‌های پشتیبانی", icon: IconHeadset },
      { id: "warranty", label: "گارانتی و سرویس", icon: IconTool },
      { id: "field-service", label: "اعزام تکنسین", icon: IconTruckDelivery },
    ],
  },
] satisfies ErpModuleItem[];
