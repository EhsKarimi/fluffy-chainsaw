import { ActionIcon, Loader, Tooltip } from "@mantine/core";
import { IconArrowsSort, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type CSSProperties, type ReactNode, useMemo, useState } from "react";

import { AppPagination } from "@/shared/components/ui/AppPagination";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { cn } from "@/shared/utils/style";

import {
  type AppTableBaseColumnConfig,
  type AppTableColumn,
  type AppTableColumnList,
  type AppTablePagination,
  type AppTableRowActions,
  type AppTableRowKey,
  type AppTableSorting,
} from "./app-table.types";

type AppTableProps<TData extends object> = {
  className?: string;
  columns: AppTableColumnList<TData>;
  dataSource: readonly TData[];
  emptyText?: ReactNode;
  highlightOnHover?: boolean;
  loading?: boolean;
  minWidth?: number;
  pagination?: AppTablePagination;
  rowActions?: AppTableRowActions<TData>;
  rowKey: AppTableRowKey<TData>;
  sorting?: AppTableSorting;
  striped?: boolean;
  stickyHeader?: boolean;
  tableClassName?: string;
  withColumnBorders?: boolean;
};

type ColumnVisualConfig = Pick<AppTableBaseColumnConfig, "align" | "cellClassName" | "ellipsis" | "headerClassName" | "minWidth" | "width">;

function getColumnId<TData>(column: AppTableColumn<TData>): string {
  return column.id;
}

function getSizedStyle(config?: Pick<ColumnVisualConfig, "minWidth" | "width">): CSSProperties | undefined {
  if (!config?.width && !config?.minWidth) {
    return undefined;
  }

  const style: CSSProperties = {};

  if (config.width) {
    style.width = config.width;
  }

  if (config.minWidth) {
    style.minWidth = config.minWidth;
  }

  return style;
}

function renderDefaultCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? SharedTexts.Common.Yes : SharedTexts.Common.No;
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join("، ") : "—";
  }

  return String(value);
}

function getRowKey<TData extends object>(rowKey: AppTableRowKey<TData>, record: TData, index: number) {
  if (typeof rowKey === "function") {
    return String(rowKey(record));
  }

  const value = record[rowKey];

  return value === null || value === undefined ? String(index) : String(value);
}

function getActionVisibility<TData extends object>(value: boolean | ((record: TData) => boolean) | undefined, record: TData) {
  return typeof value === "function" ? value(record) : Boolean(value);
}

function getSortIcon(sortState: false | "asc" | "desc") {
  if (sortState === "asc") {
    return <IconSortAscending size={15} />;
  }

  if (sortState === "desc") {
    return <IconSortDescending size={15} />;
  }

  return <IconArrowsSort size={15} />;
}

function getTextAlignClass(align: ColumnVisualConfig["align"]) {
  if (align === "center") {
    return "text-center";
  }

  if (align === "end") {
    return "text-end";
  }

  return "text-start";
}

