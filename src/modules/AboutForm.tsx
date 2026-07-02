import { useAppForm } from "@/shared/components/form/form";
import { requestScrollToFirstFormError } from "@/shared/components/form/scrollToFirstFormError";

import { AboutIdentitySection } from "@/modules/AboutIdentitySection";
import { AboutPreferencesSection } from "@/modules/AboutPreferencesSection";
import { aboutFormOptions } from "@/modules/about-form-options";

export function AboutForm() {
  const form = useAppForm({
    ...aboutFormOptions,
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form.AppForm>
      <form
        noValidate
        className="flex max-w-md flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          const formElement = event.currentTarget;

          void form.handleSubmit();
          requestScrollToFirstFormError(formElement);
        }}
      >
        <AboutIdentitySection form={form} title="Identity" />

        <AboutPreferencesSection form={form} title="Preferences" />

        <form.SubmitButton>Save</form.SubmitButton>
      </form>
    </form.AppForm>
  );
}
