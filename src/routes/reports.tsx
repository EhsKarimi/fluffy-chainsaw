import { Progress } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { SharedTexts } from "@/shared/constants/SharedTexts";

export const Route = createFileRoute("/reports")({
  component: ReportsRoute,
});

const mockReports = [
  { title: "نرخ تبدیل مشتری به پروژه", value: "62٪", progress: 62 },
  { title: "پروژه‌های تایید شده فروش", value: "41٪", progress: 41 },
  { title: "درخواست‌های نیازمند بازدید", value: "73٪", progress: 73 },
];

function ReportsRoute() {
  return (
    <RequirePermission permission={PermissionKeys.ReportsView}>
      <ReportsPage />
    </RequirePermission>
  );
}

function ReportsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{SharedTexts.Navigation.Reports}</h1>
        <p className="mt-1.5 text-sm text-slate-500">گزارش‌های نمونه برای نمایش تفاوت دسترسی کاربران.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {mockReports.map((report) => (
          <section key={report.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex justify-between gap-4">
              <p className="font-bold text-slate-900">{report.title}</p>
              <h3 className="text-xl font-extrabold text-slate-900">{report.value}</h3>
            </div>
            <Progress value={report.progress} radius="xl" />
          </section>
        ))}
      </div>
    </div>
  );
}
