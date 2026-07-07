import { Alert, Button } from "@mantine/core";
import { IconDeviceFloppy, IconInfoCircle, IconRestore } from "@tabler/icons-react";
import { useEffect } from "react";

import { usePersonalization } from "@/modules/profile/context/usePersonalization";
import { type UserPersonalizationSettings } from "@/modules/profile/types/personalization.types";
import { useAppForm } from "@/shared/components/form/form";
import { SharedTexts } from "@/shared/constants/SharedTexts";

const fontSizeOptions = [
  { value: "compact", label: SharedTexts.Profile.Personalization.FontSizeOptions.Compact },
  { value: "normal", label: SharedTexts.Profile.Personalization.FontSizeOptions.Normal },
  { value: "large", label: SharedTexts.Profile.Personalization.FontSizeOptions.Large },
  { value: "extraLarge", label: SharedTexts.Profile.Personalization.FontSizeOptions.ExtraLarge },
];

const densityOptions = [
  { value: "compact", label: SharedTexts.Profile.Personalization.DensityOptions.Compact },
  { value: "normal", label: SharedTexts.Profile.Personalization.DensityOptions.Normal },
  { value: "comfortable", label: SharedTexts.Profile.Personalization.DensityOptions.Comfortable },
];

const tablePageSizeOptions = [10, 20, 50, 100].map((pageSize) => ({ value: String(pageSize), label: String(pageSize) }));

function getOptionLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function ProfilePersonalizationTab() {
  const { isSaving, isSyncing, resetSettings, saveSettings, settings } = usePersonalization();

  const form = useAppForm({
    defaultValues: {
      ...settings,
      defaultTablePageSize: String(settings.defaultTablePageSize),
    },
    onSubmit: async ({ value }) => {
      await saveSettings({
        ...value,
        defaultTablePageSize: Number(value.defaultTablePageSize) as UserPersonalizationSettings["defaultTablePageSize"],
      });
    },
  });

  useEffect(() => {
    form.setFieldValue("fontSize", settings.fontSize);
    form.setFieldValue("density", settings.density);
    form.setFieldValue("defaultTablePageSize", String(settings.defaultTablePageSize));
    form.setFieldValue("reduceMotion", settings.reduceMotion);
  }, [form, settings]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">{SharedTexts.Profile.Personalization.Title}</h2>
            <p className="mt-1.5 text-sm text-slate-500">{SharedTexts.Profile.Personalization.Description}</p>
          </div>

          {isSyncing ? (
            <Alert color="atisCyan" radius="lg" icon={<IconInfoCircle size={18} />}>
              {SharedTexts.Profile.Personalization.Syncing}
            </Alert>
          ) : null}

          <form.AppForm>
            <form
              noValidate
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.AppField name="fontSize">
                  {(field) => (
                    <field.SelectField
                      label={SharedTexts.Profile.Personalization.FontSize}
                      data={fontSizeOptions}
                      allowDeselect={false}
                      comboboxProps={{ withinPortal: true }}
                    />
                  )}
                </form.AppField>

                <form.AppField name="density">
                  {(field) => (
                    <field.SelectField
                      label={SharedTexts.Profile.Personalization.Density}
                      data={densityOptions}
                      allowDeselect={false}
                      comboboxProps={{ withinPortal: true }}
                    />
                  )}
                </form.AppField>

                <form.AppField name="defaultTablePageSize">
                  {(field) => (
                    <field.SelectField
                      label={SharedTexts.Profile.Personalization.DefaultTablePageSize}
                      data={tablePageSizeOptions}
                      allowDeselect={false}
                      comboboxProps={{ withinPortal: true }}
                    />
                  )}
                </form.AppField>

                <form.AppField name="reduceMotion">
                  {(field) => <field.CheckboxField label={SharedTexts.Profile.Personalization.ReduceMotion} mt="xl" />}
                </form.AppField>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="default"
                  leftSection={<IconRestore size={16} />}
                  onClick={() => void resetSettings()}
                  disabled={isSaving}
                >
                  {SharedTexts.Profile.Personalization.ResetButton}
                </Button>
                <form.SubmitButton leftSection={<IconDeviceFloppy size={16} />} disableWhenInvalid={false} loading={isSaving}>
                  {SharedTexts.Profile.Personalization.SaveButton}
                </form.SubmitButton>
              </div>
            </form>
          </form.AppForm>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900">{SharedTexts.Profile.Personalization.Summary.Title}</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryItem label={SharedTexts.Profile.Personalization.Summary.FontSize} value={getOptionLabel(fontSizeOptions, settings.fontSize)} />
            <SummaryItem label={SharedTexts.Profile.Personalization.Summary.Density} value={getOptionLabel(densityOptions, settings.density)} />
            <SummaryItem label={SharedTexts.Profile.Personalization.Summary.DefaultRows} value={String(settings.defaultTablePageSize)} />
            <SummaryItem
              label={SharedTexts.Profile.Personalization.Summary.Motion}
              value={
                settings.reduceMotion
                  ? SharedTexts.Profile.Personalization.Summary.MotionReduced
                  : SharedTexts.Profile.Personalization.Summary.MotionNormal
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value: string;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
