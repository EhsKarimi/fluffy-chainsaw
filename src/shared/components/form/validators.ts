import { SharedTexts } from "@/shared/constants/SharedTexts";

export function validateRequiredText(value: string) {
  return value.trim() ? undefined : SharedTexts.Errors.RequiredField;
}
