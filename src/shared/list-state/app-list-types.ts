import { type AppListSorting } from "@/shared/list-state/app-list-sorting";

export type AppListRouteState<TFilters, TSortKey extends string = string> = {
  filters: TFilters;
  page: number;
  pageSize: number;
  sorting: AppListSorting<TSortKey>;
};
