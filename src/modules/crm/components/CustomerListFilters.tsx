import { Badge, Button, Card, Collapse, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconChevronDown, IconFilter, IconRefresh } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { defaultCustomerListFilterValues, getUniqueCustomerTextOptions } from "@/modules/crm/utils/customer-filtering";
import { type CustomerListFilterValues } from "@/modules/crm/types/customer-filter.types";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { useAppForm } from "@/shared/components/form/form";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { getMantineCountyOptions, mantineProvinceOptions } from "@/shared/utils/iran-location";

const priorityOptions = Object.entries(CrmTexts.Customers.PriorityLabels).map(([value, label]) => ({ value, label }));
const statusOptions = Object.entries(CrmTexts.Customers.StatusLabels).map(([value, label]) => ({ value, label }));
const elevatorTypeOptions = SharedTexts.ElevatorType.Options.map((option) => ({ value: option, label: option }));
const usageTypeOptions = SharedTexts.UsageType.Options.map((option) => ({ value: option, label: option }));
const salesExpertOptions = CrmTexts.Customers.SalesExpertOptions.map((option) => ({ value: option, label: option }));

function getActiveFilterBadgeText(activeFilterCount: number) {
  return CrmTexts.Customers.Filters.ActiveCount.replace("{count}", String(activeFilterCount));
}

type CustomerListFiltersProps = {
  activeFilterCount: number;
  customers: readonly CustomerRecord[];
  filters: CustomerListFilterValues;
  onApply: (filters: CustomerListFilterValues) => void;
};

