export const LocalStorageKeys = {
  AuthToken: "atis.auth_token",
  CrmCustomers: "atis.crm.customers",
  UserPersonalization: "atis.user.personalization",
  StorageSchemaVersion: "atis.storage.schema_version",
  MockDataVersion: "atis.mock_data.version",
} as const;

export const STORAGE_SCHEMA_VERSION = "1";
export const MOCK_DATA_VERSION = "2";

export const AppLocalStorageKeys = [
  LocalStorageKeys.AuthToken,
  LocalStorageKeys.CrmCustomers,
  LocalStorageKeys.UserPersonalization,
  LocalStorageKeys.StorageSchemaVersion,
  LocalStorageKeys.MockDataVersion,
] as const;

export const MockDataLocalStorageKeys = [LocalStorageKeys.CrmCustomers] as const;
