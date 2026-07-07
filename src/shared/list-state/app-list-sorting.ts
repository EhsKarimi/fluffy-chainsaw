import { type SortingState } from "@tanstack/react-table";

export type AppListSortDirection = "asc" | "desc";
export type AppListSortItem<TSortKey extends string = string> = {
  desc: boolean;
  id: TSortKey;
};
export type AppListSorting<TSortKey extends string = string> = readonly AppListSortItem<TSortKey>[];

const DEFAULT_SORT_PARAM_SEPARATOR = ",";
const DEFAULT_SORT_TOKEN_SEPARATOR = ":";
const EMPTY_SORT_PARAM_VALUE = "none";

function isSortKey<TSortKey extends string>(value: string, allowedSortIds: readonly TSortKey[]): value is TSortKey {
  return allowedSortIds.includes(value as TSortKey);
}

function getSortDirection(value: string): AppListSortDirection | undefined {
  if (value === "asc" || value === "desc") {
    return value;
  }

  return undefined;
}

function areSortingStatesEqual<TSortKey extends string>(firstSorting: AppListSorting<TSortKey>, secondSorting: AppListSorting<TSortKey>) {
  if (firstSorting.length !== secondSorting.length) {
    return false;
  }

  return firstSorting.every((item, index) => {
    const secondItem = secondSorting[index];
    return secondItem !== undefined && item.id === secondItem.id && item.desc === secondItem.desc;
  });
}

export function parseAppListSorting<TSortKey extends string>({
  allowedSortIds,
  defaultSorting,
  maxSortItems = 3,
  value,
}: {
  allowedSortIds: readonly TSortKey[];
  defaultSorting: AppListSorting<TSortKey>;
  maxSortItems?: number;
  value: unknown;
}): AppListSorting<TSortKey> {
  if (value === undefined || value === null || value === "") {
    return defaultSorting;
  }

  if (typeof value !== "string") {
    return defaultSorting;
  }

  const normalizedValue = value.trim();

  if (normalizedValue === EMPTY_SORT_PARAM_VALUE) {
    return [];
  }

  const nextSorting: AppListSortItem<TSortKey>[] = [];
  const usedSortIds = new Set<TSortKey>();

  for (const rawToken of normalizedValue.split(DEFAULT_SORT_PARAM_SEPARATOR)) {
    if (nextSorting.length >= maxSortItems) {
      break;
    }

    const [rawId, rawDirection] = rawToken.split(DEFAULT_SORT_TOKEN_SEPARATOR);
    const id = rawId?.trim() ?? "";
    const direction = getSortDirection(rawDirection?.trim() ?? "");

    if (!direction || !isSortKey(id, allowedSortIds) || usedSortIds.has(id)) {
      continue;
    }

    nextSorting.push({ id, desc: direction === "desc" });
    usedSortIds.add(id);
  }

  return nextSorting.length > 0 ? nextSorting : defaultSorting;
}

export function serializeAppListSorting<TSortKey extends string>({
  defaultSorting,
  sorting,
}: {
  defaultSorting: AppListSorting<TSortKey>;
  sorting: AppListSorting<TSortKey>;
}): string | undefined {
  if (sorting.length === 0) {
    return EMPTY_SORT_PARAM_VALUE;
  }

  if (areSortingStatesEqual(sorting, defaultSorting)) {
    return undefined;
  }

  return sorting.map((item) => `${item.id}${DEFAULT_SORT_TOKEN_SEPARATOR}${item.desc ? "desc" : "asc"}`).join(DEFAULT_SORT_PARAM_SEPARATOR);
}

export function toTableSorting<TSortKey extends string>(sorting: AppListSorting<TSortKey>): SortingState {
  return sorting.map((item) => ({ id: item.id, desc: item.desc }));
}

export function toAppListSorting<TSortKey extends string>({
  allowedSortIds,
  maxSortItems = 3,
  sorting,
}: {
  allowedSortIds: readonly TSortKey[];
  maxSortItems?: number;
  sorting: SortingState;
}): AppListSorting<TSortKey> {
  const nextSorting: AppListSortItem<TSortKey>[] = [];
  const usedSortIds = new Set<TSortKey>();

  for (const item of sorting) {
    if (nextSorting.length >= maxSortItems) {
      break;
    }

    if (!isSortKey(item.id, allowedSortIds) || usedSortIds.has(item.id)) {
      continue;
    }

    nextSorting.push({ id: item.id, desc: item.desc });
    usedSortIds.add(item.id);
  }

  return nextSorting;
}
