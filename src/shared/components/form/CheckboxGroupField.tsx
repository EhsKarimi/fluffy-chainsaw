import { Checkbox, Group, type CheckboxGroupProps, type CheckboxProps, type MantineSpacing } from "@mantine/core";
import { type ReactNode } from "react";

import { getFirstFieldError } from "@/shared/components/form/fieldError";
import { useFieldContext } from "@/shared/components/form/form-context";

type CheckboxGroupOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type CheckboxGroupFieldProps = Omit<CheckboxGroupProps, "children" | "defaultValue" | "name" | "value"> & {
  checkboxSize?: CheckboxProps["size"];
  data: CheckboxGroupOption[];
  groupClassName?: string;
  groupGap?: MantineSpacing;
};

export function CheckboxGroupField({
  checkboxSize = "sm",
  data,
  error,
  groupClassName,
  groupGap = "md",
  id,
  onChange,
  ...checkboxGroupProps
}: CheckboxGroupFieldProps) {
  const field = useFieldContext<string[]>();
  const fieldError = getFirstFieldError(field.state.meta.errors);

  return (
    <Checkbox.Group
      {...checkboxGroupProps}
      id={id ?? field.name}
      value={field.state.value}
      error={error ?? fieldError}
      data-atis-field-error={fieldError ? "true" : undefined}
      onChange={(value) => {
        field.handleChange(value);
        onChange?.(value);
      }}
    >
      <Group gap={groupGap} className={groupClassName} mt={checkboxGroupProps.label ? "xs" : 0}>
        {data.map((option) => (
          <Checkbox key={option.value} value={option.value} label={option.label} disabled={option.disabled} size={checkboxSize} />
        ))}
      </Group>
    </Checkbox.Group>
  );
}
