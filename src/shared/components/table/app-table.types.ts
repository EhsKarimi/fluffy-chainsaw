import { type OnChangeFn, type SortingState } from "@tanstack/react-table";
import { type ReactNode } from "react";

export type AppTableAlign = "start" | "center" | "end";
export type AppTablePaginationMode = "client" | "server";
export type AppTableSortingMode = "client" | "server";
export type AppTableRowKey<TData> = keyof TData | ((record: TData) => number | string);

export type AppTableBaseColumnConfig = {
  align?: AppTableAlign;
  cellClassName?: string;
  ellipsis?: boolean;
  headerClassName?: string;
  minWidth?: number | string;
  sortable?: boolean;
  title: ReactNode;
  width?: number | string;
};

export type AppTableFieldColumnConfig<TData, TKey extends keyof TData> = AppTableBaseColumnConfig & {
  render?: (value: TData[TKey], record: TData, index: number) => ReactNode;
};

export type AppTableComputedColumnConfig<TData, TValue> = AppTableBaseColumnConfig & {
  render?: (value: TValue, record: TData, index: number) => ReactNode;
};

export type AppTableDisplayColumnConfig<TData> = Omit<AppTableBaseColumnConfig, "sortable"> & {
  render: (record: TData, index: number) => ReactNode;
};

export type AppTableFieldColumn<TData> = AppTableBaseColumnConfig & {
  dataIndex: keyof TData;
  id: string;
  kind: "field";
  render?: (value: unknown, record: TData, index: number) => ReactNode;
};

export type AppTableComputedColumn<TData> = AppTableBaseColumnConfig & {
  compute: (record: TData, index: number) => unknown;
  id: string;
  kind: "computed";
  render?: (value: unknown, record: TData, index: number) => ReactNode;
};

export type AppTableDisplayColumn<TData> = AppTableDisplayColumnConfig<TData> & {
  id: string;
  kind: "display";
  sortable?: false;
};

export type AppTableColumn<TData> = AppTableFieldColumn<TData> | AppTableComputedColumn<TData> | AppTableDisplayColumn<TData>;
export type AppTableColumnList<TData> = readonly AppTableColumn<TData>[];

export function createAppTableColumns<TData extends object>() {
  return {
    field<TKey extends keyof TData>(dataIndex: TKey, config: AppTableFieldColumnConfig<TData, TKey>): AppTableFieldColumn<TData> {
      return {
        ...config,
        dataIndex,
        id: String(dataIndex),
        kind: "field",
        render: config.render as ((value: unknown, record: TData, index: number) => ReactNode) | undefined,
      };
    },

    computed<TValue>(
      id: string,
      compute: (record: TData, index: number) => TValue,
      config: AppTableComputedColumnConfig<TData, TValue>,
    ): AppTableComputedColumn<TData> {
      return {
        ...config,
        compute,
        id,
        kind: "computed",
        render: config.render as ((value: unknown, record: TData, index: number) => ReactNode) | undefined,
      };
    },

    display(id: string, config: AppTableDisplayColumnConfig<TData>): AppTableDisplayColumn<TData> {
      return {
        ...config,
        id,
        kind: "display",
        sortable: false,
      };
    },
  };
}

export type AppTableRowAction<TData> = {
  ariaLabel?: string;
  color?: string;
  disabled?: boolean | ((record: TData) => boolean);
  hidden?: boolean | ((record: TData) => boolean);
  icon: ReactNode;
  key: string;
  label: string;
  onClick?: (record: TData) => void;
  params?: (record: TData) => Record<string, string>;
  search?: (record: TData) => Record<string, unknown>;
  to?: string;
  variant?: "filled" | "light" | "outline" | "subtle" | "transparent" | "white";
};

export type AppTableSorting = {
  mode?: AppTableSortingMode;
  onChange?: OnChangeFn<SortingState>;
  value: SortingState;
};

export type AppTableRowActions<TData> = {
  align?: AppTableAlign;
  columnKey?: string;
  items: AppTableRowAction<TData>[];
  title?: ReactNode;
  width?: number | string;
};

export type AppTablePagination = {
  disabled?: boolean;
  mode?: AppTablePaginationMode;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  page: number;
  pageSize: number;
  pageSizeOptions?: readonly number[];
  totalItems?: number;
};
