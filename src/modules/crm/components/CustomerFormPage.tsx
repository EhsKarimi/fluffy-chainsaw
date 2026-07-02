import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { type ReactNode } from "react";

import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { emptyCustomerFormValues } from "@/modules/crm/constants/customer-defaults";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { useAppForm } from "@/shared/components/form/form";
import { requestScrollToFirstFormError } from "@/shared/components/form/scrollToFirstFormError";
import { validateRequiredText } from "@/shared/components/form/validators";
import { SharedTexts } from "@/shared/constants/SharedTexts";

type CustomerFormValues = Omit<CustomerRecord, "id">;

type CustomerFormPageProps = {
  customer?: CustomerRecord | null;
  onCancel: () => void;
  onSubmit: (values: CustomerFormValues) => void | Promise<void>;
};

type FormSectionProps = {
  children: ReactNode;
  description?: ReactNode;
  title: ReactNode;
};

function cloneCustomerValues(values: CustomerFormValues): CustomerFormValues {
  return {
    ...values,
    usageTypes: [...values.usageTypes],
    shaftSurroundingCoveringTypes: [...values.shaftSurroundingCoveringTypes],
  };
}

function getCustomerFormValues(customer?: CustomerRecord | null): CustomerFormValues {
  if (!customer) {
    return cloneCustomerValues(emptyCustomerFormValues);
  }

  const { id: customerId, ...values } = customer;
  void customerId;

  return cloneCustomerValues(values);
}

function toOptions(options: readonly string[]) {
  return options.map((option) => ({ value: option, label: option }));
}

function FormSection({ children, description, title }: FormSectionProps) {
  return (
    <Card radius="xl" padding="lg" shadow="sm" className="border border-slate-200 bg-white">
      <Stack gap="lg">
        <div>
          <Title order={3} className="text-base font-black text-slate-900">
            {title}
          </Title>
          {description ? (
            <Text size="sm" c="dimmed" mt={4}>
              {description}
            </Text>
          ) : null}
        </div>
        {children}
      </Stack>
    </Card>
  );
}

const priorityOptions = Object.entries(CrmTexts.Customers.PriorityLabels).map(([value, label]) => ({ value, label }));
const statusOptions = Object.entries(CrmTexts.Customers.StatusLabels).map(([value, label]) => ({ value, label }));
const elevatorTypeOptions = toOptions(SharedTexts.ElevatorType.Options);
const usageTypeOptions = toOptions(SharedTexts.UsageType.Options);
const doorTypeOptions = toOptions(SharedTexts.DoorType.Options);
const doorOpeningTypeOptions = toOptions(SharedTexts.DoorOpeningType.Options);
const floorDoorArrangementOptions = toOptions(SharedTexts.FloorDoorArrangement.Options);
const shaftIronworkOptions = toOptions(SharedTexts.ShaftIronwork.Options);
const foundationIntrusionOptions = toOptions(SharedTexts.FoundationIntrusionIntoShaft.Options);
const isShaftSuspendedOptions = toOptions(SharedTexts.IsShaftSuspended.Options);
const canPitBeDemolishedOptions = toOptions(SharedTexts.CanPitBeDemolished.Options);
const isShaftSurroundingOpenOptions = toOptions(SharedTexts.IsShaftSurroundingOpen.Options);
const shaftSurroundingCoveringTypeOptions = toOptions(SharedTexts.ShaftSurroundingCoveringType.Options);

