import { type CustomerListFilterValues } from "@/modules/crm/types/customer-filter.types";
import { type CustomerPriority, type CustomerRecord, type CustomerStatus } from "@/modules/crm/types/customer.types";
import { defaultCustomerListFilterValues } from "@/modules/crm/utils/customer-filtering";
import {
  type AppListRouteState,
  type AppListSortAccessors,
  type AppListSorting,
  addSearchValue,
  getStringSearchValue,
  parseAppListSorting,
  serializeAppListSorting,
  validateAppListBaseSearch,
  writeAppListBaseSearch,
} from "@/shared/list-state";
import { getCountyName, getProvinceName } from "@/shared/utils/iran-location";

export type CustomerRouteSearch = {
  p?: number;
  ps?: number;
  sort?: string;
  q?: string;
  pr?: string;
  c?: string;
  st?: CustomerStatus;
  py?: CustomerPriority;
  so?: string;
  se?: string;
  et?: string;
  ut?: string;
  env?: string;
  nsf?: string;
  nst?: string;
  nuf?: string;
  nut?: string;
  vf?: string;
  vt?: string;
  lcf?: string;
  lct?: string;
  ev?: string;
};

export const customerListPageSizeOptions = [10, 20, 50, 100] as const;
export const customerListSortKeys = [
  "id",
  "employerName",
  "requesterName",
  "provinceId",
  "countyId",
  "projectName",
  "salesExpert",
  "priority",
  "lastContact",
  "status",
] as const;
export type CustomerListSortKey = (typeof customerListSortKeys)[number];
export type CustomerListRouteState = AppListRouteState<CustomerListFilterValues, CustomerListSortKey>;

const customerStatuses = ["new", "negotiating", "visited", "needsFollowUp", "proposalSent"] as const;
const customerPriorities = ["low", "medium", "high", "urgent"] as const;
const defaultCustomerListSorting: AppListSorting<CustomerListSortKey> = [{ id: "id", desc: true }];

export const customerListSortAccessors: AppListSortAccessors<CustomerRecord, CustomerListSortKey> = {
  id: (customer) => customer.id,
  employerName: (customer) => customer.employerName,
  requesterName: (customer) => customer.requesterName,
  provinceId: (customer) => getProvinceName(customer.provinceId),
  countyId: (customer) => getCountyName(customer.countyId),
  projectName: (customer) => customer.projectName,
  salesExpert: (customer) => customer.salesExpert,
  priority: (customer) => customer.priority,
  lastContact: (customer) => customer.lastContact,
  status: (customer) => customer.status,
};

function getStatusSearchValue(value: unknown): CustomerStatus | "" {
  return customerStatuses.includes(value as CustomerStatus) ? (value as CustomerStatus) : "";
}

function getPrioritySearchValue(value: unknown): CustomerPriority | "" {
  return customerPriorities.includes(value as CustomerPriority) ? (value as CustomerPriority) : "";
}

export function validateCustomerSearch(search: Record<string, unknown>): CustomerRouteSearch {
  const baseSearch = validateAppListBaseSearch(search, {
    defaultValidationPageSize: customerListPageSizeOptions[0],
    pageSizeOptions: customerListPageSizeOptions,
  });
  const sorting = parseAppListSorting({
    allowedSortIds: customerListSortKeys,
    defaultSorting: defaultCustomerListSorting,
    value: search.sort,
  });
  const validatedSearch: CustomerRouteSearch = { ...baseSearch };
  const serializedSorting = serializeAppListSorting({ defaultSorting: defaultCustomerListSorting, sorting });

  if (serializedSorting) {
    validatedSearch.sort = serializedSorting;
  } else {
    delete validatedSearch.sort;
  }

  addSearchValue(validatedSearch, "q", getStringSearchValue(search.q));
  addSearchValue(validatedSearch, "pr", getStringSearchValue(search.pr));
  addSearchValue(validatedSearch, "c", getStringSearchValue(search.c));
  addSearchValue(validatedSearch, "st", getStatusSearchValue(search.st));
  addSearchValue(validatedSearch, "py", getPrioritySearchValue(search.py));
  addSearchValue(validatedSearch, "so", getStringSearchValue(search.so));
  addSearchValue(validatedSearch, "se", getStringSearchValue(search.se));
  addSearchValue(validatedSearch, "et", getStringSearchValue(search.et));
  addSearchValue(validatedSearch, "ut", getStringSearchValue(search.ut));
  addSearchValue(validatedSearch, "env", getStringSearchValue(search.env));
  addSearchValue(validatedSearch, "nsf", getStringSearchValue(search.nsf));
  addSearchValue(validatedSearch, "nst", getStringSearchValue(search.nst));
  addSearchValue(validatedSearch, "nuf", getStringSearchValue(search.nuf));
  addSearchValue(validatedSearch, "nut", getStringSearchValue(search.nut));
  addSearchValue(validatedSearch, "vf", getStringSearchValue(search.vf));
  addSearchValue(validatedSearch, "vt", getStringSearchValue(search.vt));
  addSearchValue(validatedSearch, "lcf", getStringSearchValue(search.lcf));
  addSearchValue(validatedSearch, "lct", getStringSearchValue(search.lct));
  addSearchValue(validatedSearch, "ev", getStringSearchValue(search.ev));

  return validatedSearch;
}

