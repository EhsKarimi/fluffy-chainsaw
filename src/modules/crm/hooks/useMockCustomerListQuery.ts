import { useMemo } from "react";

import { type CustomerListFilterValues } from "@/modules/crm/types/customer-filter.types";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { filterCustomers } from "@/modules/crm/utils/customer-filtering";
import { type CustomerListSortKey, customerListSortAccessors } from "@/modules/crm/utils/customer-list-search";
import { type AppListSorting, paginateAppListRecords, sortAppListRecords } from "@/shared/list-state";

export function useMockCustomerListQuery({
  customers,
  filters,
  page,
  pageSize,
  sorting,
}: {
  customers: readonly CustomerRecord[];
  filters: CustomerListFilterValues;
  page: number;
  pageSize: number;
  sorting: AppListSorting<CustomerListSortKey>;
}) {
  const filteredRows = useMemo(() => filterCustomers(customers, filters), [customers, filters]);
  const sortedRows = useMemo(
    () =>
      sortAppListRecords({
        records: filteredRows,
        sortAccessors: customerListSortAccessors,
        sorting,
      }),
    [filteredRows, sorting],
  );
  const rows = useMemo(() => paginateAppListRecords({ page, pageSize, records: sortedRows }), [page, pageSize, sortedRows]);

  return {
    exportRows: sortedRows,
    rows,
    totalItems: sortedRows.length,
  };
}
