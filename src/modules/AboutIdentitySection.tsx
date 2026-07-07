import { aboutFormOptions } from "@/modules/about-form-options";
import { withForm } from "@/shared/components/form/form";

export const AboutIdentitySection = withForm({
  ...aboutFormOptions,
  props: {
    title: "",
  },
  render: function Render({ form, title }) {
    return (
      <fieldset className="flex flex-col gap-4">
        <legend className="font-semibold">{title}</legend>

        <form.AppField name="name">{(field) => <field.TextInputField label="Name" placeholder="Enter your name" />}</form.AppField>

        <form.AppField name="email">{(field) => <field.TextInputField label="Email" placeholder="Enter your email" />}</form.AppField>
      </fieldset>
    );
  },
});
