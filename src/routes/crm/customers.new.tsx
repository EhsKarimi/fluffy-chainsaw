import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { CustomerFormPage } from "@/modules/crm/components/CustomerFormPage";
import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { getNextCustomerId, loadCustomersFromStorage, saveCustomersToStorage } from "@/modules/crm/utils/customer-storage";
import { useAppListReturnNavigation } from "@/shared/list-state";

export const Route = createFileRoute("/crm/customers/new")({
  component: CustomerCreateRoute,
});

function CustomerCreateRoute() {
  return (
    <RequirePermission permission={PermissionKeys.CrmCustomersCreate}>
      <CustomerCreatePage />
    </RequirePermission>
  );
}

function CustomerCreatePage() {
  const navigateToCustomerList = useAppListReturnNavigation({ fallbackTo: "/crm/customers" });
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => loadCustomersFromStorage());

  const handleSubmitCustomer = async (values: Omit<CustomerRecord, "id">) => {
    const nextCustomers = [{ ...values, id: getNextCustomerId(customers) }, ...customers];

    saveCustomersToStorage(nextCustomers);
    setCustomers(nextCustomers);
    await navigateToCustomerList();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{CrmTexts.Customers.AddCustomerTitle}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{CrmTexts.Customers.Form.FormPageDescription}</p>
        </div>
        <Button variant="default" leftSection={<IconArrowRight size={18} />} onClick={() => void navigateToCustomerList()}>
          {CrmTexts.Customers.Form.BackToListButton}
        </Button>
      </div>

      <CustomerFormPage customer={null} onCancel={() => void navigateToCustomerList()} onSubmit={handleSubmitCustomer} />
    </div>
  );
}
