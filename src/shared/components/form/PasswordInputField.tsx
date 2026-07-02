import { PasswordInput, type PasswordInputProps } from "@mantine/core";

import { getFirstFieldError } from "@/shared/components/form/fieldError";
import { useFieldContext } from "@/shared/components/form/form-context";

type PasswordInputFieldProps = Omit<PasswordInputProps, "defaultValue" | "name" | "value">;

export function PasswordInputField({ error, id, onBlur, onChange, ...passwordInputProps }: PasswordInputFieldProps) {
  const field = useFieldContext<string>();
  const fieldError = getFirstFieldError(field.state.meta.errors);

  return (
    <PasswordInput
      {...passwordInputProps}
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
