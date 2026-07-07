import {
  AppLocalStorageKeys,
  LocalStorageKeys,
  MOCK_DATA_VERSION,
  MockDataLocalStorageKeys,
  STORAGE_SCHEMA_VERSION,
} from "@/shared/constants/LocalStorageKeys";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function removeKeys(keys: readonly string[]) {
  for (const key of keys) {
    window.localStorage.removeItem(key);
  }
}

function resetIncompatibleStorageSchema(storedSchemaVersion: string | null) {
  if (!storedSchemaVersion || storedSchemaVersion === STORAGE_SCHEMA_VERSION) {
    return;
  }

  removeKeys(AppLocalStorageKeys);
}

function resetOutdatedMockData(storedMockDataVersion: string | null) {
  if (storedMockDataVersion === MOCK_DATA_VERSION) {
    return;
  }

  removeKeys(MockDataLocalStorageKeys);
}

export function initializeAppStorage() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    const storedSchemaVersion = window.localStorage.getItem(LocalStorageKeys.StorageSchemaVersion);

    resetIncompatibleStorageSchema(storedSchemaVersion);

    const currentStoredMockDataVersion = window.localStorage.getItem(LocalStorageKeys.MockDataVersion);

    resetOutdatedMockData(currentStoredMockDataVersion);

    window.localStorage.setItem(LocalStorageKeys.StorageSchemaVersion, STORAGE_SCHEMA_VERSION);
    window.localStorage.setItem(LocalStorageKeys.MockDataVersion, MOCK_DATA_VERSION);
  } catch {
    // Some browsers/users can block storage access. The app should still boot and fall back to in-memory/default data.
  }
}
