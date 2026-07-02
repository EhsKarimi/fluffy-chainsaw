import { AppDatePicker, type AppDatePickerProps } from "@/shared/components/form/AppDatePicker";
import { getFirstFieldError } from "@/shared/components/form/fieldError";
import { useFieldContext } from "@/shared/components/form/form-context";

type DatePickerFieldProps = Omit<AppDatePickerProps, "onChange" | "value">;

export function DatePickerField({ error, ...datePickerProps }: DatePickerFieldProps) {
  const field = useFieldContext<string>();
  const fieldError = getFirstFieldError(field.state.meta.errors);

  return (
    <AppDatePicker
      {...datePickerProps}
      value={field.state.value}
      onChange={(formattedValue) => {
        field.handleChange(formattedValue);
      }}
      error={error ?? fieldError}
    />
  );
}
