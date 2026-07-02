import { ActionIcon, Button, Card, Group, Stack, Table, Text, Title, Tooltip } from "@mantine/core";
import { IconArrowRight, IconEdit, IconFileSpreadsheet, IconPlus, IconTrash } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { useAuth } from "@/modules/auth/context/useAuth";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { CustomerFormPage } from "@/modules/crm/components/CustomerFormPage";
import { CustomerListFilters } from "@/modules/crm/components/CustomerListFilters";
import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { type CustomerListFilterValues } from "@/modules/crm/types/customer-filter.types";
import { type CustomerPriority, type CustomerRecord } from "@/modules/crm/types/customer.types";
import { exportCustomersToExcel } from "@/modules/crm/utils/customer-excel";
import { countActiveCustomerFilters, defaultCustomerListFilterValues, filterCustomers } from "@/modules/crm/utils/customer-filtering";
import { getNextCustomerId, loadCustomersFromStorage, saveCustomersToStorage } from "@/modules/crm/utils/customer-storage";
import { AppBadge } from "@/shared/components/ui/AppBadge";
import { AppPagination } from "@/shared/components/ui/AppPagination";
import { DeleteConfirmationModal } from "@/shared/components/ui/DeleteConfirmationModal";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { getCountyName, getProvinceName } from "@/shared/utils/iran-location";

type CustomerRouteSearch = {
  action?: "new" | "edit";
  customerId?: string;
};

const DEFAULT_PAGE_SIZE = 10;

function validateCustomerSearch(search: Record<string, unknown>): CustomerRouteSearch {
  const action = search.action === "new" || search.action === "edit" ? search.action : undefined;
  const customerId = typeof search.customerId === "string" ? search.customerId : undefined;

  return { action, customerId };
}

export const Route = createFileRoute("/crm/customers")({
  validateSearch: validateCustomerSearch,
  component: CustomersRoute,
});

