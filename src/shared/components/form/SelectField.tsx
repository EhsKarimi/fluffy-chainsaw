import { Select, type SelectProps } from "@mantine/core";

import { getFirstFieldError } from "@/shared/components/form/fieldError";
import { useFieldContext } from "@/shared/components/form/form-context";

type SelectFieldProps = Omit<SelectProps, "defaultValue" | "name" | "value">;

export function SelectField({ error, id, onBlur, onChange, ...selectProps }: SelectFieldProps) {
  const field = useFieldContext<string>();
  const fieldError = getFirstFieldError(field.state.meta.errors);

  return (
    <Select
      {...selectProps}
      id={id ?? field.name}
      name={field.name}
      value={field.state.value}
      data-atis-field-error={fieldError ? "true" : undefined}
      error={error ?? fieldError}
      onBlur={(event) => {
        field.handleBlur();
        onBlur?.(event);
      }}
      onChange={(value, option) => {
        field.handleChange(value ?? "");
        onChange?.(value, option);
      }}
    />
  );
}
