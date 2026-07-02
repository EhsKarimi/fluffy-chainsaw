import { Card, Group, Progress, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { SharedTexts } from "@/shared/constants/SharedTexts";

export const Route = createFileRoute("/reports")({
  component: ReportsRoute,
});

const mockReports = [
  { title: "نرخ تبدیل مشتری به پروژه", value: "۶۲٪", progress: 62 },
  { title: "پروژه‌های تایید شده فروش", value: "۴۱٪", progress: 41 },
  { title: "درخواست‌های نیازمند بازدید", value: "۷۳٪", progress: 73 },
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
    <Stack gap="lg" dir="rtl">
      <div>
        <Title order={1}>{SharedTexts.Navigation.Reports}</Title>
        <Text c="dimmed" mt={6}>
          گزارش‌های نمونه برای نمایش تفاوت دسترسی کاربران.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {mockReports.map((report) => (
          <Card key={report.title} radius="xl" padding="xl" shadow="sm" className="border border-slate-200 bg-white">
            <Group justify="space-between" mb="lg">
              <Text fw={700}>{report.title}</Text>
              <Title order={3}>{report.value}</Title>
            </Group>
            <Progress value={report.progress} radius="xl" />
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