export function CustomerFormPage({ customer, onCancel, onSubmit }: CustomerFormPageProps) {
  const isEditMode = Boolean(customer);
  const form = useAppForm({
    defaultValues: getCustomerFormValues(customer),
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form.AppForm>
      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          const formElement = event.currentTarget;

          void form.handleSubmit();
          requestScrollToFirstFormError(formElement);
        }}
      >
        <FormSection title={CrmTexts.Customers.Form.BasicInformationSection} description={CrmTexts.Customers.Form.BasicInformationDescription}>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            <form.AppField name="visitDate">
              {(field) => <field.DatePickerField label={SharedTexts.VisitDate.Label} />}
            </form.AppField>

            <form.AppField name="visitCoordinationPhone">
              {(field) => <field.TextInputField label={SharedTexts.VisitCoordinationPhone} placeholder={CrmTexts.Customers.Form.VisitPhonePlaceholder} />}
            </form.AppField>

            <form.AppField name="referenceNumber">
              {(field) => <field.TextInputField label={SharedTexts.ReferenceNumber} placeholder={CrmTexts.Customers.Form.ReferenceNumberPlaceholder} />}
            </form.AppField>

            <form.AppField name="projectName" validators={{ onChange: ({ value }) => validateRequiredText(value), onBlur: ({ value }) => validateRequiredText(value), onSubmit: ({ value }) => validateRequiredText(value) }}>
              {(field) => <field.TextInputField label={SharedTexts.ProjectName} placeholder={SharedTexts.ProjectName} required />}
            </form.AppField>

            <form.AppField name="projectExpertise">
              {(field) => <field.TextInputField label={SharedTexts.ProjectExpertise} placeholder={CrmTexts.Customers.Form.ProjectExpertisePlaceholder} />}
            </form.AppField>

            <form.AppField name="reference">
              {(field) => <field.TextInputField label={SharedTexts.Reference} placeholder={CrmTexts.Customers.Form.ReferencePlaceholder} />}
            </form.AppField>
          </SimpleGrid>
        </FormSection>

        <FormSection title={SharedTexts.EmployerSpecifications} description={CrmTexts.Customers.Form.EmployerInformationDescription}>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            <form.AppField name="employerName" validators={{ onChange: ({ value }) => validateRequiredText(value), onBlur: ({ value }) => validateRequiredText(value), onSubmit: ({ value }) => validateRequiredText(value) }}>
              {(field) => <field.TextInputField label={SharedTexts.EmployerName} placeholder={SharedTexts.EmployerName} required />}
            </form.AppField>

            <form.AppField name="requesterName" validators={{ onChange: ({ value }) => validateRequiredText(value), onBlur: ({ value }) => validateRequiredText(value), onSubmit: ({ value }) => validateRequiredText(value) }}>
              {(field) => <field.TextInputField label={SharedTexts.RequesterName} placeholder={SharedTexts.RequesterName} required />}
            </form.AppField>

            <form.AppField name="contactNumber" validators={{ onChange: ({ value }) => validateRequiredText(value), onBlur: ({ value }) => validateRequiredText(value), onSubmit: ({ value }) => validateRequiredText(value) }}>
              {(field) => <field.TextInputField label={SharedTexts.ContactNumber} placeholder={SharedTexts.ContactNumber} required />}
            </form.AppField>

            <form.AppField name="email">
              {(field) => <field.TextInputField dir="ltr" label={SharedTexts.Email} placeholder={SharedTexts.Email} />}
            </form.AppField>

            <form.AppField name="city">
              {(field) => <field.TextInputField label={CrmTexts.Customers.Table.City} placeholder={CrmTexts.Customers.Table.City} />}
            </form.AppField>

            <form.AppField name="projectAddress">
              {(field) => <field.TextInputField label={SharedTexts.ProjectAddress} placeholder={SharedTexts.ProjectAddress} />}
            </form.AppField>
          </SimpleGrid>
        </FormSection>

        <FormSection title={SharedTexts.ProductSpecifications} description={CrmTexts.Customers.Form.ProductInformationDescription}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              <form.AppField name="numberOfUnits">
                {(field) => <field.TextInputField label={SharedTexts.NumberOfUnits} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />}
              </form.AppField>

              <form.AppField name="numberOfStops">
                {(field) => <field.TextInputField label={SharedTexts.NumberOfStops} placeholder={CrmTexts.Customers.Form.NumberPlaceholder} />}
              </form.AppField>

              <form.AppField name="elevatorType">
                {(field) => <field.SelectField label={SharedTexts.ElevatorType.Label} data={elevatorTypeOptions} comboboxProps={{ withinPortal: true }} />}
              </form.AppField>

              <form.AppField name="capacity">
                {(field) => <field.TextInputField label={SharedTexts.Capacity} placeholder={CrmTexts.Customers.Form.CapacityPlaceholder} />}
              </form.AppField>

              <form.AppField name="environmentType">
                {(field) => <field.TextInputField label={SharedTexts.EnvironmentType} placeholder={SharedTexts.EnvironmentType} />}
              </form.AppField>

              <form.AppField name="elevatorSpeed">
                {(field) => <field.TextInputField label={SharedTexts.ElevatorSpeed} placeholder={CrmTexts.Customers.Form.SpeedPlaceholder} />}
              </form.AppField>

              <form.AppField name="requestedPackageType">
                {(field) => <field.TextInputField label={SharedTexts.RequestedPackageType} placeholder={CrmTexts.Customers.Form.PackageTypePlaceholder} />}
              </form.AppField>
            </SimpleGrid>

            <form.AppField name="usageTypes">
              {(field) => (
                <field.CheckboxGroupField
                  label={SharedTexts.UsageType.Label}
                  data={usageTypeOptions}
                  groupClassName="rounded-xl border border-slate-200 bg-slate-50 p-3"
                />
              )}
            </form.AppField>
          </Stack>
        </FormSection>

        <FormSection title={SharedTexts.DoorSpecifications}>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            <form.AppField name="doorType">
              {(field) => <field.SelectField label={SharedTexts.DoorType.Label} data={doorTypeOptions} comboboxProps={{ withinPortal: true }} />}
            </form.AppField>

            <form.AppField name="doorOpeningType">
              {(field) => <field.SelectField label={SharedTexts.DoorOpeningType.Label} data={doorOpeningTypeOptions} comboboxProps={{ withinPortal: true }} />}
            </form.AppField>

            <form.AppField name="floorDoorArrangement">
              {(field) => <field.SelectField label={SharedTexts.FloorDoorArrangement.Label} data={floorDoorArrangementOptions} comboboxProps={{ withinPortal: true }} />}
            </form.AppField>

            <form.AppField name="doorWidth">
              {(field) => <field.TextInputField label={SharedTexts.DoorWidth} placeholder={CrmTexts.Customers.Form.MeterPlaceholder} />}
            </form.AppField>

            <form.AppField name="doorHeight">
              {(field) => <field.TextInputField label={SharedTexts.DoorHeight} placeholder={CrmTexts.Customers.Form.MeterPlaceholder} />}
            </form.AppField>

            <form.AppField name="doorStainlessSteelType">
              {(field) => <field.TextInputField label={SharedTexts.DoorStainlessSteelType} placeholder={SharedTexts.DoorStainlessSteelType} />}
            </form.AppField>
          </SimpleGrid>
        </FormSection>

        <FormSection title={SharedTexts.ShaftSpecifications}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
              <form.AppField name="shaftIronwork">
                {(field) => <field.RadioGroupField label={SharedTexts.ShaftIronwork.Label} data={shaftIronworkOptions} />}
              </form.AppField>

              <form.AppField name="foundationIntrusionIntoShaft">
                {(field) => <field.RadioGroupField label={SharedTexts.FoundationIntrusionIntoShaft.Label} data={foundationIntrusionOptions} />}
              </form.AppField>

              <form.AppField name="isShaftSuspended">
                {(field) => <field.RadioGroupField label={SharedTexts.IsShaftSuspended.Label} data={isShaftSuspendedOptions} />}
              </form.AppField>

              <form.AppField name="canPitBeDemolished">
                {(field) => <field.RadioGroupField label={SharedTexts.CanPitBeDemolished.Label} data={canPitBeDemolishedOptions} />}
              </form.AppField>

              <form.AppField name="isShaftSurroundingOpen">
                {(field) => <field.RadioGroupField label={SharedTexts.IsShaftSurroundingOpen.Label} data={isShaftSurroundingOpenOptions} />}
              </form.AppField>

              <form.AppField name="shaftWidth">
                {(field) => <field.TextInputField label={SharedTexts.ShaftWidth} placeholder={CrmTexts.Customers.Form.MeterPlaceholder} />}
              </form.AppField>

              <form.AppField name="shaftDepth">
                {(field) => <field.TextInputField label={SharedTexts.ShaftDepth} placeholder={CrmTexts.Customers.Form.MeterPlaceholder} />}
              </form.AppField>

              <form.AppField name="shaftHeight">
                {(field) => <field.TextInputField label={SharedTexts.ShaftHeight} placeholder={CrmTexts.Customers.Form.MeterPlaceholder} />}
              </form.AppField>

              <form.AppField name="pitHeightWithoutFlooring">
                {(field) => <field.TextInputField label={SharedTexts.PitHeightWithoutFlooring} placeholder={CrmTexts.Customers.Form.MeterPlaceholder} />}
              </form.AppField>

              <form.AppField name="overheadWithoutFlooring">
                {(field) => <field.TextInputField label={SharedTexts.OverheadWithoutFlooring} placeholder={CrmTexts.Customers.Form.MeterPlaceholder} />}
              </form.AppField>

              <form.AppField name="travelLength">
                {(field) => <field.TextInputField label={SharedTexts.TravelLength} placeholder={CrmTexts.Customers.Form.MeterPlaceholder} />}
              </form.AppField>
            </SimpleGrid>

            <form.AppField name="shaftSurroundingCoveringTypes">
              {(field) => (
                <field.CheckboxGroupField
                  label={SharedTexts.ShaftSurroundingCoveringType.Label}
                  data={shaftSurroundingCoveringTypeOptions}
                  groupClassName="rounded-xl border border-slate-200 bg-slate-50 p-3"
                />
              )}
            </form.AppField>
          </Stack>
        </FormSection>

        <FormSection title={CrmTexts.Customers.Form.CrmTrackingSection} description={CrmTexts.Customers.Form.CrmTrackingDescription}>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            <form.AppField name="source">
              {(field) => <field.TextInputField label={CrmTexts.Customers.Table.Source} placeholder={CrmTexts.Customers.Form.SourcePlaceholder} />}
            </form.AppField>

            <form.AppField name="salesExpert">
              {(field) => <field.TextInputField label={CrmTexts.Customers.Table.SalesExpert} placeholder={CrmTexts.Customers.Form.SalesExpertPlaceholder} />}
            </form.AppField>

            <form.AppField name="status">
              {(field) => <field.SelectField label={CrmTexts.Customers.Form.StatusLabel} data={statusOptions} comboboxProps={{ withinPortal: true }} />}
            </form.AppField>

            <form.AppField name="priority">
              {(field) => <field.SelectField label={CrmTexts.Customers.Form.PriorityLabel} data={priorityOptions} comboboxProps={{ withinPortal: true }} />}
            </form.AppField>

            <form.AppField name="lastContact">
              {(field) => <field.DatePickerField label={CrmTexts.Customers.Table.LastContact} />}
            </form.AppField>

            <form.AppField name="nextStep">
              {(field) => <field.TextInputField label={CrmTexts.Customers.Table.NextStep} placeholder={CrmTexts.Customers.Form.NextStepPlaceholder} />}
            </form.AppField>

            <form.AppField name="estimatedValue">
              {(field) => <field.TextInputField label={CrmTexts.Customers.Table.EstimatedValue} placeholder={CrmTexts.Customers.Form.EstimatedValuePlaceholder} />}
            </form.AppField>
          </SimpleGrid>

          <form.AppField name="description">
            {(field) => <field.TextareaField label={SharedTexts.Description} placeholder={CrmTexts.Customers.Form.DescriptionPlaceholder} minRows={4} />}
          </form.AppField>
        </FormSection>

        <Group justify="flex-end" gap="sm">
          <Button type="button" variant="default" onClick={onCancel}>
            {CrmTexts.Customers.Form.CancelButton}
          </Button>
          <form.SubmitButton>{isEditMode ? CrmTexts.Customers.Form.UpdateButton : CrmTexts.Customers.Form.SaveButton}</form.SubmitButton>
        </Group>
      </form>
    </form.AppForm>
  );
}
