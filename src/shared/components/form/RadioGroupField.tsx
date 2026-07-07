import { Radio, type RadioGroupProps, type RadioProps } from "@mantine/core";
import { type ReactNode } from "react";

import { getFirstFieldError } from "@/shared/components/form/fieldError";
import { useFieldContext } from "@/shared/components/form/form-context";

type RadioGroupOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type RadioGroupFieldProps = Omit<RadioGroupProps, "children" | "defaultValue" | "name" | "value"> & {
  data: RadioGroupOption[];
  groupClassName?: string;
  radioSize?: RadioProps["size"];
};

export function RadioGroupField({ data, error, groupClassName, id, onChange, radioSize = "sm", ...radioGroupProps }: RadioGroupFieldProps) {
  const field = useFieldContext<string>();
  const fieldError = getFirstFieldError(field.state.meta.errors);

  return (
    <Radio.Group
      {...radioGroupProps}
      id={id ?? field.name}
      name={field.name}
      value={field.state.value}
      error={error ?? fieldError}
      data-atis-field-error={fieldError ? "true" : undefined}
      onChange={(value) => {
        field.handleChange(value);
        onChange?.(value);
      }}
    >
      <div className={groupClassName ?? "mt-2 flex flex-wrap gap-4"}>
        {data.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} disabled={option.disabled} size={radioSize} />
        ))}
      </div>
    </Radio.Group>
  );
}
