import { CrmTexts } from "@/modules/crm/constants/CrmTexts";
import { type CustomerRecord } from "@/modules/crm/types/customer.types";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { type ExportColumn, type ExportRow } from "@/shared/utils/excel/excelTypes";
import { getCountyName, getProvinceName } from "@/shared/utils/iran-location";

export const customerExcelColumns: ExportColumn[] = [
  { header: CrmTexts.Customers.Table.Code, key: "id", width: 12 },
  { header: SharedTexts.EmployerName, key: "employerName", width: 28 },
  { header: SharedTexts.RequesterName, key: "requesterName", width: 24 },
  { header: SharedTexts.ContactNumber, key: "contactNumber", width: 22, textDirection: "ltr" },
  { header: SharedTexts.Email, key: "email", width: 30, textDirection: "ltr" },
  { header: SharedTexts.Province, key: "province", width: 18 },
  { header: SharedTexts.County, key: "county", width: 18 },
  { header: SharedTexts.ProjectName, key: "projectName", width: 28 },
  { header: SharedTexts.ProjectAddress, key: "projectAddress", width: 40 },
  { header: CrmTexts.Customers.Table.Source, key: "source", width: 22 },
  { header: CrmTexts.Customers.Table.SalesExpert, key: "salesExpert", width: 22 },
  { header: CrmTexts.Customers.Table.Status, key: "status", width: 20 },
  { header: CrmTexts.Customers.Table.Priority, key: "priority", width: 16 },
  { header: CrmTexts.Customers.Table.LastContact, key: "lastContact", width: 18 },
  { header: SharedTexts.VisitDate.Label, key: "visitDate", width: 18 },
  { header: CrmTexts.Customers.Table.NextStep, key: "nextStep", width: 30 },
  { header: CrmTexts.Customers.Table.EstimatedValue, key: "estimatedValue", width: 22 },
  { header: SharedTexts.NumberOfUnits, key: "numberOfUnits", width: 16 },
  { header: SharedTexts.NumberOfStops, key: "numberOfStops", width: 16 },
  { header: SharedTexts.ElevatorType.Label, key: "elevatorType", width: 30 },
  { header: SharedTexts.UsageType.Label, key: "usageTypes", width: 36 },
  { header: SharedTexts.EnvironmentType, key: "environmentType", width: 20 },
  { header: SharedTexts.Capacity, key: "capacity", width: 20 },
  { header: SharedTexts.RequestedPackageType, key: "requestedPackageType", width: 28 },
  { header: SharedTexts.Description, key: "description", width: 45 },
];

function createSafeDateSuffix() {
  return new Date().toISOString().slice(0, 10);
}

function mapCustomerToExcelRow(customer: CustomerRecord): ExportRow {
  return {
    id: customer.id,
    employerName: customer.employerName,
    requesterName: customer.requesterName,
    contactNumber: customer.contactNumber,
    email: customer.email,
    province: getProvinceName(customer.provinceId),
    county: getCountyName(customer.countyId),
    projectName: customer.projectName,
    projectAddress: customer.projectAddress,
    source: customer.source,
    salesExpert: customer.salesExpert,
    status: CrmTexts.Customers.StatusLabels[customer.status],
    priority: CrmTexts.Customers.PriorityLabels[customer.priority],
    lastContact: customer.lastContact,
    visitDate: customer.visitDate,
    nextStep: customer.nextStep,
    estimatedValue: customer.estimatedValue,
    numberOfUnits: customer.numberOfUnits,
    numberOfStops: customer.numberOfStops,
    elevatorType: customer.elevatorType,
    usageTypes: customer.usageTypes.join("، "),
    environmentType: customer.environmentType,
    capacity: customer.capacity,
    requestedPackageType: customer.requestedPackageType,
    description: customer.description,
  };
}

export function createCustomerExcelName() {
  return `${CrmTexts.Customers.Excel.FileName}-${createSafeDateSuffix()}`;
}

export function createCustomerExcelRows(customers: readonly CustomerRecord[]): ExportRow[] {
  return customers.map(mapCustomerToExcelRow);
}
