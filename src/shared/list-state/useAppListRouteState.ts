import { useNavigate } from "@tanstack/react-router";
import { type OnChangeFn, type SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo } from "react";

import { type AppTablePagination, type AppTableSorting } from "@/shared/components/table";
import { saveLatestAppListReturnLocation } from "@/shared/list-state/app-list-return-location";
import { toAppListSorting, toTableSorting } from "@/shared/list-state/app-list-sorting";
import { type AppListRouteState } from "@/shared/list-state/app-list-types";

function resolveSortingUpdate(updater: SortingState | ((old: SortingState) => SortingState), currentSorting: SortingState): SortingState {
  return typeof updater === "function" ? updater(currentSorting) : updater;
}

export type AppListRouteConfig<TSearch extends object, TFilters, TSortKey extends string> = {
  allowedSortIds: readonly TSortKey[];
  createSearch: (state: AppListRouteState<TFilters, TSortKey>, options: { defaultPageSize: number }) => TSearch;
  getState: (search: TSearch, defaultPageSize: number) => AppListRouteState<TFilters, TSortKey>;
  maxSortItems?: number;
  pageSizeOptions?: readonly number[];
};

type AppListRouteUpdateOptions = {
  replace?: boolean;
};

export function useAppListRouteController<TSearch extends object, TFilters, TSortKey extends string>({
  config,
  defaultPageSize,
  search,
  to,
}: {
  config: AppListRouteConfig<TSearch, TFilters, TSortKey>;
  defaultPageSize: number;
  search: TSearch;
  to: string;
}) {
  const navigate = useNavigate();
  const state = useMemo(() => config.getState(search, defaultPageSize), [config, defaultPageSize, search]);
  const tableSorting = useMemo(() => toTableSorting(state.sorting), [state.sorting]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    saveLatestAppListReturnLocation({ pathname: to, search: window.location.search });
  }, [search, to]);

  const changeState = useCallback(
    (nextState: AppListRouteState<TFilters, TSortKey>, options?: AppListRouteUpdateOptions) => {
      void navigate({
        to: to as never,
        replace: options?.replace,
        search: config.createSearch(nextState, { defaultPageSize }) as never,
      });
    },
    [config, defaultPageSize, navigate, to],
  );

  const applyFilters = useCallback(
    (nextFilters: TFilters) => {
      changeState({ ...state, filters: nextFilters, page: 1 });
    },
    [changeState, state],
  );

  const changePage = useCallback(
    (nextPage: number) => {
      changeState({ ...state, page: nextPage });
    },
    [changeState, state],
  );

  const replacePage = useCallback(
    (nextPage: number) => {
      changeState({ ...state, page: nextPage }, { replace: true });
    },
    [changeState, state],
  );

  const changePageSize = useCallback(
    (nextPageSize: number) => {
      changeState({ ...state, page: 1, pageSize: nextPageSize });
    },
    [changeState, state],
  );

  const changeSorting = useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      const nextTableSorting = resolveSortingUpdate(updater, tableSorting);
      const nextSorting = toAppListSorting({
        allowedSortIds: config.allowedSortIds,
        maxSortItems: config.maxSortItems,
        sorting: nextTableSorting,
      });

      changeState({ ...state, page: 1, sorting: nextSorting });
    },
    [changeState, config.allowedSortIds, config.maxSortItems, state, tableSorting],
  );

  const createPagination = useCallback(
    (totalItems: number): AppTablePagination => ({
      mode: "server",
      page: state.page,
      pageSize: state.pageSize,
      pageSizeOptions: config.pageSizeOptions,
      totalItems,
      onPageChange: changePage,
      onPageSizeChange: changePageSize,
    }),
    [changePage, changePageSize, config.pageSizeOptions, state.page, state.pageSize],
  );

  const tableSortingConfig = useMemo<AppTableSorting>(
    () => ({
      mode: "server",
      value: tableSorting,
      onChange: changeSorting,
    }),
    [changeSorting, tableSorting],
  );

  return {
    ...state,
    applyFilters,
    changePage,
    changePageSize,
    changeSorting,
    createPagination,
    replacePage,
    tableSorting: tableSortingConfig,
  };
}
