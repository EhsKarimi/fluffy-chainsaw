import { type ComponentType, type ReactNode } from "react";
import { type Calendar, type Locale } from "react-date-object";
import persian from "react-date-object/calendars/persian.js";
import persianFa from "react-date-object/locales/persian_fa.js";
import DatePickerModule, { type CalendarProps, type DateObject, type DatePickerProps, type Value } from "react-multi-date-picker";

import { SharedTexts } from "@/shared/constants/SharedTexts";
import { cn } from "@/shared/utils/style";

type BaseDatePickerProps = Omit<CalendarProps<false, false>, "calendar" | "className" | "format" | "locale" | "onChange" | "value"> &
  Omit<DatePickerProps<false, false>, "calendar" | "format" | "inputClass" | "locale" | "onChange" | "value">;

export type AppDatePickerProps = BaseDatePickerProps & {
  value?: Value;
  onChange?: (formattedValue: string, date: DateObject | null) => void;
  calendar?: Calendar;
  locale?: Locale;
  format?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  rootClassName?: string;
  inputClassName?: string;
  calendarClassName?: string;
};

type ReactMultiDatePickerProps = Omit<CalendarProps<false, false>, "onChange"> & DatePickerProps<false, false>;
type DatePickerComponentType = ComponentType<ReactMultiDatePickerProps>;

const DatePicker = ((DatePickerModule as unknown as { default?: DatePickerComponentType }).default ?? DatePickerModule) as DatePickerComponentType;

const defaultInputClassName =
  "h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-atisCyan-500 focus:ring-2 focus:ring-atisCyan-100";

export function AppDatePicker({
  calendar = persian,
  calendarClassName,
  calendarPosition = "bottom-right",
  description,
  error,
  format = "YYYY/MM/DD",
  inputClassName,
  label,
  locale = persianFa,
  mobileLabels = {
    OK: SharedTexts.DatePicker.MobileOk,
    CANCEL: SharedTexts.DatePicker.MobileCancel,
  },
  onChange,
  placeholder = SharedTexts.DatePicker.Placeholder,
  portal = true,
  required,
  rootClassName,
  value,
  ...datePickerProps
}: AppDatePickerProps) {
  return (
    <div className={cn("space-y-1.5", rootClassName)} data-atis-field-error={error ? "true" : undefined} dir="rtl">
      {label ? (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required ? <span className="me-1 text-red-600">*</span> : null}
        </label>
      ) : null}
      {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      <DatePicker
        {...datePickerProps}
        calendar={calendar}
        calendarPosition={calendarPosition}
        className={cn("atis-date-picker-calendar", calendarClassName)}
        containerClassName="w-full"
        format={format}
        inputClass={cn(defaultInputClassName, error && "border-red-600", inputClassName)}
        locale={locale}
        mobileLabels={mobileLabels}
        onChange={(date) => {
          onChange?.(date ? date.format(format) : "", date);
        }}
        placeholder={placeholder}
        portal={portal}
        required={required}
        value={value}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
