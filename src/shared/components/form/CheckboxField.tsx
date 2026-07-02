import { Checkbox, type CheckboxProps } from "@mantine/core";

import { getFirstFieldError } from "@/shared/components/form/fieldError";
import { useFieldContext } from "@/shared/components/form/form-context";

type CheckboxFieldProps = Omit<CheckboxProps, "checked" | "defaultChecked" | "name">;

export function CheckboxField({ error, id, onBlur, onChange, ...checkboxProps }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const fieldError = getFirstFieldError(field.state.meta.errors);

  return (
    <Checkbox
      {...checkboxProps}
      id={id ?? field.name}
      name={field.name}
      checked={field.state.value}
      error={error ?? fieldError}
      data-atis-field-error={fieldError ? "true" : undefined}
      onBlur={(event) => {
        field.handleBlur();
        onBlur?.(event);
      }}
      onChange={(event) => {
        field.handleChange(event.currentTarget.checked);
        onChange?.(event);
      }}
    />
  );
}
