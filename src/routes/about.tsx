import { createFileRoute } from "@tanstack/react-router";

import { useAppForm } from "@/shared/components/form/form";
import { requestScrollToFirstFormError } from "@/shared/components/form/scrollToFirstFormError";

export const Route = createFileRoute("/about")({
  component: About,
});

type AboutFormValues = {
  name: string;
  isChecked: boolean;
};

export function About() {
  const form = useAppForm({
    defaultValues: {
      name: "",
      isChecked: false,
    } satisfies AboutFormValues,
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form.AppForm>
      <div className="p-2">
        <form
          noValidate
          className="flex max-w-md flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            const formElement = event.currentTarget;

            void form.handleSubmit();
            requestScrollToFirstFormError(formElement);
          }}
        >
          <form.AppField name="name" children={(field) => <field.TextInputField label="Name" placeholder="Enter your name" />} />

          <form.AppField name="isChecked" children={(field) => <field.CheckboxField label="I accept the terms" />} />

          <form.SubmitButton>Save</form.SubmitButton>
        </form>

        <form.Subscribe selector={(state) => state.values} children={(values) => <pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>} />
      </div>
    </form.AppForm>
  );
}
