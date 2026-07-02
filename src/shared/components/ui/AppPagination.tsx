import { Group, Pagination, Select, Text } from "@mantine/core";

import { SharedTexts } from "@/shared/constants/SharedTexts";

type AppPaginationProps = {
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  page: number;
  pageSize: number;
  pageSizeOptions?: readonly number[];
  totalItems: number;
};

function getSummaryText({ page, pageSize, totalItems }: Pick<AppPaginationProps, "page" | "pageSize" | "totalItems">) {
  if (totalItems <= 0) {
    return SharedTexts.Pagination.EmptySummary;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return SharedTexts.Pagination.SummaryTemplate.replace("{from}", String(from)).replace("{to}", String(to)).replace("{total}", String(totalItems));
}

function getPageItemAriaLabel(page: "dots" | number) {
  if (page === "dots") {
    return SharedTexts.Pagination.Dots;
  }

  return SharedTexts.Pagination.Page.replace("{page}", String(page));
}

function getPageControlAriaLabel(control: "first" | "last" | "next" | "previous") {
  if (control === "first") {
    return SharedTexts.Pagination.FirstPage;
  }

  if (control === "previous") {
    return SharedTexts.Pagination.PreviousPage;
  }

  if (control === "next") {
    return SharedTexts.Pagination.NextPage;
  }

  return SharedTexts.Pagination.LastPage;
}

export function AppPagination({
  disabled,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems,
}: AppPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageSizeSelectData = pageSizeOptions.map((option) => ({ value: String(option), label: String(option) }));

  return (
    <Group justify="space-between" align="center" gap="md" className="border-t border-slate-200 pt-4">
      <Text size="sm" c="dimmed">
        {getSummaryText({ page, pageSize, totalItems })}
      </Text>

      <Group gap="sm" justify="flex-end">
        {onPageSizeChange ? (
          <div className="flex items-center gap-2">
            <span>{SharedTexts.Pagination.PageSizeLabel}</span>
            <Select
              aria-label={SharedTexts.Pagination.PageSizeLabel}
              data={pageSizeSelectData}
              value={String(pageSize)}
              disabled={disabled}
              allowDeselect={false}
              w={130}
              comboboxProps={{ withinPortal: true }}
              onChange={(value) => {
                if (value) {
                  onPageSizeChange(Number(value));
                }
              }}
            />
          </div>
        ) : null}

        <Pagination
          aria-label={SharedTexts.Pagination.AriaLabel}
          total={totalPages}
          value={Math.min(page, totalPages)}
          disabled={disabled || totalItems <= 0}
          withEdges
          siblings={1}
          boundaries={1}
          getItemProps={(item) => ({ "aria-label": getPageItemAriaLabel(item) })}
          getControlProps={(control) => ({ "aria-label": getPageControlAriaLabel(control) })}
          onChange={onPageChange}
        />
      </Group>
    </Group>
  );
}
