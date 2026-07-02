import { TextInput, type TextInputProps } from "@mantine/core";

import { getFirstFieldError } from "@/shared/components/form/fieldError";
import { useFieldContext } from "@/shared/components/form/form-context";

type TextInputFieldProps = Omit<TextInputProps, "defaultValue" | "name" | "value">;

export function TextInputField({ error, id, onBlur, onChange, ...textInputProps }: TextInputFieldProps) {
  const field = useFieldContext<string>();
  const fieldError = getFirstFieldError(field.state.meta.errors);

  return (
    <TextInput
      {...textInputProps}
      id={id ?? field.name}
      name={field.name}
      value={field.state.value}
      data-atis-field-error={fieldError ? "true" : undefined}
      error={error ?? fieldError}
      onBlur={(event) => {
        field.handleBlur();
        onBlur?.(event);
      }}
      onChange={(event) => {
        field.handleChange(event.currentTarget.value);
        onChange?.(event);
      }}
    />
  );
}