function CustomersRoute() {
  return (
    <RequirePermission permission={PermissionKeys.CrmCustomersView}>
      <CustomersPage />
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
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { hasPermission } = useAuth();
  const canCreateCustomer = hasPermission(PermissionKeys.CrmCustomersCreate);
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => loadCustomersFromStorage());
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerRecord | null>(null);
  const [filters, setFilters] = useState<CustomerListFilterValues>(defaultCustomerListFilterValues);
  const [isExportingCustomers, setIsExportingCustomers] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    saveCustomersToStorage(customers);
  }, [customers]);

  const activeFilterCount = useMemo(() => countActiveCustomerFilters(filters), [filters]);
  const filteredCustomers = useMemo(() => filterCustomers(customers, filters), [customers, filters]);
  const sortedCustomers = useMemo(
    () => [...filteredCustomers].sort((firstCustomer, secondCustomer) => secondCustomer.id - firstCustomer.id),
    [filteredCustomers],
  );
  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / pageSize));
  const paginatedCustomers = useMemo(() => {
    const startIndex = (page - 1) * pageSize;

    return sortedCustomers.slice(startIndex, startIndex + pageSize);
  }, [page, pageSize, sortedCustomers]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const editingCustomerId = search.action === "edit" ? Number(search.customerId) : undefined;
  const editingCustomer = Number.isFinite(editingCustomerId) ? customers.find((customer) => customer.id === editingCustomerId) : undefined;
  const isFormPage = search.action === "new" || search.action === "edit";

  const navigateToCustomerList = async () => {
    await navigate({ to: "/crm/customers", search: {} });
  };

  const navigateToNewCustomer = async () => {
    await navigate({ to: "/crm/customers", search: { action: "new" } });
  };

  const navigateToEditCustomer = async (customer: CustomerRecord) => {
    await navigate({ to: "/crm/customers", search: { action: "edit", customerId: String(customer.id) } });
  };

  const handleSubmitCustomer = async (values: Omit<CustomerRecord, "id">) => {
    if (search.action === "edit" && editingCustomer) {
      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) => (customer.id === editingCustomer.id ? { ...values, id: editingCustomer.id } : customer)),
      );
    } else {
      setCustomers((currentCustomers) => [{ ...values, id: getNextCustomerId(currentCustomers) }, ...currentCustomers]);
    }

    await navigateToCustomerList();
  };

  const handleConfirmDelete = () => {
    if (!deletingCustomer) {
      return;
    }

    setCustomers((currentCustomers) => currentCustomers.filter((customer) => customer.id !== deletingCustomer.id));
    setDeletingCustomer(null);
  };

  const handleApplyFilters = (nextFilters: CustomerListFilterValues) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  const handleExportCustomers = async () => {
    setIsExportingCustomers(true);

    try {
      await exportCustomersToExcel(sortedCustomers);
    } finally {
      setIsExportingCustomers(false);
    }
  };

  if (isFormPage) {
    if (search.action === "edit" && !editingCustomer) {
      return (
        <Stack gap="lg" dir="rtl">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1}>{CrmTexts.Customers.EditCustomerTitle}</Title>
              <Text c="dimmed" mt={6}>
                {CrmTexts.Customers.Form.CustomerNotFoundDescription}
              </Text>
            </div>
            <Button variant="default" leftSection={<IconArrowRight size={18} />} onClick={() => void navigateToCustomerList()}>
              {CrmTexts.Customers.Form.BackToListButton}
            </Button>
          </Group>
          <Card radius="xl" padding="xl" shadow="sm" className="border border-slate-200 bg-white text-center text-slate-500">
            {CrmTexts.Customers.Form.CustomerNotFoundTitle}
          </Card>
        </Stack>
      );
    }

    return (
      <Stack gap="lg" dir="rtl">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1}>{search.action === "edit" ? CrmTexts.Customers.EditCustomerTitle : CrmTexts.Customers.AddCustomerTitle}</Title>
            <Text c="dimmed" mt={6}>
              {CrmTexts.Customers.Form.FormPageDescription}
            </Text>
          </div>
          <Button variant="default" leftSection={<IconArrowRight size={18} />} onClick={() => void navigateToCustomerList()}>
            {CrmTexts.Customers.Form.BackToListButton}
          </Button>
        </Group>

        <CustomerFormPage customer={search.action === "edit" ? editingCustomer : null} onCancel={() => void navigateToCustomerList()} onSubmit={handleSubmitCustomer} />
      </Stack>
    );
  }

  return (
    <Stack gap="lg" dir="rtl">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>{SharedTexts.Navigation.Customers}</Title>
          <Text c="dimmed" mt={6}>
            {CrmTexts.Customers.PageDescription}
          </Text>
        </div>
        <Group gap="sm">
          <Button variant="light" leftSection={<IconFileSpreadsheet size={18} />} loading={isExportingCustomers} onClick={() => void handleExportCustomers()}>
            {CrmTexts.Customers.Excel.ReceiveButton}
          </Button>
          {canCreateCustomer ? (
            <Button leftSection={<IconPlus size={18} />} onClick={() => void navigateToNewCustomer()}>
              {CrmTexts.Customers.NewCustomerButton}
            </Button>
          ) : null}
        </Group>
      </Group>

      <CustomerListFilters customers={customers} filters={filters} activeFilterCount={activeFilterCount} onApply={handleApplyFilters} />

      <Card radius="xl" padding="lg" shadow="sm" className="border border-slate-200 bg-white">
        <Stack gap="md">
          <Table.ScrollContainer minWidth={1480}>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">{CrmTexts.Customers.Table.Code}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{SharedTexts.EmployerName}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{SharedTexts.RequesterName}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{SharedTexts.ContactNumber}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{SharedTexts.Province}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{SharedTexts.County}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{SharedTexts.ProjectName}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{CrmTexts.Customers.Table.Source}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{CrmTexts.Customers.Table.SalesExpert}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{CrmTexts.Customers.Table.Priority}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{CrmTexts.Customers.Table.LastContact}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{CrmTexts.Customers.Table.NextStep}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{CrmTexts.Customers.Table.EstimatedValue}</Table.Th>
                  <Table.Th className="whitespace-nowrap">{CrmTexts.Customers.Table.Status}</Table.Th>
                  <Table.Th className="whitespace-nowrap text-center">{CrmTexts.Customers.Table.Actions}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <Table.Tr key={customer.id}>
                      <Table.Td>{customer.id}</Table.Td>
                      <Table.Td fw={700}>{customer.employerName}</Table.Td>
                      <Table.Td>{customer.requesterName}</Table.Td>
                      <Table.Td>{customer.contactNumber}</Table.Td>
                      <Table.Td>{getProvinceName(customer.provinceId)}</Table.Td>
                      <Table.Td>{getCountyName(customer.countyId)}</Table.Td>
                      <Table.Td>{customer.projectName}</Table.Td>
                      <Table.Td>{customer.source}</Table.Td>
                      <Table.Td>{customer.salesExpert}</Table.Td>
                      <Table.Td>
                        <AppBadge tone={getPriorityTone(customer.priority)}>{CrmTexts.Customers.PriorityLabels[customer.priority]}</AppBadge>
                      </Table.Td>
                      <Table.Td>{customer.lastContact}</Table.Td>
                      <Table.Td>{customer.nextStep}</Table.Td>
                      <Table.Td>{customer.estimatedValue}</Table.Td>
                      <Table.Td>
                        <AppBadge>{CrmTexts.Customers.StatusLabels[customer.status]}</AppBadge>
                      </Table.Td>
                      <Table.Td>
                        <Group justify="center" gap="xs" wrap="nowrap">
                          <Tooltip label={CrmTexts.Customers.Table.EditAction}>
                            <ActionIcon
                              variant="subtle"
                              color="atisCyan"
                              radius="xl"
                              aria-label={CrmTexts.Customers.Table.EditAction}
                              onClick={() => void navigateToEditCustomer(customer)}
                            >
                              <IconEdit size={18} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={CrmTexts.Customers.Table.DeleteAction}>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              radius="xl"
                              aria-label={CrmTexts.Customers.Table.DeleteAction}
                              onClick={() => setDeletingCustomer(customer)}
                            >
                              <IconTrash size={18} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={15} className="py-10 text-center text-slate-500">
                      {activeFilterCount > 0 ? CrmTexts.Customers.Table.FilteredEmptyState : CrmTexts.Customers.Table.EmptyState}
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          <AppPagination
            page={page}
            pageSize={pageSize}
            totalItems={sortedCustomers.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </Stack>
      </Card>

      <DeleteConfirmationModal
        opened={Boolean(deletingCustomer)}
        entityType={CrmTexts.Customers.Delete.EntityType}
        entityName={deletingCustomer?.employerName ?? ""}
        description={CrmTexts.Customers.Delete.Description}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  );
}
