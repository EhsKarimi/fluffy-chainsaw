import { type UserPersonalizationSettings, type UserTablePageSize } from "@/modules/profile/types/personalization.types";
import { LocalStorageKeys } from "@/shared/constants/LocalStorageKeys";

const allowedFontSizes = ["compact", "normal", "large", "extraLarge"] as const;
const allowedDensities = ["compact", "normal", "comfortable"] as const;
const allowedTablePageSizes = [10, 20, 50, 100] as const;

export const defaultUserPersonalizationSettings: UserPersonalizationSettings = {
  fontSize: "normal",
  density: "normal",
  defaultTablePageSize: 10,
  reduceMotion: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseTablePageSize(value: unknown): UserTablePageSize {
  const numericValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

  return allowedTablePageSizes.includes(numericValue as UserTablePageSize)
    ? (numericValue as UserTablePageSize)
    : defaultUserPersonalizationSettings.defaultTablePageSize;
}

export function normalizeUserPersonalizationSettings(value: unknown): UserPersonalizationSettings {
  if (!isRecord(value)) {
    return defaultUserPersonalizationSettings;
  }

  return {
    fontSize: allowedFontSizes.includes(value.fontSize as UserPersonalizationSettings["fontSize"])
      ? (value.fontSize as UserPersonalizationSettings["fontSize"])
      : defaultUserPersonalizationSettings.fontSize,
    density: allowedDensities.includes(value.density as UserPersonalizationSettings["density"])
      ? (value.density as UserPersonalizationSettings["density"])
      : defaultUserPersonalizationSettings.density,
    defaultTablePageSize: parseTablePageSize(value.defaultTablePageSize),
    reduceMotion: typeof value.reduceMotion === "boolean" ? value.reduceMotion : defaultUserPersonalizationSettings.reduceMotion,
  };
}

export function loadUserPersonalizationSettingsFromStorage(): UserPersonalizationSettings {
  const savedSettings = window.localStorage.getItem(LocalStorageKeys.UserPersonalization);

  if (!savedSettings) {
    return defaultUserPersonalizationSettings;
  }

  try {
    return normalizeUserPersonalizationSettings(JSON.parse(savedSettings));
  } catch {
    return defaultUserPersonalizationSettings;
  }
}

export function saveUserPersonalizationSettingsToStorage(settings: UserPersonalizationSettings) {
  window.localStorage.setItem(LocalStorageKeys.UserPersonalization, JSON.stringify(settings));
}

export async function fetchUserPersonalizationSettingsFromApi(): Promise<UserPersonalizationSettings | null> {
  // API integration point: when the backend endpoint exists, fetch it here and return normalized settings.
  return Promise.resolve(null);
}

export async function saveUserPersonalizationSettingsToApi(settings: UserPersonalizationSettings): Promise<UserPersonalizationSettings> {
  // API integration point: when the backend endpoint exists, persist settings here and return the server value.
  return Promise.resolve(settings);
}
