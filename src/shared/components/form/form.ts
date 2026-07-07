import { createFormHook } from "@tanstack/react-form";

import { CheckboxField } from "@/shared/components/form/CheckboxField";
import { CheckboxGroupField } from "@/shared/components/form/CheckboxGroupField";
import { DatePickerField } from "@/shared/components/form/DatePickerField";
import { PasswordInputField } from "@/shared/components/form/PasswordInputField";
import { RadioGroupField } from "@/shared/components/form/RadioGroupField";
import { SelectField } from "@/shared/components/form/SelectField";
import { SubmitButton } from "@/shared/components/form/SubmitButton";
import { TextInputField } from "@/shared/components/form/TextInputField";
import { TextareaField } from "@/shared/components/form/TextareaField";
import { fieldContext, formContext } from "@/shared/components/form/form-context";

export const appForm = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxField,
    CheckboxGroupField,
    DatePickerField,
    PasswordInputField,
    RadioGroupField,
    SelectField,
    TextareaField,
    TextInputField,
  },
  formComponents: {
    SubmitButton,
  },
});

export const { useAppForm, withFieldGroup, withForm } = appForm;
