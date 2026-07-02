import { type CustomerPriority, type CustomerStatus } from "@/modules/crm/types/customer.types";

export type CustomerListFilterValues = {
  query: string;
  provinceId: string;
  countyId: string;
  status: CustomerStatus | "";
  priority: CustomerPriority | "";
  source: string;
  salesExpert: string;
  elevatorType: string;
  usageType: string;
  environmentType: string;
  numberOfStopsFrom: string;
  numberOfStopsTo: string;
  numberOfUnitsFrom: string;
  numberOfUnitsTo: string;
  visitDateFrom: string;
  visitDateTo: string;
  lastContactFrom: string;
  lastContactTo: string;
  estimatedValueContains: string;
};