export function CustomerListFilters({ activeFilterCount, customers, filters, onApply }: CustomerListFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sourceOptions = useMemo(() => getUniqueCustomerTextOptions(customers, (customer) => customer.source), [customers]);
  const environmentTypeOptions = useMemo(() => getUniqueCustomerTextOptions(customers, (customer) => customer.environmentType), [customers]);

  const form = useAppForm({
    defaultValues: filters,
    onSubmit: ({ value }) => {
      onApply(value);
    },
  });

  const resetDraftValues = () => {
    form.setFieldValue("query", defaultCustomerListFilterValues.query);
    form.setFieldValue("provinceId", defaultCustomerListFilterValues.provinceId);
    form.setFieldValue("countyId", defaultCustomerListFilterValues.countyId);
    form.setFieldValue("status", defaultCustomerListFilterValues.status);
    form.setFieldValue("priority", defaultCustomerListFilterValues.priority);
    form.setFieldValue("source", defaultCustomerListFilterValues.source);
    form.setFieldValue("salesExpert", defaultCustomerListFilterValues.salesExpert);
    form.setFieldValue("elevatorType", defaultCustomerListFilterValues.elevatorType);
    form.setFieldValue("usageType", defaultCustomerListFilterValues.usageType);
    form.setFieldValue("environmentType", defaultCustomerListFilterValues.environmentType);
    form.setFieldValue("numberOfStopsFrom", defaultCustomerListFilterValues.numberOfStopsFrom);
    form.setFieldValue("numberOfStopsTo", defaultCustomerListFilterValues.numberOfStopsTo);
    form.setFieldValue("numberOfUnitsFrom", defaultCustomerListFilterValues.numberOfUnitsFrom);
    form.setFieldValue("numberOfUnitsTo", defaultCustomerListFilterValues.numberOfUnitsTo);
    form.setFieldValue("visitDateFrom", defaultCustomerListFilterValues.visitDateFrom);
    form.setFieldValue("visitDateTo", defaultCustomerListFilterValues.visitDateTo);
    form.setFieldValue("lastContactFrom", defaultCustomerListFilterValues.lastContactFrom);
    form.setFieldValue("lastContactTo", defaultCustomerListFilterValues.lastContactTo);
    form.setFieldValue("estimatedValueContains", defaultCustomerListFilterValues.estimatedValueContains);
  };

  const handleClear = () => {
    resetDraftValues();
    onApply(defaultCustomerListFilterValues);
  };

  return (
    <Card radius="xl" padding="lg" shadow="sm" className="border border-slate-200 bg-white">
      <Stack gap="md">
        <Group justify="space-between" align="center" gap="md">
          <Group gap="sm">
            <IconFilter size={20} className="text-atisCyan-700" />
            <div>
              <Title order={2} className="text-base font-black text-slate-900">
                {CrmTexts.Customers.Filters.Title}
              </Title>
              <Text size="sm" c="dimmed">
                {CrmTexts.Customers.Filters.Description}
              </Text>
            </div>
          </Group>

          <Group gap="xs">
            {activeFilterCount > 0 ? <Badge color="atisCyan">{getActiveFilterBadgeText(activeFilterCount)}</Badge> : null}
            <Button
              variant="light"
              rightSection={<IconChevronDown size={16} className={isOpen ? "rotate-180 transition-transform" : "transition-transform"} />}
              onClick={() => setIsOpen((currentValue) => !currentValue)}
            >
              {isOpen ? CrmTexts.Customers.Filters.ToggleClose : CrmTexts.Customers.Filters.ToggleOpen}
            </Button>
          </Group>
        </Group>

        <Collapse expanded={isOpen} keepMounted={false}>
          <form.AppForm>
            <form
              noValidate
              className="flex flex-col gap-4 pt-2"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
                <form.AppField name="query">
                  {(field) => <field.TextInputField label={CrmTexts.Customers.Filters.GeneralSearch} placeholder={CrmTexts.Customers.Filters.GeneralSearchPlaceholder} />}
                </form.AppField>

                <form.AppField name="provinceId">
                  {(field) => (
                    <field.SelectField
                      label={SharedTexts.Province}
                      placeholder={SharedTexts.Common.All}
                      data={mantineProvinceOptions}
                      searchable
                      clearable
                      comboboxProps={{ withinPortal: true }}
                      onChange={() => {
                        form.setFieldValue("countyId", "");
                      }}
                    />
                  )}
                </form.AppField>

                <form.Subscribe selector={(state) => state.values.provinceId}>
                  {(provinceId) => (
                    <form.AppField name="countyId">
                      {(field) => (
                        <field.SelectField
                          label={SharedTexts.County}
                          placeholder={provinceId ? SharedTexts.Common.All : CrmTexts.Customers.Filters.CountyDisabledPlaceholder}
                          data={getMantineCountyOptions(provinceId)}
                          searchable
                          clearable
                          disabled={!provinceId}
                          comboboxProps={{ withinPortal: true }}
                        />
                      )}
                    </form.AppField>
                  )}
                </form.Subscribe>

                <form.AppField name="status">
                  {(field) => <field.SelectField label={CrmTexts.Customers.Table.Status} placeholder={SharedTexts.Common.All} data={statusOptions} clearable comboboxProps={{ withinPortal: true }} />}
                </form.AppField>

                <form.AppField name="priority">
                  {(field) => <field.SelectField label={CrmTexts.Customers.Table.Priority} placeholder={SharedTexts.Common.All} data={priorityOptions} clearable comboboxProps={{ withinPortal: true }} />}
                </form.AppField>

                <form.AppField name="source">
                  {(field) => <field.SelectField label={CrmTexts.Customers.Table.Source} placeholder={SharedTexts.Common.All} data={sourceOptions} searchable clearable comboboxProps={{ withinPortal: true }} />}
                </form.AppField>

                <form.AppField name="salesExpert">
                  {(field) => <field.SelectField label={CrmTexts.Customers.Table.SalesExpert} placeholder={SharedTexts.Common.All} data={salesExpertOptions} searchable clearable comboboxProps={{ withinPortal: true }} />}
                </form.AppField>

                <form.AppField name="elevatorType">
                  {(field) => <field.SelectField label={SharedTexts.ElevatorType.Label} placeholder={SharedTexts.Common.All} data={elevatorTypeOptions} clearable comboboxProps={{ withinPortal: true }} />}
                </form.AppField>

                <form.AppField name="usageType">
                  {(field) => <field.SelectField label={SharedTexts.UsageType.Label} placeholder={SharedTexts.Common.All} data={usageTypeOptions} clearable comboboxProps={{ withinPortal: true }} />}
                </form.AppField>

                <form.AppField name="environmentType">
                  {(field) => <field.SelectField label={SharedTexts.EnvironmentType} placeholder={SharedTexts.Common.All} data={environmentTypeOptions} searchable clearable comboboxProps={{ withinPortal: true }} />}
                </form.AppField>

                <form.AppField name="numberOfStopsFrom">
                  {(field) => <field.TextInputField label={CrmTexts.Customers.Filters.NumberOfStopsFrom} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />}
                </form.AppField>

                <form.AppField name="numberOfStopsTo">
                  {(field) => <field.TextInputField label={CrmTexts.Customers.Filters.NumberOfStopsTo} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />}
                </form.AppField>

                <form.AppField name="numberOfUnitsFrom">
                  {(field) => <field.TextInputField label={CrmTexts.Customers.Filters.NumberOfUnitsFrom} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />}
                </form.AppField>

                <form.AppField name="numberOfUnitsTo">
                  {(field) => <field.TextInputField label={CrmTexts.Customers.Filters.NumberOfUnitsTo} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />}
                </form.AppField>

                <form.AppField name="visitDateFrom">
                  {(field) => <field.DatePickerField label={CrmTexts.Customers.Filters.VisitDateFrom} />}
                </form.AppField>

                <form.AppField name="visitDateTo">
                  {(field) => <field.DatePickerField label={CrmTexts.Customers.Filters.VisitDateTo} />}
                </form.AppField>

                <form.AppField name="lastContactFrom">
                  {(field) => <field.DatePickerField label={CrmTexts.Customers.Filters.LastContactFrom} />}
                </form.AppField>

                <form.AppField name="lastContactTo">
                  {(field) => <field.DatePickerField label={CrmTexts.Customers.Filters.LastContactTo} />}
                </form.AppField>

                <form.AppField name="estimatedValueContains">
                  {(field) => <field.TextInputField label={CrmTexts.Customers.Filters.EstimatedValueContains} placeholder={CrmTexts.Customers.Filters.EstimatedValuePlaceholder} />}
                </form.AppField>
              </SimpleGrid>

              <Group justify="flex-end" gap="sm">
                <Button type="button" variant="default" leftSection={<IconRefresh size={16} />} onClick={handleClear}>
                  {SharedTexts.Common.ClearFilters}
                </Button>
                <form.SubmitButton leftSection={<IconFilter size={16} />} disableWhenInvalid={false}>
                  {SharedTexts.Common.ApplyFilters}
                </form.SubmitButton>
              </Group>
            </form>
          </form.AppForm>
        </Collapse>
      </Stack>
    </Card>
  );
}
