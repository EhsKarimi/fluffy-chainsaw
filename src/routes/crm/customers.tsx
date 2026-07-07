import { Button } from "@mantine/core";
import { IconEdit, IconFileSpreadsheet, IconPlus, IconTrash } from "@tabler/icons-react";
import { Link, Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { useAuth } from "@/modules/auth/context/useAuth";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { CustomerListFilters } from "@/modules/crm/components/CustomerListFilters";
import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { useMockCustomerListQuery } from "@/modules/crm/hooks/useMockCustomerListQuery";
import { useStoredCustomers } from "@/modules/crm/hooks/useStoredCustomers";
import { type CustomerPriority, type CustomerRecord } from "@/modules/crm/types/customer.types";
import { createCustomerExcelName, createCustomerExcelRows, customerExcelColumns } from "@/modules/crm/utils/customer-excel";
import { countActiveCustomerFilters } from "@/modules/crm/utils/customer-filtering";
import { customerListRouteConfig, validateCustomerSearch } from "@/modules/crm/utils/customer-list-search";
import { usePersonalization } from "@/modules/profile/context/usePersonalization";
import { AppTablePage, AppTablePageSection } from "@/shared/components/list-page";
import { AppTable, type AppTableRowActions, createAppTableColumns } from "@/shared/components/table";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { DeleteConfirmationModal } from "@/shared/components/ui/DeleteConfirmationModal";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { useAppExcelExport } from "@/shared/export";
import { useAppListPageBounds, useAppListRouteController } from "@/shared/list-state";
import { getCountyName, getProvinceName } from "@/shared/utils/iran-location";

export const Route = createFileRoute("/crm/customers")({
  validateSearch: validateCustomerSearch,
  component: CustomersRoute,
});

function CustomersRoute() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <RequirePermission permission={PermissionKeys.CrmCustomersView}>
      {pathname === "/crm/customers" ? <CustomersPage /> : <Outlet />}
    </RequirePermission>
  );
}

function getPriorityTone(priority: CustomerPriority) {
  if (priority === "urgent") {
    return "red";
  }

  if (priority === "high") {
    return "teal";
  }

  return "atisCyan";
}

