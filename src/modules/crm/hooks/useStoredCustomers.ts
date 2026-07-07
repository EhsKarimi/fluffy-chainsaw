import { useEffect, useState } from "react";

import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { loadCustomersFromStorage, saveCustomersToStorage } from "@/modules/crm/utils/customer-storage";

export function useStoredCustomers() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => loadCustomersFromStorage());

  useEffect(() => {
    saveCustomersToStorage(customers);
  }, [customers]);

  return [customers, setCustomers] as const;
}
