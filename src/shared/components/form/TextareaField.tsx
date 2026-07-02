import { Textarea, type TextareaProps } from "@mantine/core";

import { getFirstFieldError } from "@/shared/components/form/fieldError";
import { useFieldContext } from "@/shared/components/form/form-context";

type TextareaFieldProps = Omit<TextareaProps, "defaultValue" | "name" | "value">;

export function TextareaField({ error, id, onBlur, onChange, ...textareaProps }: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const fieldError = getFirstFieldError(field.state.meta.errors);

  return (
    <Textarea
      {...textareaProps}
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
