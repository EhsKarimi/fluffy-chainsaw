import { aboutFormOptions } from "@/modules/about-form-options";
import { withForm } from "@/shared/components/form/form";

export const AboutPreferencesSection = withForm({
  ...aboutFormOptions,
  props: {
    title: "",
  },
  render: function Render({ form, title }) {
    return (
      <fieldset className="flex flex-col gap-4">
        <legend className="font-semibold">{title}</legend>

        <form.AppField name="isChecked">{(field) => <field.CheckboxField label="I accept the terms" />}</form.AppField>
      </fieldset>
    );
  },
});
