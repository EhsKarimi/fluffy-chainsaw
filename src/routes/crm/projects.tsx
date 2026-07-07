import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { useAuth } from "@/modules/auth/context/useAuth";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { AppTable, createAppTableColumns } from "@/shared/components/table";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { SharedTexts } from "@/shared/constants/SharedTexts";

export const Route = createFileRoute("/crm/projects")({
  component: ProjectsRoute,
});

const mockProjects = [
  {
    id: "P-2101",
    name: "برج پارسه",
    customer: "شرکت عمران سپهر",
    type: "گیرلس بدون موتورخانه ام‌آر‌ال",
    usage: "مسافربر",
    units: "2 دستگاه",
    stops: "12 توقف",
    speed: "1.6 متر بر ثانیه",
    capacity: "10 نفره",
    phase: "پیشنهاد فنی",
    salesExpert: "کارشناس فروش آتیس",
    visitDate: "1403/07/18",
    deadline: "1403/08/05",
    estimatedBudget: "4.8 میلیارد تومان",
  },
  {
    id: "P-2102",
    name: "مرکز درمانی سلامت",
    customer: "بیمارستان آتیه",
    type: "گیرلس با موتورخانه ام‌آر",
    usage: "بیمارستانی تخت‌بر",
    units: "1 دستگاه",
    stops: "8 توقف",
    speed: "1 متر بر ثانیه",
    capacity: "1600 کیلوگرم",
    phase: "بازدید انجام شد",
    salesExpert: "مدیر فروش",
    visitDate: "1403/07/15",
    deadline: "1403/07/30",
    estimatedBudget: "3.9 میلیارد تومان",
  },
  {
    id: "P-2103",
    name: "پارکینگ طبقاتی ونک",
    customer: "مجتمع تجاری نگین",
    type: "هیدرولیک",
    usage: "خودروبر",
    units: "1 دستگاه",
    stops: "5 توقف",
    speed: "0.63 متر بر ثانیه",
    capacity: "3000 کیلوگرم",
    phase: "در انتظار تایید قیمت",
    salesExpert: "کارشناس فروش آتیس",
    visitDate: "1403/07/09",
    deadline: "1403/08/02",
    estimatedBudget: "2.7 میلیارد تومان",
  },
];

type ProjectRow = (typeof mockProjects)[number];

const projectColumn = createAppTableColumns<ProjectRow>();

const projectColumns = [
  projectColumn.field("id", { title: CrmTexts.Projects.Table.ProjectCode, width: 110, sortable: true }),
  projectColumn.field("name", { title: SharedTexts.ProjectName, width: 190, sortable: true, render: (value) => <strong>{value}</strong> }),
  projectColumn.field("customer", { title: SharedTexts.EmployerName, width: 190 }),
  projectColumn.field("type", { title: SharedTexts.ElevatorType.Label, width: 230 }),
  projectColumn.field("usage", { title: SharedTexts.UsageType.Label, width: 150 }),
  projectColumn.field("units", { title: SharedTexts.NumberOfUnits, width: 130 }),
  projectColumn.field("stops", { title: SharedTexts.NumberOfStops, width: 130, render: (value) => <AppBadge>{value}</AppBadge> }),
  projectColumn.field("speed", { title: SharedTexts.ElevatorSpeed, width: 150 }),
  projectColumn.field("capacity", { title: SharedTexts.Capacity, width: 150 }),
  projectColumn.field("phase", { title: CrmTexts.Projects.Table.CurrentPhase, width: 180, render: (value) => <AppBadge>{value}</AppBadge> }),
  projectColumn.field("salesExpert", { title: CrmTexts.Projects.Table.SalesExpert, width: 160 }),
  projectColumn.field("visitDate", { title: SharedTexts.VisitDate.Label, width: 140 }),
  projectColumn.field("deadline", { title: CrmTexts.Projects.Table.NextDeadline, width: 140 }),
  projectColumn.field("estimatedBudget", { title: CrmTexts.Projects.Table.EstimatedBudget, width: 180 }),
];

function ProjectsRoute() {
  return (
    <RequirePermission permission={PermissionKeys.CrmProjectsView}>
      <ProjectsPage />
    </RequirePermission>
  );
}

function ProjectsPage() {
  const { hasPermission } = useAuth();
  const canCreateProject = hasPermission(PermissionKeys.CrmProjectsCreate);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{SharedTexts.Navigation.Projects}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{CrmTexts.Projects.PageDescription}</p>
        </div>
        {canCreateProject ? <Button leftSection={<IconPlus size={18} />}>{CrmTexts.Projects.NewProjectButton}</Button> : null}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <AppTable columns={projectColumns} dataSource={mockProjects} minWidth={1320} rowKey="id" />
      </section>
    </div>
  );
}