export function getCustomerListRouteState(search: CustomerRouteSearch, defaultPageSize: number): CustomerListRouteState {
  return {
    page: search.p ?? 1,
    pageSize: search.ps ?? defaultPageSize,
    sorting: parseAppListSorting({
      allowedSortIds: customerListSortKeys,
      defaultSorting: defaultCustomerListSorting,
      value: search.sort,
    }),
    filters: {
      query: search.q ?? defaultCustomerListFilterValues.query,
      provinceId: search.pr ?? defaultCustomerListFilterValues.provinceId,
      countyId: search.c ?? defaultCustomerListFilterValues.countyId,
      status: search.st ?? defaultCustomerListFilterValues.status,
      priority: search.py ?? defaultCustomerListFilterValues.priority,
      source: search.so ?? defaultCustomerListFilterValues.source,
      salesExpert: search.se ?? defaultCustomerListFilterValues.salesExpert,
      elevatorType: search.et ?? defaultCustomerListFilterValues.elevatorType,
      usageType: search.ut ?? defaultCustomerListFilterValues.usageType,
      environmentType: search.env ?? defaultCustomerListFilterValues.environmentType,
      numberOfStopsFrom: search.nsf ?? defaultCustomerListFilterValues.numberOfStopsFrom,
      numberOfStopsTo: search.nst ?? defaultCustomerListFilterValues.numberOfStopsTo,
      numberOfUnitsFrom: search.nuf ?? defaultCustomerListFilterValues.numberOfUnitsFrom,
      numberOfUnitsTo: search.nut ?? defaultCustomerListFilterValues.numberOfUnitsTo,
      visitDateFrom: search.vf ?? defaultCustomerListFilterValues.visitDateFrom,
      visitDateTo: search.vt ?? defaultCustomerListFilterValues.visitDateTo,
      lastContactFrom: search.lcf ?? defaultCustomerListFilterValues.lastContactFrom,
      lastContactTo: search.lct ?? defaultCustomerListFilterValues.lastContactTo,
      estimatedValueContains: search.ev ?? defaultCustomerListFilterValues.estimatedValueContains,
    },
  };
}

type CreateCustomerSearchParamsOptions = {
  defaultPageSize: number;
};

export function createCustomerSearchParams(routeState: CustomerListRouteState, options: CreateCustomerSearchParamsOptions): CustomerRouteSearch {
  const { filters, page, pageSize, sorting } = routeState;
  const search: CustomerRouteSearch = {};

  writeAppListBaseSearch({
    defaultPageSize: options.defaultPageSize,
    page,
    pageSize,
    search,
    serializedSorting: serializeAppListSorting({ defaultSorting: defaultCustomerListSorting, sorting }),
  });

  addSearchValue(search, "q", filters.query.trim());
  addSearchValue(search, "pr", filters.provinceId.trim());
  addSearchValue(search, "c", filters.countyId.trim());
  addSearchValue(search, "st", filters.status);
  addSearchValue(search, "py", filters.priority);
  addSearchValue(search, "so", filters.source.trim());
  addSearchValue(search, "se", filters.salesExpert.trim());
  addSearchValue(search, "et", filters.elevatorType.trim());
  addSearchValue(search, "ut", filters.usageType.trim());
  addSearchValue(search, "env", filters.environmentType.trim());
  addSearchValue(search, "nsf", filters.numberOfStopsFrom.trim());
  addSearchValue(search, "nst", filters.numberOfStopsTo.trim());
  addSearchValue(search, "nuf", filters.numberOfUnitsFrom.trim());
  addSearchValue(search, "nut", filters.numberOfUnitsTo.trim());
  addSearchValue(search, "vf", filters.visitDateFrom.trim());
  addSearchValue(search, "vt", filters.visitDateTo.trim());
  addSearchValue(search, "lcf", filters.lastContactFrom.trim());
  addSearchValue(search, "lct", filters.lastContactTo.trim());
  addSearchValue(search, "ev", filters.estimatedValueContains.trim());

  return search;
}

export const customerListRouteConfig = {
  allowedSortIds: customerListSortKeys,
  createSearch: createCustomerSearchParams,
  getState: getCustomerListRouteState,
  pageSizeOptions: customerListPageSizeOptions,
};
