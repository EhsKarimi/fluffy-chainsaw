import { type CustomerListFilterValues } from "@/modules/crm/types/customer-filter.types";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { getCountyName, getProvinceName } from "@/shared/utils/iran-location";

export const defaultCustomerListFilterValues: CustomerListFilterValues = {
  query: "",
  provinceId: "",
  countyId: "",
  status: "",
  priority: "",
  source: "",
  salesExpert: "",
  elevatorType: "",
  usageType: "",
  environmentType: "",
  numberOfStopsFrom: "",
  numberOfStopsTo: "",
  numberOfUnitsFrom: "",
  numberOfUnitsTo: "",
  visitDateFrom: "",
  visitDateTo: "",
  lastContactFrom: "",
  lastContactTo: "",
  estimatedValueContains: "",
};

function normalizeDigits(value: string) {
  return value
    .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}
function normalizeText(value: string) {
  return normalizeDigits(value).replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/\s+/g, " ").trim().toLocaleLowerCase("fa-IR");
}

function normalizeNumber(value: string) {
  const normalizedValue = normalizeDigits(value)
    .replace(/[^0-9.-]/g, "")
    .trim();

  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function normalizeDate(value: string) {
  const normalizedValue = normalizeDigits(value).replace(/[^0-9/.-]/g, "");
  // eslint-disable-next-line no-useless-escape
  const parts = normalizedValue.split(/[/.\-]/).filter(Boolean);

  if (parts.length !== 3) {
    return "";
  }

  const [year, month, day] = parts;

  if (!year || !month || !day) {
    return "";
  }

  return `${year.padStart(4, "0")}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
}

function isWithinDateRange(value: string, from: string, to: string) {
  const normalizedValue = normalizeDate(value);
  const normalizedFrom = normalizeDate(from);
  const normalizedTo = normalizeDate(to);

  if (!normalizedValue) {
    return !normalizedFrom && !normalizedTo;
  }

  if (normalizedFrom && normalizedValue < normalizedFrom) {
    return false;
  }

  if (normalizedTo && normalizedValue > normalizedTo) {
    return false;
  }

  return true;
}

function isWithinNumberRange(value: string, from: string, to: string) {
  const normalizedValue = normalizeNumber(value);
  const normalizedFrom = normalizeNumber(from);
  const normalizedTo = normalizeNumber(to);

  if (normalizedValue === undefined) {
    return normalizedFrom === undefined && normalizedTo === undefined;
  }

  if (normalizedFrom !== undefined && normalizedValue < normalizedFrom) {
    return false;
  }

  if (normalizedTo !== undefined && normalizedValue > normalizedTo) {
    return false;
  }

  return true;
}

function createSearchText(customer: CustomerRecord) {
  return normalizeText(
    [
      customer.id,
      customer.employerName,
      customer.requesterName,
      customer.contactNumber,
      customer.email,
      customer.projectName,
      customer.projectAddress,
      getProvinceName(customer.provinceId),
      getCountyName(customer.countyId),
      customer.source,
      customer.salesExpert,
      customer.nextStep,
      customer.estimatedValue,
      customer.environmentType,
      customer.elevatorType,
      customer.requestedPackageType,
      customer.description,
    ].join(" "),
  );
}

export function countActiveCustomerFilters(filters: CustomerListFilterValues) {
  return (Object.values(filters) as string[]).filter((value) => value.trim().length > 0).length;
}

export function getUniqueCustomerTextOptions(customers: readonly CustomerRecord[], selector: (customer: CustomerRecord) => string) {
  const uniqueValues = Array.from(new Set(customers.map(selector).filter((value) => value.trim().length > 0)));

  return uniqueValues.sort((firstValue, secondValue) => firstValue.localeCompare(secondValue, "fa-IR")).map((value) => ({ value, label: value }));
}

export function filterCustomers(customers: readonly CustomerRecord[], filters: CustomerListFilterValues) {
  const normalizedQuery = normalizeText(filters.query);
  const normalizedEstimatedValue = normalizeText(filters.estimatedValueContains);

  return customers.filter((customer) => {
    if (normalizedQuery && !createSearchText(customer).includes(normalizedQuery)) {
      return false;
    }

    if (filters.provinceId && customer.provinceId !== filters.provinceId) {
      return false;
    }

    if (filters.countyId && customer.countyId !== filters.countyId) {
      return false;
    }

    if (filters.status && customer.status !== filters.status) {
      return false;
    }

    if (filters.priority && customer.priority !== filters.priority) {
      return false;
    }

    if (filters.source && customer.source !== filters.source) {
      return false;
    }

    if (filters.salesExpert && customer.salesExpert !== filters.salesExpert) {
      return false;
    }

    if (filters.elevatorType && customer.elevatorType !== filters.elevatorType) {
      return false;
    }

    if (filters.usageType && !customer.usageTypes.includes(filters.usageType)) {
      return false;
    }

    if (filters.environmentType && customer.environmentType !== filters.environmentType) {
      return false;
    }

    if (!isWithinNumberRange(customer.numberOfStops, filters.numberOfStopsFrom, filters.numberOfStopsTo)) {
      return false;
    }

    if (!isWithinNumberRange(customer.numberOfUnits, filters.numberOfUnitsFrom, filters.numberOfUnitsTo)) {
      return false;
    }

    if (!isWithinDateRange(customer.visitDate, filters.visitDateFrom, filters.visitDateTo)) {
      return false;
    }

    if (!isWithinDateRange(customer.lastContact, filters.lastContactFrom, filters.lastContactTo)) {
      return false;
    }

    if (normalizedEstimatedValue && !normalizeText(customer.estimatedValue).includes(normalizedEstimatedValue)) {
      return false;
    }

    return true;
  });
}
