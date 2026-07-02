import { Button, type ButtonProps } from "@mantine/core";

import { useFormContext } from "@/shared/components/form/form-context";

type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  disableWhenInvalid?: boolean;
};

export function SubmitButton({ children = "Submit", disabled, disableWhenInvalid = true, loading, ...buttonProps }: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
      {([canSubmit, isSubmitting]) => (
        <Button {...buttonProps} type="submit" disabled={disabled || (disableWhenInvalid && !canSubmit)} loading={loading || isSubmitting}>
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}