export function AppTable<TData extends object>({
  className,
  columns,
  dataSource,
  emptyText = SharedTexts.Table.EmptyState,
  highlightOnHover = true,
  loading = false,
  minWidth = 960,
  pagination,
  rowActions,
  rowKey,
  sorting,
  striped = false,
  stickyHeader = false,
  tableClassName,
  withColumnBorders = false,
}: AppTableProps<TData>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const sortingState = sorting?.value ?? internalSorting;
  const handleSortingChange = sorting?.onChange ?? setInternalSorting;
  const shouldUseClientSorting = (sorting?.mode ?? "client") === "client";
  const shouldUseClientPagination = Boolean(pagination && (pagination.mode ?? "client") === "client");
  const paginationState = useMemo<PaginationState | undefined>(() => {
    if (!pagination || !shouldUseClientPagination) {
      return undefined;
    }

    return {
      pageIndex: Math.max(0, pagination.page - 1),
      pageSize: pagination.pageSize,
    };
  }, [pagination, shouldUseClientPagination]);

  const visualConfigByColumnId = useMemo(() => {
    const configMap = new Map<string, ColumnVisualConfig>();

    for (const column of columns) {
      configMap.set(getColumnId(column), column);
    }

    if (rowActions) {
      configMap.set(rowActions.columnKey ?? "__actions", {
        align: rowActions.align ?? "center",
        width: rowActions.width ?? 112,
      });
    }

    return configMap;
  }, [columns, rowActions]);

  const tableColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    const mappedColumns: ColumnDef<TData, unknown>[] = columns.map((column) => {
      const columnId = getColumnId(column);

      if (column.kind === "field") {
        return {
          id: columnId,
          accessorFn: (record) => record[column.dataIndex],
          enableMultiSort: true,
          enableSorting: Boolean(column.sortable),
          header: () => column.title,
          cell: (cellContext) => {
            const value = cellContext.getValue();

            if (column.render) {
              return column.render(value, cellContext.row.original, cellContext.row.index);
            }

            return renderDefaultCellValue(value);
          },
        };
      }

      if (column.kind === "computed") {
        return {
          id: columnId,
          accessorFn: (record, index) => column.compute(record, index),
          enableMultiSort: true,
          enableSorting: Boolean(column.sortable),
          header: () => column.title,
          cell: (cellContext) => {
            const value = cellContext.getValue();

            if (column.render) {
              return column.render(value, cellContext.row.original, cellContext.row.index);
            }

            return renderDefaultCellValue(value);
          },
        };
      }

      return {
        id: columnId,
        enableSorting: false,
        header: () => column.title,
        cell: (cellContext) => column.render(cellContext.row.original, cellContext.row.index),
      };
    });

    if (rowActions?.items.length) {
      mappedColumns.push({
        id: rowActions.columnKey ?? "__actions",
        enableSorting: false,
        header: () => rowActions.title ?? SharedTexts.Table.Actions,
        cell: (cellContext) => {
          const visibleActions = rowActions.items.filter((action) => !getActionVisibility(action.hidden, cellContext.row.original));

          if (visibleActions.length === 0) {
            return null;
          }

          return (
            <div className="flex flex-nowrap items-center justify-center gap-2">
              {visibleActions.map((action) => {
                const record = cellContext.row.original;
                const disabled = getActionVisibility(action.disabled, record);
                const actionIcon =
                  action.to && !disabled ? (
                    <ActionIcon
                      component={Link}
                      to={action.to as never}
                      params={action.params?.(record) as never}
                      search={action.search?.(record) as never}
                      aria-label={action.ariaLabel ?? action.label}
                      color={action.color ?? "atisCyan"}
                      radius="xl"
                      variant={action.variant ?? "subtle"}
                    >
                      {action.icon}
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      aria-label={action.ariaLabel ?? action.label}
                      color={action.color ?? "atisCyan"}
                      disabled={disabled}
                      radius="xl"
                      variant={action.variant ?? "subtle"}
                      onClick={() => action.onClick?.(record)}
                    >
                      {action.icon}
                    </ActionIcon>
                  );

                return (
                  <Tooltip key={action.key} label={action.label} withinPortal>
                    {actionIcon}
                  </Tooltip>
                );
              })}
            </div>
          );
        },
      });
    }

    return mappedColumns;
  }, [columns, rowActions]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is intentionally headless and returns table API functions.
  const table = useReactTable({
    columns: tableColumns,
    data: [...dataSource],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: shouldUseClientPagination ? getPaginationRowModel() : undefined,
    getRowId: (record, index) => getRowKey(rowKey, record, index),
    getSortedRowModel: shouldUseClientSorting ? getSortedRowModel() : undefined,
    manualPagination: pagination?.mode === "server",
    manualSorting: sorting?.mode === "server",
    onSortingChange: handleSortingChange,
    state: {
      sorting: sortingState,
      ...(paginationState ? { pagination: paginationState } : {}),
    },
    autoResetPageIndex: false,
    enableMultiSort: true,
  });

  const rows = table.getRowModel().rows;
  const totalItems = pagination?.totalItems ?? dataSource.length;
  const emptyColSpan = table.getVisibleFlatColumns().length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="atis-thin-scrollbar overflow-x-auto">
        <table
          className={cn("w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200 bg-white", tableClassName)}
          style={{ minWidth }}
        >
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnConfig = visualConfigByColumnId.get(header.column.id);
                  const canSort = header.column.getCanSort();
                  const sortState = header.column.getIsSorted();
                  const sortIndex = sortingState.findIndex((item) => item.id === header.column.id);

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "border-b border-slate-200 px-4 py-3 text-sm font-extrabold whitespace-nowrap text-slate-700",
                        stickyHeader && "sticky top-0 z-10 bg-slate-50",
                        withColumnBorders && "border-l border-slate-200",
                        getTextAlignClass(columnConfig?.align),
                        columnConfig?.headerClassName,
                      )}
                      style={getSizedStyle(columnConfig)}
                      scope="col"
                    >
                      {canSort ? (
                        <button
                          type="button"
                          className={cn(
                            "hover:text-atisCyan-700 focus:ring-atisCyan-200 inline-flex w-full items-center gap-1.5 rounded-md text-inherit transition focus:ring-2 focus:outline-none",
                            columnConfig?.align === "center" ? "justify-center" : columnConfig?.align === "end" ? "justify-end" : "justify-start",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            {getSortIcon(sortState)}
                            {sortingState.length > 1 && sortIndex >= 0 ? (
                              <span className="bg-atisCyan-50 text-atisCyan-700 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-extrabold">
                                {sortIndex + 1}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={emptyColSpan}>
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                    <Loader size="sm" />
                    <span>{SharedTexts.Table.Loading}</span>
                  </div>
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={cn(striped && rowIndex % 2 === 1 && "bg-slate-50/70", highlightOnHover && "hover:bg-atisCyan-50/50 transition-colors")}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnConfig = visualConfigByColumnId.get(cell.column.id);

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "border-b border-slate-100 px-4 py-3 align-middle text-sm text-slate-700 last:border-b-0",
                          withColumnBorders && "border-l border-slate-100",
                          getTextAlignClass(columnConfig?.align),
                          columnConfig?.ellipsis ? "max-w-72 truncate" : undefined,
                          columnConfig?.cellClassName,
                        )}
                        style={getSizedStyle(columnConfig)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={emptyColSpan} className="py-10 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <AppPagination
          disabled={pagination.disabled || loading}
          page={pagination.page}
          pageSize={pagination.pageSize}
          pageSizeOptions={pagination.pageSizeOptions}
          totalItems={totalItems}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      ) : null}
    </div>
  );
}
