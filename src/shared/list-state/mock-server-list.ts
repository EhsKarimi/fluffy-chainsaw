import { type AppListSorting } from "@/shared/list-state/app-list-sorting";

export type AppListSortableValue = boolean | Date | number | string | null | undefined;
export type AppListSortAccessors<TData, TSortKey extends string> = Record<TSortKey, (record: TData) => AppListSortableValue>;

function normalizeSortableValue(value: AppListSortableValue) {
  if (value instanceof Date) {
    return value.getTime();
  }

  return value;
}

function compareSortableValues(firstValue: AppListSortableValue, secondValue: AppListSortableValue) {
  const firstNormalizedValue = normalizeSortableValue(firstValue);
  const secondNormalizedValue = normalizeSortableValue(secondValue);

  if (firstNormalizedValue === secondNormalizedValue) {
    return 0;
  }

  if (firstNormalizedValue === null || firstNormalizedValue === undefined || firstNormalizedValue === "") {
    return 1;
  }

  if (secondNormalizedValue === null || secondNormalizedValue === undefined || secondNormalizedValue === "") {
    return -1;
  }

  if (typeof firstNormalizedValue === "number" && typeof secondNormalizedValue === "number") {
    return firstNormalizedValue - secondNormalizedValue;
  }

  if (typeof firstNormalizedValue === "boolean" && typeof secondNormalizedValue === "boolean") {
    return Number(firstNormalizedValue) - Number(secondNormalizedValue);
  }

  return String(firstNormalizedValue).localeCompare(String(secondNormalizedValue), "fa-IR", { numeric: true, sensitivity: "base" });
}

export function sortAppListRecords<TData, TSortKey extends string>({
  records,
  sortAccessors,
  sorting,
}: {
  records: readonly TData[];
  sortAccessors: AppListSortAccessors<TData, TSortKey>;
  sorting: AppListSorting<TSortKey>;
}) {
  if (sorting.length === 0) {
    return [...records];
  }

  return records
    .map((record, originalIndex) => ({ record, originalIndex }))
    .sort((firstItem, secondItem) => {
      for (const sortItem of sorting) {
        const sortAccessor = sortAccessors[sortItem.id];
        const comparisonResult = compareSortableValues(sortAccessor(firstItem.record), sortAccessor(secondItem.record));

        if (comparisonResult !== 0) {
          return sortItem.desc ? -comparisonResult : comparisonResult;
        }
      }

      return firstItem.originalIndex - secondItem.originalIndex;
    })
    .map((item) => item.record);
}

export function paginateAppListRecords<TData>({ page, pageSize, records }: { page: number; pageSize: number; records: readonly TData[] }) {
  const startIndex = (page - 1) * pageSize;
  return records.slice(startIndex, startIndex + pageSize);
}
