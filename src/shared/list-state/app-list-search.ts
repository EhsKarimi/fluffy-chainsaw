export type AppListBaseSearch = {
  p?: number;
  ps?: number;
  sort?: string;
};

export type AppListSearchValidationOptions = {
  defaultValidationPageSize?: number;
  pageSizeOptions?: readonly number[];
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export function getStringSearchValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getPositiveIntegerSearchValue(value: unknown, fallback: number) {
  const numericValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

  return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : fallback;
}

export function getPageSizeSearchValue(value: unknown, options?: AppListSearchValidationOptions) {
  const pageSizeOptions = options?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const fallback = options?.defaultValidationPageSize ?? pageSizeOptions[0] ?? 10;
  const pageSize = getPositiveIntegerSearchValue(value, fallback);

  return pageSizeOptions.includes(pageSize) ? pageSize : fallback;
}

export function addSearchValue<TSearch extends object>(target: TSearch, key: keyof TSearch, value: string | number | undefined) {
  if (typeof value === "number") {
    target[key] = value as TSearch[keyof TSearch];
    return;
  }

  if (value) {
    target[key] = value as TSearch[keyof TSearch];
  }
}

export function validateAppListBaseSearch(search: Record<string, unknown>, options?: AppListSearchValidationOptions): AppListBaseSearch {
  const page = getPositiveIntegerSearchValue(search.p, 1);
  const pageSize = getPageSizeSearchValue(search.ps, options);
  const defaultValidationPageSize = options?.defaultValidationPageSize ?? options?.pageSizeOptions?.[0] ?? DEFAULT_PAGE_SIZE_OPTIONS[0];
  const validatedSearch: AppListBaseSearch = {};

  if (page > 1) {
    validatedSearch.p = page;
  }

  if (pageSize !== defaultValidationPageSize) {
    validatedSearch.ps = pageSize;
  }

  addSearchValue(validatedSearch, "sort", getStringSearchValue(search.sort));

  return validatedSearch;
}

export function writeAppListBaseSearch<TSearch extends AppListBaseSearch>({
  defaultPageSize,
  page,
  pageSize,
  search,
  serializedSorting,
}: {
  defaultPageSize: number;
  page: number;
  pageSize: number;
  search: TSearch;
  serializedSorting?: string;
}) {
  if (page > 1) {
    addSearchValue(search, "p", page);
  }

  if (pageSize !== defaultPageSize) {
    addSearchValue(search, "ps", pageSize);
  }

  addSearchValue(search, "sort", serializedSorting);
}