function CustomersPage() {
  const search = Route.useSearch();
  const { settings } = usePersonalization();
  const { hasPermission } = useAuth();
  const canCreateCustomer = hasPermission(PermissionKeys.CrmCustomersCreate);
  const [customers, setCustomers] = useStoredCustomers();
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerRecord | null>(null);

  const listRoute = useAppListRouteController({
    config: customerListRouteConfig,
    defaultPageSize: settings.defaultTablePageSize,
    search,
    to: "/crm/customers",
  });
  const { filters, page, pageSize } = listRoute;
  const customersResult = useMockCustomerListQuery({
    customers,
    filters,
    page,
    pageSize,
    sorting: listRoute.sorting,
  });

  useAppListPageBounds({
    onReplacePage: listRoute.replacePage,
    page,
    pageSize,
    totalItems: customersResult.totalItems,
  });

  const activeFilterCount = useMemo(() => countActiveCustomerFilters(filters), [filters]);

  const handleConfirmDelete = () => {
    if (!deletingCustomer) {
      return;
    }

    setCustomers((currentCustomers) => currentCustomers.filter((customer) => customer.id !== deletingCustomer.id));
    setDeletingCustomer(null);
  };

  const customerExcelExport = useAppExcelExport({
    columns: customerExcelColumns,
    excelName: createCustomerExcelName,
    getRows: () => createCustomerExcelRows(customersResult.exportRows),
  });

  const customerColumns = useMemo(() => {
    const column = createAppTableColumns<CustomerRecord>();

    return [
      column.field("id", { title: CrmTexts.Customers.Table.Code, sortable: true, width: 92 }),
      column.field("employerName", {
        title: SharedTexts.EmployerName,
        sortable: true,
        width: 220,
        render: (value) => <strong className="font-extrabold text-slate-900">{value}</strong>,
      }),
      column.field("requesterName", { title: SharedTexts.RequesterName, sortable: true, width: 180 }),
      column.field("contactNumber", { title: SharedTexts.ContactNumber, width: 160 }),
      column.field("provinceId", {
        title: SharedTexts.Province,
        sortable: true,
        width: 150,
        render: (value) => getProvinceName(value),
      }),
      column.field("countyId", {
        title: SharedTexts.County,
        sortable: true,
        width: 150,
        render: (value) => getCountyName(value),
      }),
      column.field("projectName", { title: SharedTexts.ProjectName, sortable: true, width: 220, ellipsis: true }),
      column.field("source", { title: CrmTexts.Customers.Table.Source, width: 160 }),
      column.field("salesExpert", { title: CrmTexts.Customers.Table.SalesExpert, sortable: true, width: 160 }),
      column.field("priority", {
        title: CrmTexts.Customers.Table.Priority,
        sortable: true,
        width: 130,
        render: (value) => <AppBadge tone={getPriorityTone(value)}>{CrmTexts.Customers.PriorityLabels[value]}</AppBadge>,
      }),
      column.field("lastContact", { title: CrmTexts.Customers.Table.LastContact, sortable: true, width: 150 }),
      column.field("nextStep", { title: CrmTexts.Customers.Table.NextStep, width: 220, ellipsis: true }),
      column.field("estimatedValue", { title: CrmTexts.Customers.Table.EstimatedValue, width: 170 }),
      column.field("status", {
        title: CrmTexts.Customers.Table.Status,
        sortable: true,
        width: 160,
        render: (value) => <AppBadge>{CrmTexts.Customers.StatusLabels[value]}</AppBadge>,
      }),
    ];
  }, []);

  const customerRowActions = useMemo<AppTableRowActions<CustomerRecord>>(
    () => ({
      title: CrmTexts.Customers.Table.Actions,
      width: 120,
      items: [
        {
          key: "edit",
          label: CrmTexts.Customers.Table.EditAction,
          ariaLabel: CrmTexts.Customers.Table.EditAction,
          icon: <IconEdit size={18} />,
          to: "/crm/customers/$customerId/edit",
          params: (customer) => ({ customerId: String(customer.id) }),
        },
        {
          key: "delete",
          label: CrmTexts.Customers.Table.DeleteAction,
          ariaLabel: CrmTexts.Customers.Table.DeleteAction,
          color: "red",
          icon: <IconTrash size={18} />,
          onClick: (customer) => setDeletingCustomer(customer),
        },
      ],
    }),
    [],
  );

  return (
    <AppTablePage
      title={SharedTexts.Navigation.Customers}
      description={CrmTexts.Customers.PageDescription}
      actions={
        <>
          <Button
            variant="light"
            leftSection={<IconFileSpreadsheet size={18} />}
            loading={customerExcelExport.isExporting}
            onClick={() => void customerExcelExport.exportRows()}
          >
            {CrmTexts.Customers.Excel.ReceiveButton}
          </Button>
          {canCreateCustomer ? (
            <Button component={Link} to="/crm/customers/new" leftSection={<IconPlus size={18} />}>
              {CrmTexts.Customers.NewCustomerButton}
            </Button>
          ) : null}
        </>
      }
      filters={<CustomerListFilters customers={customers} filters={filters} activeFilterCount={activeFilterCount} onApply={listRoute.applyFilters} />}
      modals={
        <DeleteConfirmationModal
          opened={Boolean(deletingCustomer)}
          entityType={CrmTexts.Customers.Delete.EntityType}
          entityName={deletingCustomer?.employerName ?? ""}
          description={CrmTexts.Customers.Delete.Description}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={handleConfirmDelete}
        />
      }
    >
      <AppTablePageSection>
        <AppTable
          columns={customerColumns}
          dataSource={customersResult.rows}
          emptyText={activeFilterCount > 0 ? CrmTexts.Customers.Table.FilteredEmptyState : CrmTexts.Customers.Table.EmptyState}
          minWidth={1480}
          pagination={listRoute.createPagination(customersResult.totalItems)}
          sorting={listRoute.tableSorting}
          rowActions={customerRowActions}
          rowKey="id"
        />
      </AppTablePageSection>
    </AppTablePage>
  );
}
