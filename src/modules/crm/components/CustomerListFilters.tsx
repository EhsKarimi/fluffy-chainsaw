import { Badge, Button, Collapse } from "@mantine/core";
import { IconChevronDown, IconFilter, IconRefresh } from "@tabler/icons-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { type CustomerListFilterValues } from "@/modules/crm/types/customer-filter.types";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { defaultCustomerListFilterValues, getUniqueCustomerTextOptions } from "@/modules/crm/utils/customer-filtering";
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

type CustomerFilterFormPanelProps = Omit<CustomerListFiltersProps, "activeFilterCount">;

const createFilterSignature = (filters: CustomerListFilterValues) => JSON.stringify(filters);

const CustomerFilterFormPanel = memo(function CustomerFilterFormPanel({ customers, filters, onApply }: CustomerFilterFormPanelProps) {
  const filtersSignature = useMemo(() => createFilterSignature(filters), [filters]);
  const lastSyncedFiltersSignatureRef = useRef(filtersSignature);
  const sourceOptions = useMemo(() => getUniqueCustomerTextOptions(customers, (customer) => customer.source), [customers]);
  const environmentTypeOptions = useMemo(() => getUniqueCustomerTextOptions(customers, (customer) => customer.environmentType), [customers]);

  const form = useAppForm({
    defaultValues: filters,
    onSubmit: ({ value }) => {
      onApply(value);
    },
  });

  const setDraftValues = useCallback(
    (nextFilters: CustomerListFilterValues) => {
      form.setFieldValue("query", nextFilters.query);
      form.setFieldValue("provinceId", nextFilters.provinceId);
      form.setFieldValue("countyId", nextFilters.countyId);
      form.setFieldValue("status", nextFilters.status);
      form.setFieldValue("priority", nextFilters.priority);
      form.setFieldValue("source", nextFilters.source);
      form.setFieldValue("salesExpert", nextFilters.salesExpert);
      form.setFieldValue("elevatorType", nextFilters.elevatorType);
      form.setFieldValue("usageType", nextFilters.usageType);
      form.setFieldValue("environmentType", nextFilters.environmentType);
      form.setFieldValue("numberOfStopsFrom", nextFilters.numberOfStopsFrom);
      form.setFieldValue("numberOfStopsTo", nextFilters.numberOfStopsTo);
      form.setFieldValue("numberOfUnitsFrom", nextFilters.numberOfUnitsFrom);
      form.setFieldValue("numberOfUnitsTo", nextFilters.numberOfUnitsTo);
      form.setFieldValue("visitDateFrom", nextFilters.visitDateFrom);
      form.setFieldValue("visitDateTo", nextFilters.visitDateTo);
      form.setFieldValue("lastContactFrom", nextFilters.lastContactFrom);
      form.setFieldValue("lastContactTo", nextFilters.lastContactTo);
      form.setFieldValue("estimatedValueContains", nextFilters.estimatedValueContains);
    },
    [form],
  );

  useEffect(() => {
    if (lastSyncedFiltersSignatureRef.current === filtersSignature) {
      return;
    }

    lastSyncedFiltersSignatureRef.current = filtersSignature;
    setDraftValues(filters);
  }, [filters, filtersSignature, setDraftValues]);

  const handleClear = () => {
    lastSyncedFiltersSignatureRef.current = createFilterSignature(defaultCustomerListFilterValues);
    setDraftValues(defaultCustomerListFilterValues);
    onApply(defaultCustomerListFilterValues);
  };

  return (
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <form.AppField name="query">
            {(field) => (
              <field.TextInputField
                label={CrmTexts.Customers.Filters.GeneralSearch}
                placeholder={CrmTexts.Customers.Filters.GeneralSearchPlaceholder}
              />
            )}
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
            {(field) => (
              <field.SelectField
                label={CrmTexts.Customers.Table.Status}
                placeholder={SharedTexts.Common.All}
                data={statusOptions}
                clearable
                comboboxProps={{ withinPortal: true }}
              />
            )}
          </form.AppField>

          <form.AppField name="priority">
            {(field) => (
              <field.SelectField
                label={CrmTexts.Customers.Table.Priority}
                placeholder={SharedTexts.Common.All}
                data={priorityOptions}
                clearable
                comboboxProps={{ withinPortal: true }}
              />
            )}
          </form.AppField>

          <form.AppField name="source">
            {(field) => (
              <field.SelectField
                label={CrmTexts.Customers.Table.Source}
                placeholder={SharedTexts.Common.All}
                data={sourceOptions}
                searchable
                clearable
                comboboxProps={{ withinPortal: true }}
              />
            )}
          </form.AppField>

          <form.AppField name="salesExpert">
            {(field) => (
              <field.SelectField
                label={CrmTexts.Customers.Table.SalesExpert}
                placeholder={SharedTexts.Common.All}
                data={salesExpertOptions}
                searchable
                clearable
                comboboxProps={{ withinPortal: true }}
              />
            )}
          </form.AppField>

          <form.AppField name="elevatorType">
            {(field) => (
              <field.SelectField
                label={SharedTexts.ElevatorType.Label}
                placeholder={SharedTexts.Common.All}
                data={elevatorTypeOptions}
                clearable
                comboboxProps={{ withinPortal: true }}
              />
            )}
          </form.AppField>

          <form.AppField name="usageType">
            {(field) => (
              <field.SelectField
                label={SharedTexts.UsageType.Label}
                placeholder={SharedTexts.Common.All}
                data={usageTypeOptions}
                clearable
                comboboxProps={{ withinPortal: true }}
              />
            )}
          </form.AppField>

          <form.AppField name="environmentType">
            {(field) => (
              <field.SelectField
                label={SharedTexts.EnvironmentType}
                placeholder={SharedTexts.Common.All}
                data={environmentTypeOptions}
                searchable
                clearable
                comboboxProps={{ withinPortal: true }}
              />
            )}
          </form.AppField>

          <form.AppField name="numberOfStopsFrom">
            {(field) => (
              <field.TextInputField label={CrmTexts.Customers.Filters.NumberOfStopsFrom} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />
            )}
          </form.AppField>

          <form.AppField name="numberOfStopsTo">
            {(field) => (
              <field.TextInputField label={CrmTexts.Customers.Filters.NumberOfStopsTo} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />
            )}
          </form.AppField>

          <form.AppField name="numberOfUnitsFrom">
            {(field) => (
              <field.TextInputField label={CrmTexts.Customers.Filters.NumberOfUnitsFrom} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />
            )}
          </form.AppField>

          <form.AppField name="numberOfUnitsTo">
            {(field) => (
              <field.TextInputField label={CrmTexts.Customers.Filters.NumberOfUnitsTo} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />
            )}
          </form.AppField>

          <form.AppField name="visitDateFrom">{(field) => <field.DatePickerField label={CrmTexts.Customers.Filters.VisitDateFrom} />}</form.AppField>

          <form.AppField name="visitDateTo">{(field) => <field.DatePickerField label={CrmTexts.Customers.Filters.VisitDateTo} />}</form.AppField>

          <form.AppField name="lastContactFrom">
            {(field) => <field.DatePickerField label={CrmTexts.Customers.Filters.LastContactFrom} />}
          </form.AppField>

          <form.AppField name="lastContactTo">{(field) => <field.DatePickerField label={CrmTexts.Customers.Filters.LastContactTo} />}</form.AppField>

          <form.AppField name="estimatedValueContains">
            {(field) => (
              <field.TextInputField
                label={CrmTexts.Customers.Filters.EstimatedValueContains}
                placeholder={CrmTexts.Customers.Filters.EstimatedValuePlaceholder}
              />
            )}
          </form.AppField>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="default" leftSection={<IconRefresh size={16} />} onClick={handleClear}>
            {SharedTexts.Common.ClearFilters}
          </Button>
          <form.SubmitButton leftSection={<IconFilter size={16} />} disableWhenInvalid={false}>
            {SharedTexts.Common.ApplyFilters}
          </form.SubmitButton>
        </div>
      </form>
    </form.AppForm>
  );
});

export function CustomerListFilters({ activeFilterCount, customers, filters, onApply }: CustomerListFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <IconFilter size={20} className="text-atisCyan-700" />
            <div>
              <h2 className="text-base font-black text-slate-900">{CrmTexts.Customers.Filters.Title}</h2>
              <p className="text-sm text-slate-500">{CrmTexts.Customers.Filters.Description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeFilterCount > 0 ? <Badge color="atisCyan">{getActiveFilterBadgeText(activeFilterCount)}</Badge> : null}
            <Button
              variant="light"
              aria-expanded={isOpen}
              rightSection={<IconChevronDown size={16} className={isOpen ? "rotate-180 transition-transform" : "transition-transform"} />}
              onClick={() => setIsOpen((currentValue) => !currentValue)}
            >
              {isOpen ? CrmTexts.Customers.Filters.ToggleClose : CrmTexts.Customers.Filters.ToggleOpen}
            </Button>
          </div>
        </div>

        <Collapse expanded={isOpen} keepMounted transitionDuration={160} transitionTimingFunction="ease-out">
          <CustomerFilterFormPanel customers={customers} filters={filters} onApply={onApply} />
        </Collapse>
      </div>
    </section>
  );
}
