import { Button, Card, Group, Stack, Table, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { useAuth } from "@/modules/auth/context/useAuth";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
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
    units: "۲ دستگاه",
    stops: "۱۲ توقف",
    speed: "۱.۶ متر بر ثانیه",
    capacity: "۱۰ نفره",
    phase: "پیشنهاد فنی",
    salesExpert: "کارشناس فروش آتیس",
    visitDate: "۱۴۰۳/۰۷/۱۸",
    deadline: "۱۴۰۳/۰۸/۰۵",
    estimatedBudget: "۴.۸ میلیارد تومان",
  },
  {
    id: "P-2102",
    name: "مرکز درمانی سلامت",
    customer: "بیمارستان آتیه",
    type: "گیرلس با موتورخانه ام‌آر",
    usage: "بیمارستانی تخت‌بر",
    units: "۱ دستگاه",
    stops: "۸ توقف",
    speed: "۱ متر بر ثانیه",
    capacity: "۱۶۰۰ کیلوگرم",
    phase: "بازدید انجام شد",
    salesExpert: "مدیر فروش",
    visitDate: "۱۴۰۳/۰۷/۱۵",
    deadline: "۱۴۰۳/۰۷/۳۰",
    estimatedBudget: "۳.۹ میلیارد تومان",
  },
  {
    id: "P-2103",
    name: "پارکینگ طبقاتی ونک",
    customer: "مجتمع تجاری نگین",
    type: "هیدرولیک",
    usage: "خودروبر",
    units: "۱ دستگاه",
    stops: "۵ توقف",
    speed: "۰.۶۳ متر بر ثانیه",
    capacity: "۳۰۰۰ کیلوگرم",
    phase: "در انتظار تایید قیمت",
    salesExpert: "کارشناس فروش آتیس",
    visitDate: "۱۴۰۳/۰۷/۰۹",
    deadline: "۱۴۰۳/۰۸/۰۲",
    estimatedBudget: "۲.۷ میلیارد تومان",
  },
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
    <Stack gap="lg" dir="rtl">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>{SharedTexts.Navigation.Projects}</Title>
          <Text c="dimmed" mt={6}>
            {CrmTexts.Projects.PageDescription}
          </Text>
        </div>
        {canCreateProject ? <Button leftSection={<IconPlus size={18} />}>{CrmTexts.Projects.NewProjectButton}</Button> : null}
      </Group>

      <Card radius="xl" padding="lg" shadow="sm" className="border border-slate-200 bg-white">
        <Table.ScrollContainer minWidth={1320}>
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="whitespace-nowrap">{CrmTexts.Projects.Table.ProjectCode}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.ProjectName}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.EmployerName}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.ElevatorType.Label}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.UsageType.Label}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.NumberOfUnits}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.NumberOfStops}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.ElevatorSpeed}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.Capacity}</Table.Th>
                <Table.Th className="whitespace-nowrap">{CrmTexts.Projects.Table.CurrentPhase}</Table.Th>
                <Table.Th className="whitespace-nowrap">{CrmTexts.Projects.Table.SalesExpert}</Table.Th>
                <Table.Th className="whitespace-nowrap">{SharedTexts.VisitDate.Label}</Table.Th>
                <Table.Th className="whitespace-nowrap">{CrmTexts.Projects.Table.NextDeadline}</Table.Th>
                <Table.Th className="whitespace-nowrap">{CrmTexts.Projects.Table.EstimatedBudget}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {mockProjects.map((project) => (
                <Table.Tr key={project.id}>
                  <Table.Td>{project.id}</Table.Td>
                  <Table.Td fw={700}>{project.name}</Table.Td>
                  <Table.Td>{project.customer}</Table.Td>
                  <Table.Td>{project.type}</Table.Td>
                  <Table.Td>{project.usage}</Table.Td>
                  <Table.Td>{project.units}</Table.Td>
                  <Table.Td>
                    <AppBadge>{project.stops}</AppBadge>
                  </Table.Td>
                  <Table.Td>{project.speed}</Table.Td>
                  <Table.Td>{project.capacity}</Table.Td>
                  <Table.Td>
                    <AppBadge>{project.phase}</AppBadge>
                  </Table.Td>
                  <Table.Td>{project.salesExpert}</Table.Td>
                  <Table.Td>{project.visitDate}</Table.Td>
                  <Table.Td>{project.deadline}</Table.Td>
                  <Table.Td>{project.estimatedBudget}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </Stack>
  );
}
