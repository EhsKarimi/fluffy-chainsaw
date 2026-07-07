import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { RequirePermission } from "@/modules/auth/components/RequirePermission";
import { PermissionKeys } from "@/modules/auth/types/auth.types";
import { CustomerFormPage } from "@/modules/crm/components/CustomerFormPage";
import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { loadCustomersFromStorage, saveCustomersToStorage } from "@/modules/crm/utils/customer-storage";
import { useAppListReturnNavigation } from "@/shared/list-state";

export const Route = createFileRoute("/crm/customers/$customerId/edit")({
  component: CustomerEditRoute,
});

function CustomerEditRoute() {
  return (
    <RequirePermission permission={PermissionKeys.CrmCustomersView}>
      <CustomerEditPage />
    </RequirePermission>
  );
}

function CustomerEditPage() {
  const { customerId } = Route.useParams();
  const navigateToCustomerList = useAppListReturnNavigation({ fallbackTo: "/crm/customers" });
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => loadCustomersFromStorage());
  const parsedCustomerId = Number(customerId);
  const customer = Number.isFinite(parsedCustomerId) ? customers.find((currentCustomer) => currentCustomer.id === parsedCustomerId) : undefined;

  const handleSubmitCustomer = async (values: Omit<CustomerRecord, "id">) => {
    if (!customer) {
      return;
    }

    const nextCustomers = customers.map((currentCustomer) => (currentCustomer.id === customer.id ? { ...values, id: customer.id } : currentCustomer));

    saveCustomersToStorage(nextCustomers);
    setCustomers(nextCustomers);
    await navigateToCustomerList();
  };

  if (!customer) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{CrmTexts.Customers.EditCustomerTitle}</h1>
            <p className="mt-1.5 text-sm text-slate-500">{CrmTexts.Customers.Form.CustomerNotFoundDescription}</p>
          </div>
          <Button variant="default" leftSection={<IconArrowRight size={18} />} onClick={() => void navigateToCustomerList()}>
            {CrmTexts.Customers.Form.BackToListButton}
          </Button>
        </div>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          {CrmTexts.Customers.Form.CustomerNotFoundTitle}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{CrmTexts.Customers.EditCustomerTitle}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{CrmTexts.Customers.Form.FormPageDescription}</p>
        </div>
        <Button variant="default" leftSection={<IconArrowRight size={18} />} onClick={() => void navigateToCustomerList()}>
          {CrmTexts.Customers.Form.BackToListButton}
        </Button>
      </div>

      <CustomerFormPage customer={customer} onCancel={() => void navigateToCustomerList()} onSubmit={handleSubmitCustomer} />
    </div>
  );
}
