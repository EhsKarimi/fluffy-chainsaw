import { formOptions } from "@tanstack/react-form";

export type AboutFormValues = {
  name: string;
  email: string;
  isChecked: boolean;
};

export const aboutFormOptions = formOptions({
  defaultValues: {
    name: "",
    email: "",
    isChecked: false,
  } satisfies AboutFormValues,
});
