import { Group, Radio, type MantineSpacing, type RadioGroupProps, type RadioProps } from "@mantine/core";
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
  groupGap?: MantineSpacing;
  radioSize?: RadioProps["size"];
};

export function RadioGroupField({ data, error, groupClassName, groupGap = "md", id, onChange, radioSize = "sm", ...radioGroupProps }: RadioGroupFieldProps) {
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
      <Group gap={groupGap} className={groupClassName} mt={radioGroupProps.label ? "xs" : 0}>
        {data.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} disabled={option.disabled} size={radioSize} />
        ))}
      </Group>
    </Radio.Group>
  );
}
