import { Loader, Skeleton } from "@mantine/core";

import { SharedTexts } from "@/shared/constants/SharedTexts";

const FILTER_SKELETON_WIDTHS = ["32%", "24%", "28%"] as const;
const TABLE_SKELETON_ROWS = Array.from({ length: 6 }, (_, index) => index);
const TABLE_SKELETON_COLUMNS = Array.from({ length: 5 }, (_, index) => index);

export function AppRoutePending() {
  return (
    <div className="space-y-6" dir="rtl" role="status" aria-live="polite" aria-label={SharedTexts.Table.Loading}>
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <Skeleton height={24} radius="xl" width={220} />
          <Skeleton height={12} radius="xl" width={320} maw="100%" />
        </div>

        <div className="border-atisCyan-100 bg-atisCyan-50 text-atisCyan-800 flex items-center gap-3 self-start rounded-2xl border px-4 py-3 text-sm font-bold md:self-auto">
          <Loader size="sm" />
          <span>{SharedTexts.Table.Loading}</span>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          {FILTER_SKELETON_WIDTHS.map((width) => (
            <div key={width} className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <Skeleton height={10} radius="xl" width={width} />
              <Skeleton height={34} radius="xl" />
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton height={16} radius="xl" width={180} />
          <Skeleton height={34} radius="xl" width={120} />
        </div>

        <div className="space-y-3">
          {TABLE_SKELETON_ROWS.map((rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {TABLE_SKELETON_COLUMNS.map((columnIndex) => (
                <Skeleton key={columnIndex} height={38} radius="xl" />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
