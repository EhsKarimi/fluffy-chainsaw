import { defaultCustomers } from "@/modules/crm/constants/customer-defaults";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { LocalStorageKeys } from "@/shared/constants/LocalStorageKeys";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function customerLooksValid(customer: unknown): customer is CustomerRecord {
  return (
    typeof customer === "object" &&
    customer !== null &&
    "id" in customer &&
    typeof customer.id === "number" &&
    "employerName" in customer &&
    typeof customer.employerName === "string"
  );
}

export function loadCustomersFromStorage(): CustomerRecord[] {
  if (!canUseLocalStorage()) {
    return defaultCustomers;
  }

  const storedCustomers = window.localStorage.getItem(LocalStorageKeys.CrmCustomers);

  if (!storedCustomers) {
    return defaultCustomers;
  }

  try {
    const parsedCustomers: unknown = JSON.parse(storedCustomers);

    if (Array.isArray(parsedCustomers) && parsedCustomers.every(customerLooksValid)) {
      return parsedCustomers;
    }
  } catch {
    return defaultCustomers;
  }

  return defaultCustomers;
}

export function saveCustomersToStorage(customers: CustomerRecord[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(LocalStorageKeys.CrmCustomers, JSON.stringify(customers));
}

export function getNextCustomerId(customers: CustomerRecord[]) {
  const highestId = customers.reduce((currentHighestId, customer) => Math.max(currentHighestId, customer.id), 1000);

  return highestId + 1;
}
