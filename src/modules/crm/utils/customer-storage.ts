import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { defaultCustomers, emptyCustomerFormValues } from "@/modules/crm/constants/customer-defaults";
import { type CustomerPriority, type CustomerRecord, type CustomerStatus } from "@/modules/crm/types/customer.types";
import { LocalStorageKeys } from "@/shared/constants/LocalStorageKeys";
import { findCountyByName } from "@/shared/utils/iran-location";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function readCustomerId(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedId = Number(value);

    if (Number.isFinite(parsedId)) {
      return parsedId;
    }
  }

  return undefined;
}

function readStringArray(value: unknown, fallback: readonly string[]) {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function readCustomerStatus(value: unknown): CustomerStatus {
  return typeof value === "string" && value in CrmTexts.Customers.StatusLabels ? (value as CustomerStatus) : emptyCustomerFormValues.status;
}

function readCustomerPriority(value: unknown): CustomerPriority {
  return typeof value === "string" && value in CrmTexts.Customers.PriorityLabels ? (value as CustomerPriority) : emptyCustomerFormValues.priority;
}

function readSalesExpert(value: unknown, customerId: number) {
  if (typeof value === "string" && CrmTexts.Customers.SalesExpertOptions.some((option) => option === value)) {
    return value;
  }

  return (
    CrmTexts.Customers.SalesExpertOptions[(customerId - 1) % CrmTexts.Customers.SalesExpertOptions.length] ?? emptyCustomerFormValues.salesExpert
  );
}

function readLegacyLocation(candidate: Record<string, unknown>) {
  const provinceId = readString(candidate.provinceId, emptyCustomerFormValues.provinceId);
  const countyId = readString(candidate.countyId, emptyCustomerFormValues.countyId);

  if (provinceId || countyId) {
    return { provinceId, countyId };
  }

  const legacyCity = readString(candidate.city, "").trim();
  const matchedCounty = legacyCity ? findCountyByName(legacyCity) : undefined;

  return {
    provinceId: matchedCounty?.provinceId ?? emptyCustomerFormValues.provinceId,
    countyId: matchedCounty?.countyId ?? emptyCustomerFormValues.countyId,
  };
}

function readStoredCustomerArray(parsedCustomers: unknown): unknown[] | undefined {
  if (Array.isArray(parsedCustomers)) {
    return parsedCustomers;
  }

  if (typeof parsedCustomers !== "object" || parsedCustomers === null) {
    return undefined;
  }

  const candidate = parsedCustomers as Record<string, unknown>;

  if (Array.isArray(candidate.customers)) {
    return candidate.customers;
  }

  if (Array.isArray(candidate.items)) {
    return candidate.items;
  }

  if (Array.isArray(candidate.data)) {
    return candidate.data;
  }

  if (typeof candidate.state === "object" && candidate.state !== null) {
    const state = candidate.state as Record<string, unknown>;

    if (Array.isArray(state.customers)) {
      return state.customers;
    }
  }

  return undefined;
}

function normalizeCustomerRecord(customer: unknown): CustomerRecord | null {
  if (typeof customer !== "object" || customer === null) {
    return null;
  }

  const candidate = customer as Partial<Record<keyof CustomerRecord, unknown>> & Record<string, unknown>;
  const id = readCustomerId(candidate.id);
  const employerName = readString(candidate.employerName, emptyCustomerFormValues.employerName).trim();

  if (id === undefined || !employerName) {
    return null;
  }

  const legacyLocation = readLegacyLocation(candidate);

  return {
    id,
    visitDate: readString(candidate.visitDate, emptyCustomerFormValues.visitDate),
    visitCoordinationPhone: readString(candidate.visitCoordinationPhone, emptyCustomerFormValues.visitCoordinationPhone),
    referenceNumber: readString(candidate.referenceNumber, emptyCustomerFormValues.referenceNumber),
    projectName: readString(candidate.projectName, emptyCustomerFormValues.projectName),
    projectExpertise: readString(candidate.projectExpertise, emptyCustomerFormValues.projectExpertise),
    reference: readString(candidate.reference, emptyCustomerFormValues.reference),
    employerName,
    requesterName: readString(candidate.requesterName, emptyCustomerFormValues.requesterName),
    contactNumber: readString(candidate.contactNumber, emptyCustomerFormValues.contactNumber),
    email: readString(candidate.email, emptyCustomerFormValues.email),
    projectAddress: readString(candidate.projectAddress, emptyCustomerFormValues.projectAddress),
    provinceId: legacyLocation.provinceId,
    countyId: legacyLocation.countyId,
    source: readString(candidate.source, emptyCustomerFormValues.source),
    salesExpert: readSalesExpert(candidate.salesExpert, id),
    status: readCustomerStatus(candidate.status),
    priority: readCustomerPriority(candidate.priority),
    lastContact: readString(candidate.lastContact, emptyCustomerFormValues.lastContact),
    nextStep: readString(candidate.nextStep, emptyCustomerFormValues.nextStep),
    estimatedValue: readString(candidate.estimatedValue, emptyCustomerFormValues.estimatedValue),
    numberOfUnits: readString(candidate.numberOfUnits, emptyCustomerFormValues.numberOfUnits),
    numberOfStops: readString(candidate.numberOfStops, emptyCustomerFormValues.numberOfStops),
    elevatorType: readString(candidate.elevatorType, emptyCustomerFormValues.elevatorType),
    usageTypes: readStringArray(candidate.usageTypes, emptyCustomerFormValues.usageTypes),
    environmentType: readString(candidate.environmentType, emptyCustomerFormValues.environmentType),
    elevatorSpeed: readString(candidate.elevatorSpeed, emptyCustomerFormValues.elevatorSpeed),
    capacity: readString(candidate.capacity, emptyCustomerFormValues.capacity),
    doorType: readString(candidate.doorType, emptyCustomerFormValues.doorType),
    doorOpeningType: readString(candidate.doorOpeningType, emptyCustomerFormValues.doorOpeningType),
    floorDoorArrangement: readString(candidate.floorDoorArrangement, emptyCustomerFormValues.floorDoorArrangement),
    doorWidth: readString(candidate.doorWidth, emptyCustomerFormValues.doorWidth),
    doorHeight: readString(candidate.doorHeight, emptyCustomerFormValues.doorHeight),
    doorStainlessSteelType: readString(candidate.doorStainlessSteelType, emptyCustomerFormValues.doorStainlessSteelType),
    shaftIronwork: readString(candidate.shaftIronwork, emptyCustomerFormValues.shaftIronwork),
    foundationIntrusionIntoShaft: readString(candidate.foundationIntrusionIntoShaft, emptyCustomerFormValues.foundationIntrusionIntoShaft),
    isShaftSuspended: readString(candidate.isShaftSuspended, emptyCustomerFormValues.isShaftSuspended),
    canPitBeDemolished: readString(candidate.canPitBeDemolished, emptyCustomerFormValues.canPitBeDemolished),
    isShaftSurroundingOpen: readString(candidate.isShaftSurroundingOpen, emptyCustomerFormValues.isShaftSurroundingOpen),
    shaftSurroundingCoveringTypes: readStringArray(candidate.shaftSurroundingCoveringTypes, emptyCustomerFormValues.shaftSurroundingCoveringTypes),
    shaftWidth: readString(candidate.shaftWidth, emptyCustomerFormValues.shaftWidth),
    shaftDepth: readString(candidate.shaftDepth, emptyCustomerFormValues.shaftDepth),
    shaftHeight: readString(candidate.shaftHeight, emptyCustomerFormValues.shaftHeight),
    pitHeightWithoutFlooring: readString(candidate.pitHeightWithoutFlooring, emptyCustomerFormValues.pitHeightWithoutFlooring),
    overheadWithoutFlooring: readString(candidate.overheadWithoutFlooring, emptyCustomerFormValues.overheadWithoutFlooring),
    travelLength: readString(candidate.travelLength, emptyCustomerFormValues.travelLength),
    requestedPackageType: readString(candidate.requestedPackageType, emptyCustomerFormValues.requestedPackageType),
    description: readString(candidate.description, emptyCustomerFormValues.description),
  };
}

function normalizeCustomerRecords(customers: unknown[]) {
  return customers.reduce<CustomerRecord[]>((normalizedCustomers, customer) => {
    const normalizedCustomer = normalizeCustomerRecord(customer);

    if (normalizedCustomer) {
      normalizedCustomers.push(normalizedCustomer);
    }

    return normalizedCustomers;
  }, []);
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
    const storedCustomerArray = readStoredCustomerArray(parsedCustomers);

    if (!storedCustomerArray || storedCustomerArray.length === 0) {
      return defaultCustomers;
    }

    const normalizedCustomers = normalizeCustomerRecords(storedCustomerArray);

    return normalizedCustomers.length > 0 ? normalizedCustomers : defaultCustomers;
  } catch {
    return defaultCustomers;
  }
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
