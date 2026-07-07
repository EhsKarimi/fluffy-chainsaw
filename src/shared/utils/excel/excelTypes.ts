// src/utils/excelTypes.ts
import type { Cell, CellValue, Column, DataValidation, Worksheet } from "exceljs";

export type ValidationOperator =
  "between" | "notBetween" | "equal" | "notEqual" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual";

export type ValidationFormula = string | number | Date;
export type ListValue = string | number;

export type ValidationBase = {
  allowBlank?: boolean;
  skipHeader?: boolean;
  promptTitle?: string;
  prompt?: string;
  errorTitle?: string;
  error?: string;
};

export type ListValidation = ValidationBase & {
  kind: "list";
  values: readonly ListValue[];
};

export type DependentListValueGroup = {
  parentValue: ListValue;
  values: readonly ListValue[];
};

export type DependentListValidation = ValidationBase & {
  kind: "dependentList";
  parentKey: string;
  valuesByParent: readonly DependentListValueGroup[];
};

export type WholeValidation = ValidationBase & {
  kind: "whole";
  operator: ValidationOperator;
  formulae: readonly [number] | readonly [number, number];
};

export type DecimalValidation = ValidationBase & {
  kind: "decimal";
  operator: ValidationOperator;
  formulae: readonly [number] | readonly [number, number];
};

export type TextLengthValidation = ValidationBase & {
  kind: "textLength";
  operator: ValidationOperator;
  formulae: readonly [number] | readonly [number, number];
};

export type DateValidation = ValidationBase & {
  kind: "date";
  operator: ValidationOperator;
  formulae: readonly [Date] | readonly [Date, Date];
};

export type CustomFormulaContext = {
  cellAddress: string;
  columnLetter: string;
  startRow: number;
};

export type CustomValidation = ValidationBase & {
  kind: "custom";
  formula: string | ((context: CustomFormulaContext) => string);
  assert?: (value: CellValue | undefined) => boolean;
};

export type ValidationConfig =
  ListValidation | DependentListValidation | WholeValidation | DecimalValidation | TextLengthValidation | DateValidation | CustomValidation;

export type ExportColumn = Omit<Partial<Column>, "key"> & {
  key?: string;
  validation?: ValidationConfig;
  textDirection?: ExportColumnTextDirection;
};

export type ExportRow = Record<string, CellValue | undefined> & {
  cellStyle?: (cell: Cell, columnKey?: string) => void;
  skipValidation?: (columnKey?: string) => boolean;
};

export type ExportTemplateOptions = {
  name?: string;
  version: string;
  id?: string;
  protectPassword?: string;
};

export type ExportExcelOptions = {
  template?: ExportTemplateOptions;
};

export type ImportTemplateOptions = {
  required?: boolean;
  name?: string;
  version?: string;
  id?: string;
  columns?: readonly ExportColumn[];
};

export type ImportExcelOptions = {
  template?: ImportTemplateOptions;
  /**
   * Whether completely empty rows should be ignored.
   * @default true
   */
  skipEmptyRows?: boolean;
  maxFileSizeBytes?: number;
  maxRows?: number;
};

export type WorksheetLevelDataValidation = Omit<DataValidation, "formulae"> & {
  formulae: ValidationFormula[];
};

export type WorksheetWithDataValidations = Worksheet & {
  dataValidations: {
    add: (range: string, validation: WorksheetLevelDataValidation) => void;
  };
};

export type ExcelRow = (CellValue | undefined)[];

export type ImportedExcelRowValue = string | undefined;

export type ImportedExcelRow = Record<string, ImportedExcelRowValue>;

export type TemplateMetadata = {
  marker: string;
  templateName: string;
  templateVersion: string;
  templateId: string;
  columnKeysHash: string;
  schemaHash: string;
  generatedAt: string;
};

export type ExportColumnTextDirection = "ltr" | "rtl";
