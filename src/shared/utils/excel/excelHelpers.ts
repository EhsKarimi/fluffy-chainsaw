// src/utils/excelHelpers.ts
import ExcelJS, { type CellValue, type Column, type Worksheet } from "exceljs";
import { saveAs } from "file-saver";
import { notifications } from "@mantine/notifications";

import { SharedTexts } from "@/shared/constants/SharedTexts";

import type {
  CustomValidation,
  DependentListValidation,
  DependentListValueGroup,
  ExcelRow,
  ExportColumn,
  ExportColumnTextDirection,
  ExportExcelOptions,
  ExportRow,
  ImportExcelOptions,
  ImportedExcelRow,
  ListValue,
  TemplateMetadata,
  ValidationConfig,
  ValidationOperator,
  WorksheetLevelDataValidation,
  WorksheetWithDataValidations,
} from "./excelTypes";

const HEADER_ROW_NUMBER = 1;
const FIRST_DATA_ROW_NUMBER = 2;
const DEFAULT_DATA_VALIDATION_ROW_COUNT = 5000;
const VALIDATION_SHEET_NAME = "__validation";
const TEMPLATE_META_SHEET_NAME = "__template_meta";
const TEMPLATE_MARKER_VALUE = "BACK_OFFICE_TEMPLATE_V1";
const DEFAULT_HIDDEN_SHEET_PASSWORD = "__back_office_template__";
const DEFAULT_EXPORT_SHEET_PASSWORD = "__back_office_export__";
const DEFAULT_COLUMN_TEXT_DIRECTION: ExportColumnTextDirection = "rtl";

type DependentListSourceRange = {
  headerRange: string;
  firstValueCell: string;
  firstValueColumnRange: string;
  nextHelperColumnIndex: number;
};

function getColumnTextDirection({ column }: { column: ExportColumn }): ExportColumnTextDirection {
  return column.textDirection ?? DEFAULT_COLUMN_TEXT_DIRECTION;
}

export function handleExcelError({ error }: { error: unknown }): void {
  console.error(error);
  notifications.show({
    color: "red",
    title: SharedTexts.Excel.ExportErrorTitle,
    message: SharedTexts.Excel.ExportErrorMessage,
  });
}

function quoteSheetName({ sheetName }: { sheetName: string }): string {
  return `'${sheetName.replaceAll("'", "''")}'`;
}

function isBlankValue({ value }: { value: CellValue | undefined }): boolean {
  return value === undefined || value === null || value === "";
}

function getValidation({ column }: { column: ExportColumn }): ValidationConfig | undefined {
  return column.validation;
}

function getColumnKey({ column }: { column: ExportColumn }): string | undefined {
  if (typeof column.key !== "string" || column.key.length === 0) {
    return undefined;
  }

  return column.key;
}

function compareByOperator({ value, operator, formulae }: { value: number; operator: ValidationOperator; formulae: readonly number[] }): boolean {
  const first = formulae[0];
  const second = formulae[1];

  if (first === undefined) {
    return false;
  }

  if (operator === "between") {
    return second !== undefined && value >= first && value <= second;
  }

  if (operator === "notBetween") {
    return second !== undefined && (value < first || value > second);
  }

  if (operator === "equal") {
    return value === first;
  }

  if (operator === "notEqual") {
    return value !== first;
  }

  if (operator === "greaterThan") {
    return value > first;
  }

  if (operator === "lessThan") {
    return value < first;
  }

  if (operator === "greaterThanOrEqual") {
    return value >= first;
  }

  if (operator === "lessThanOrEqual") {
    return value <= first;
  }

  return false;
}

function applyWorksheetAutoFilter({ worksheet, columns }: { worksheet: Worksheet; columns: readonly ExportColumn[] }): void {
  if (columns.length === 0) {
    return;
  }

  worksheet.autoFilter = {
    from: {
      row: HEADER_ROW_NUMBER,
      column: 1,
    },
    to: {
      row: HEADER_ROW_NUMBER,
      column: columns.length,
    },
  };
}

function findDependentListValueGroup({
  validation,
  parentValue,
}: {
  validation: DependentListValidation;
  parentValue: CellValue | undefined;
}): DependentListValueGroup | undefined {
  return validation.valuesByParent.find((item) => item.parentValue === parentValue);
}

function assertValueAgainstValidation({
  value,
  validation,
  row,
}: {
  value: CellValue | undefined;
  validation: ValidationConfig;
  row: ExportRow;
}): boolean {
  const allowBlank = validation.allowBlank ?? false;

  if (isBlankValue({ value })) {
    return allowBlank;
  }

  if (validation.kind === "list") {
    return validation.values.some((allowedValue) => allowedValue === value);
  }

  if (validation.kind === "dependentList") {
    const parentValue = row[validation.parentKey];
    const valueGroup = findDependentListValueGroup({ validation, parentValue });

    if (!valueGroup) {
      return false;
    }

    return valueGroup.values.some((allowedValue) => allowedValue === value);
  }

  if (validation.kind === "whole") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      return false;
    }

    return compareByOperator({
      value,
      operator: validation.operator,
      formulae: [...validation.formulae],
    });
  }

  if (validation.kind === "decimal") {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return false;
    }

    return compareByOperator({
      value,
      operator: validation.operator,
      formulae: [...validation.formulae],
    });
  }

  if (validation.kind === "textLength") {
    if (typeof value !== "string") {
      return false;
    }

    return compareByOperator({
      value: value.length,
      operator: validation.operator,
      formulae: [...validation.formulae],
    });
  }

  if (validation.kind === "date") {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return false;
    }

    return compareByOperator({
      value: value.getTime(),
      operator: validation.operator,
      formulae: validation.formulae.map((item) => item.getTime()),
    });
  }

  if (validation.kind === "custom") {
    if (!validation.assert) {
      return true;
    }

    return validation.assert(value);
  }

  return true;
}

function assertRowsAreValid({ rows, columns }: { rows: readonly ExportRow[]; columns: readonly ExportColumn[] }): void {
  columns.forEach((column) => {
    const validation = getValidation({ column });

    if (!validation) {
      return;
    }

    const columnKey = getColumnKey({ column });

    if (!columnKey) {
      throw new Error("ستون‌های دارای اعتبارسنجی باید یک کلید غیر خالی تعریف کنند.");
    }

    rows.forEach((row, rowIndex) => {
      const value = row[columnKey];

      if (row.skipValidation?.(columnKey)) {
        return;
      }

      if (!assertValueAgainstValidation({ value, validation, row })) {
        throw new Error(`مقدار نامعتبر در ردیف ${rowIndex + 1}، ستون "${columnKey}": ${String(value)}`);
      }
    });
  });
}

function createBaseValidation({ validation }: { validation: ValidationConfig }): Omit<WorksheetLevelDataValidation, "type" | "formulae"> {
  const hasPrompt = Boolean(validation.promptTitle || validation.prompt);

  return {
    allowBlank: validation.allowBlank ?? false,
    showErrorMessage: true,
    errorStyle: "error",
    errorTitle: validation.errorTitle ?? "مقدار نامعتبر",
    error: validation.error ?? "این مقدار مجاز نیست.",
    showInputMessage: hasPrompt,
    promptTitle: validation.promptTitle,
    prompt: validation.prompt,
  };
}

function buildWorksheetValidation({
  validation,
  listFormula,
  customFormula,
}: {
  validation: ValidationConfig;
  listFormula?: string;
  customFormula?: string;
}): WorksheetLevelDataValidation {
  const baseValidation = createBaseValidation({ validation });

  if (validation.kind === "list" || validation.kind === "dependentList") {
    if (!listFormula) {
      throw new Error("فرمول یا محدوده منبع برای اعتبارسنجی لیست وجود ندارد.");
    }

    return { ...baseValidation, type: "list", formulae: [listFormula] };
  }

  if (validation.kind === "whole") {
    return {
      ...baseValidation,
      type: "whole",
      operator: validation.operator,
      formulae: [...validation.formulae],
    };
  }

  if (validation.kind === "decimal") {
    return {
      ...baseValidation,
      type: "decimal",
      operator: validation.operator,
      formulae: [...validation.formulae],
    };
  }

  if (validation.kind === "textLength") {
    return {
      ...baseValidation,
      type: "textLength",
      operator: validation.operator,
      formulae: [...validation.formulae],
    };
  }

  if (validation.kind === "date") {
    return {
      ...baseValidation,
      type: "date",
      operator: validation.operator,
      formulae: [...validation.formulae],
    };
  }

  if (validation.kind === "custom") {
    if (!customFormula) {
      throw new Error("فرمول سفارشی وجود ندارد.");
    }

    return { ...baseValidation, type: "custom", formulae: [customFormula] };
  }

  throw new Error("نوع اعتبارسنجی پشتیبانی نمی‌شود.");
}

function toWorksheetWithDataValidations({ worksheet }: { worksheet: Worksheet }): WorksheetWithDataValidations {
  return worksheet as WorksheetWithDataValidations;
}

function createWorkbook(): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Atis ERP";
  return workbook;
}

function createWorksheet({ workbook, excelName }: { workbook: ExcelJS.Workbook; excelName: string }): Worksheet {
  return workbook.addWorksheet(excelName, {
    views: [
      {
        rightToLeft: true,
        state: "frozen",
        ySplit: HEADER_ROW_NUMBER,
        topLeftCell: `A${FIRST_DATA_ROW_NUMBER}`,
        activeCell: `A${FIRST_DATA_ROW_NUMBER}`,
      },
    ],
  });
}

function createValidationSheet({ workbook, columns }: { workbook: ExcelJS.Workbook; columns: readonly ExportColumn[] }): Worksheet | undefined {
  const needsValidationSheet = columns.some((column) => {
    const validation = column.validation;
    return validation?.kind === "list" || validation?.kind === "dependentList";
  });

  if (!needsValidationSheet) {
    return undefined;
  }

  const validationSheet = workbook.addWorksheet(VALIDATION_SHEET_NAME);
  validationSheet.state = "hidden";
  return validationSheet;
}

function toWorksheetColumn({ column }: { column: ExportColumn }): Partial<Column> {
  const worksheetColumn: Partial<Column> & Pick<ExportColumn, "validation" | "textDirection"> = {
    ...column,
  };

  delete worksheetColumn.validation;
  delete worksheetColumn.textDirection;

  return worksheetColumn;
}

function applyWorksheetFormatting({
  worksheet,
  rows,
  columns,
}: {
  worksheet: Worksheet;
  rows: readonly ExportRow[];
  columns: readonly ExportColumn[];
}): void {
  worksheet.columns.forEach((worksheetColumn, columnIndex) => {
    const exportColumn = columns[columnIndex];

    if (!exportColumn) {
      return;
    }

    const columnTextDirection = getColumnTextDirection({ column: exportColumn });
    const previousColumnStyle = worksheetColumn.style ?? {};

    worksheetColumn.style = {
      ...previousColumnStyle,
      alignment: {
        ...previousColumnStyle.alignment,
        horizontal: "center",
        readingOrder: columnTextDirection,
      },
      protection: {
        ...previousColumnStyle.protection,
        locked: false,
      },
    };

    worksheetColumn.eachCell?.({ includeEmpty: true }, (cell, rowNumber) => {
      cell.alignment = {
        ...cell.alignment,
        horizontal: "center",
        readingOrder: columnTextDirection,
      };

      if (rowNumber < FIRST_DATA_ROW_NUMBER) {
        cell.protection = { locked: true };
        return;
      }

      const row = rows[rowNumber - FIRST_DATA_ROW_NUMBER];

      if (!row) {
        cell.protection = { locked: false };
        return;
      }

      row.cellStyle?.(cell, getColumnKey({ column: exportColumn }));
      cell.protection = { locked: false };
    });
  });

  const headerRow = worksheet.getRow(HEADER_ROW_NUMBER);

  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF26878E" },
    };
    cell.font = {
      ...cell.font,
      size: 12,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.protection = { locked: true };
  });
}

function buildColumnRange({ columnLetter, startRow }: { columnLetter: string; startRow: number }): string {
  const endRow = startRow + DEFAULT_DATA_VALIDATION_ROW_COUNT - 1;

  return `${columnLetter}${startRow}:${columnLetter}${endRow}`;
}

function buildCellAddress({ columnLetter, rowNumber }: { columnLetter: string; rowNumber: number }): string {
  return `${columnLetter}${rowNumber}`;
}

function addListSourceValues({
  validationSheet,
  helperColumnIndex,
  values,
}: {
  validationSheet: Worksheet;
  helperColumnIndex: number;
  values: readonly ListValue[];
}): string {
  if (values.length === 0) {
    throw new Error("لیست اعتبارسنجی نباید خالی باشد.");
  }

  const helperColumn = validationSheet.getColumn(helperColumnIndex);
  const helperColumnLetter = helperColumn.letter;

  if (!helperColumnLetter) {
    throw new Error("نتوانست حرف ستون کمکی را تعیین کند.");
  }

  helperColumn.hidden = true;

  values.forEach((item, index) => {
    validationSheet.getCell(index + 1, helperColumnIndex).value = item;
  });

  return `${quoteSheetName({ sheetName: VALIDATION_SHEET_NAME })}!$${helperColumnLetter}$1:$${helperColumnLetter}$${values.length}`;
}

function assertDependentListGroupsAreValid({ valuesByParent }: { valuesByParent: readonly DependentListValueGroup[] }): void {
  if (valuesByParent.length === 0) {
    throw new Error("لیست وابسته باید حداقل یک مقدار والد داشته باشد.");
  }

  const parentValues = new Set<string>();

  valuesByParent.forEach((group) => {
    const parentKey = `${typeof group.parentValue}:${String(group.parentValue)}`;

    if (parentValues.has(parentKey)) {
      throw new Error(`مقدار والد تکراری در لیست وابسته: ${String(group.parentValue)}`);
    }

    if (group.values.length === 0) {
      throw new Error(`لیست مقدارهای وابسته برای "${String(group.parentValue)}" نباید خالی باشد.`);
    }

    parentValues.add(parentKey);
  });
}

function buildSheetRange({
  startColumnLetter,
  endColumnLetter,
  rowNumber,
}: {
  startColumnLetter: string;
  endColumnLetter: string;
  rowNumber: number;
}): string {
  return `${quoteSheetName({ sheetName: VALIDATION_SHEET_NAME })}!$${startColumnLetter}$${rowNumber}:$${endColumnLetter}$${rowNumber}`;
}

function buildSheetCell({ columnLetter, rowNumber }: { columnLetter: string; rowNumber: number }): string {
  return `${quoteSheetName({ sheetName: VALIDATION_SHEET_NAME })}!$${columnLetter}$${rowNumber}`;
}

function buildSheetColumnRange({ columnLetter }: { columnLetter: string }): string {
  return `${quoteSheetName({ sheetName: VALIDATION_SHEET_NAME })}!$${columnLetter}:$${columnLetter}`;
}

function addDependentListSourceValues({
  validationSheet,
  helperColumnIndex,
  valuesByParent,
}: {
  validationSheet: Worksheet;
  helperColumnIndex: number;
  valuesByParent: readonly DependentListValueGroup[];
}): DependentListSourceRange {
  assertDependentListGroupsAreValid({ valuesByParent });

  const startColumn = validationSheet.getColumn(helperColumnIndex);
  const startColumnLetter = startColumn.letter;
  const endColumnIndex = helperColumnIndex + valuesByParent.length - 1;
  const endColumn = validationSheet.getColumn(endColumnIndex);
  const endColumnLetter = endColumn.letter;

  if (!startColumnLetter || !endColumnLetter) {
    throw new Error("نتوانست حرف ستون‌های کمکی لیست وابسته را تعیین کند.");
  }

  valuesByParent.forEach((group, groupIndex) => {
    const currentColumnIndex = helperColumnIndex + groupIndex;
    const helperColumn = validationSheet.getColumn(currentColumnIndex);
    helperColumn.hidden = true;

    validationSheet.getCell(1, currentColumnIndex).value = group.parentValue;

    group.values.forEach((item, itemIndex) => {
      validationSheet.getCell(itemIndex + 2, currentColumnIndex).value = item;
    });
  });

  return {
    headerRange: buildSheetRange({
      startColumnLetter,
      endColumnLetter,
      rowNumber: 1,
    }),
    firstValueCell: buildSheetCell({
      columnLetter: startColumnLetter,
      rowNumber: 2,
    }),
    firstValueColumnRange: buildSheetColumnRange({
      columnLetter: startColumnLetter,
    }),
    nextHelperColumnIndex: endColumnIndex + 1,
  };
}

function buildDependentListFormula({
  sourceRange,
  parentColumnLetter,
  startRow,
}: {
  sourceRange: DependentListSourceRange;
  parentColumnLetter: string;
  startRow: number;
}): string {
  const parentCellReference = `$${parentColumnLetter}${startRow}`;
  const matchFormula = `MATCH(${parentCellReference},${sourceRange.headerRange},0)`;

  return `OFFSET(${sourceRange.firstValueCell},0,${matchFormula}-1,COUNTA(OFFSET(${sourceRange.firstValueColumnRange},0,${matchFormula}-1))-1,1)`;
}

function resolveCustomFormula({
  validation,
  columnLetter,
  startRow,
}: {
  validation: CustomValidation;
  columnLetter: string;
  startRow: number;
}): string {
  const cellAddress = `${columnLetter}${startRow}`;

  if (typeof validation.formula === "function") {
    return validation.formula({ cellAddress, columnLetter, startRow });
  }

  return validation.formula;
}

function createFallbackHash({ value }: { value: string }): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

async function hashString({ value }: { value: string }): Promise<string> {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    const encoded = new TextEncoder().encode(value);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);

    return Array.from(new Uint8Array(digest))
      .map((item) => item.toString(16).padStart(2, "0"))
      .join("");
  }

  return createFallbackHash({ value });
}

function serializeValidation({ validation }: { validation?: ValidationConfig }): Record<string, unknown> | undefined {
  if (!validation) {
    return undefined;
  }

  const basePayload = {
    allowBlank: validation.allowBlank ?? false,
    skipHeader: validation.skipHeader ?? false,
    promptTitle: validation.promptTitle ?? "",
    prompt: validation.prompt ?? "",
    errorTitle: validation.errorTitle ?? "",
    error: validation.error ?? "",
  };

  if (validation.kind === "list") {
    return { ...basePayload, kind: "list", values: [...validation.values] };
  }

  if (validation.kind === "dependentList") {
    return {
      ...basePayload,
      kind: "dependentList",
      parentKey: validation.parentKey,
      valuesByParent: validation.valuesByParent.map((group) => ({
        parentValue: group.parentValue,
        values: [...group.values],
      })),
    };
  }

  if (validation.kind === "whole") {
    return {
      ...basePayload,
      kind: "whole",
      operator: validation.operator,
      formulae: [...validation.formulae],
    };
  }

  if (validation.kind === "decimal") {
    return {
      ...basePayload,
      kind: "decimal",
      operator: validation.operator,
      formulae: [...validation.formulae],
    };
  }

  if (validation.kind === "textLength") {
    return {
      ...basePayload,
      kind: "textLength",
      operator: validation.operator,
      formulae: [...validation.formulae],
    };
  }

  if (validation.kind === "date") {
    return {
      ...basePayload,
      kind: "date",
      operator: validation.operator,
      formulae: validation.formulae.map((item) => item.toISOString()),
    };
  }

  return {
    ...basePayload,
    kind: "custom",
    formula: typeof validation.formula === "string" ? validation.formula : validation.formula.toString(),
    hasAssert: Boolean(validation.assert),
  };
}

async function buildColumnKeysHashFromColumns({ columns }: { columns: readonly ExportColumn[] }): Promise<string> {
  return hashString({
    value: JSON.stringify(columns.map((column) => column.key)),
  });
}

async function buildColumnKeysHashFromHeaders({ columnsHeader }: { columnsHeader: readonly string[] }): Promise<string> {
  return hashString({
    value: JSON.stringify([...columnsHeader]),
  });
}

async function buildSchemaHash({ columns }: { columns: readonly ExportColumn[] }): Promise<string> {
  return hashString({
    value: JSON.stringify(
      columns.map((column) => {
        const numFmt =
          column.style && typeof column.style === "object" && "numFmt" in column.style && typeof column.style.numFmt === "string"
            ? column.style.numFmt
            : "";

        return {
          header: column.header ?? "",
          key: column.key,
          width: column.width ?? "",
          numFmt,
          validation: serializeValidation({ validation: column.validation }),
        };
      }),
    ),
  });
}

async function protectHiddenSheet({ worksheet, password }: { worksheet: Worksheet; password?: string }): Promise<void> {
  await worksheet.protect(password ?? DEFAULT_HIDDEN_SHEET_PASSWORD, {
    selectLockedCells: false,
    selectUnlockedCells: false,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertRows: false,
    insertColumns: false,
    insertHyperlinks: false,
    deleteRows: false,
    deleteColumns: false,
    sort: false,
    autoFilter: false,
    pivotTables: false,
  });
}

async function protectExportWorksheet({ worksheet }: { worksheet: Worksheet }): Promise<void> {
  await worksheet.protect(DEFAULT_EXPORT_SHEET_PASSWORD, {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertRows: true,
    insertColumns: false,
    insertHyperlinks: false,
    deleteRows: true,
    deleteColumns: false,
    sort: true,
    autoFilter: true,
    pivotTables: false,
  });
}

async function addTemplateMetadataSheet({
  workbook,
  excelName,
  columns,
  template,
}: {
  workbook: ExcelJS.Workbook;
  excelName: string;
  columns: readonly ExportColumn[];
  template: NonNullable<ExportExcelOptions["template"]>;
}): Promise<void> {
  const templateSheet = workbook.addWorksheet(TEMPLATE_META_SHEET_NAME);
  const templateName = template.name ?? excelName;
  const templateVersion = template.version;
  const templateId = template.id ?? `${templateName}:${templateVersion}`;
  const columnKeysHash = await buildColumnKeysHashFromColumns({ columns });
  const schemaHash = await buildSchemaHash({ columns });
  const generatedAt = new Date().toISOString();

  templateSheet.state = "hidden";
  templateSheet.columns = [{ width: 24 }, { width: 72 }];

  const metadataRows: ReadonlyArray<readonly [string, string]> = [
    ["TEMPLATE_MARKER", TEMPLATE_MARKER_VALUE],
    ["TEMPLATE_NAME", templateName],
    ["TEMPLATE_VERSION", templateVersion],
    ["TEMPLATE_ID", templateId],
    ["COLUMN_KEYS_HASH", columnKeysHash],
    ["SCHEMA_HASH", schemaHash],
    ["GENERATED_AT", generatedAt],
  ];

  metadataRows.forEach((entry, index) => {
    const rowNumber = index + 1;
    const [key, value] = entry;
    templateSheet.getCell(rowNumber, 1).value = key;
    templateSheet.getCell(rowNumber, 2).value = value;
  });

  templateSheet.getColumn(1).font = { bold: true };
  templateSheet.getCell("B1").name = "__template_marker";
  templateSheet.getCell("B2").name = "__template_name";
  templateSheet.getCell("B3").name = "__template_version";
  templateSheet.getCell("B4").name = "__template_id";
  templateSheet.getCell("B5").name = "__column_keys_hash";
  templateSheet.getCell("B6").name = "__schema_hash";

  await protectHiddenSheet({
    worksheet: templateSheet,
    password: template.protectPassword,
  });
}

function getTemplateMetadataValue({ worksheet, rowNumber, expectedKey }: { worksheet: Worksheet; rowNumber: number; expectedKey: string }): string {
  const actualKey = String(worksheet.getCell(rowNumber, 1).value ?? "").trim();

  if (actualKey !== expectedKey) {
    return "";
  }

  return String(worksheet.getCell(rowNumber, 2).value ?? "").trim();
}

function readTemplateMetadata({ workbook }: { workbook: ExcelJS.Workbook }): TemplateMetadata | undefined {
  const templateSheet = workbook.getWorksheet(TEMPLATE_META_SHEET_NAME);

  if (!templateSheet) {
    return undefined;
  }

  const metadata: TemplateMetadata = {
    marker: getTemplateMetadataValue({
      worksheet: templateSheet,
      rowNumber: 1,
      expectedKey: "TEMPLATE_MARKER",
    }),
    templateName: getTemplateMetadataValue({
      worksheet: templateSheet,
      rowNumber: 2,
      expectedKey: "TEMPLATE_NAME",
    }),
    templateVersion: getTemplateMetadataValue({
      worksheet: templateSheet,
      rowNumber: 3,
      expectedKey: "TEMPLATE_VERSION",
    }),
    templateId: getTemplateMetadataValue({
      worksheet: templateSheet,
      rowNumber: 4,
      expectedKey: "TEMPLATE_ID",
    }),
    columnKeysHash: getTemplateMetadataValue({
      worksheet: templateSheet,
      rowNumber: 5,
      expectedKey: "COLUMN_KEYS_HASH",
    }),
    schemaHash: getTemplateMetadataValue({
      worksheet: templateSheet,
      rowNumber: 6,
      expectedKey: "SCHEMA_HASH",
    }),
    generatedAt: getTemplateMetadataValue({
      worksheet: templateSheet,
      rowNumber: 7,
      expectedKey: "GENERATED_AT",
    }),
  };

  if (!metadata.marker) {
    return undefined;
  }

  return metadata;
}

export async function verifyImportedTemplate({
  workbook,
  columnsHeader,
  options,
}: {
  workbook: ExcelJS.Workbook;
  columnsHeader: readonly string[];
  options?: ImportExcelOptions;
}): Promise<void> {
  const templateOptions = options?.template;

  if (!templateOptions || templateOptions.required === false) {
    return;
  }

  const metadata = readTemplateMetadata({ workbook });

  if (!metadata || metadata.marker !== TEMPLATE_MARKER_VALUE) {
    throw new Error("فایل بارگذاری شده بر اساس الگوی مورد نیاز نیست.");
  }

  const expectedColumnKeysHash = await buildColumnKeysHashFromHeaders({
    columnsHeader,
  });

  if (metadata.columnKeysHash !== expectedColumnKeysHash) {
    throw new Error("ستون‌های فایل بارگذاری شده با الگوی مورد انتظار مطابقت ندارند.");
  }

  if (templateOptions.name && metadata.templateName !== templateOptions.name) {
    throw new Error("نام الگوی فایل بارگذاری شده مطابقت ندارد.");
  }

  if (templateOptions.version && metadata.templateVersion !== templateOptions.version) {
    throw new Error("نسخه الگوی فایل بارگذاری شده مطابقت ندارد.");
  }

  if (templateOptions.id && metadata.templateId !== templateOptions.id) {
    throw new Error("شناسه الگوی فایل بارگذاری شده مطابقت ندارد.");
  }

  if (templateOptions.columns) {
    const expectedSchemaHash = await buildSchemaHash({
      columns: templateOptions.columns,
    });

    if (metadata.schemaHash !== expectedSchemaHash) {
      throw new Error("طرحواره فایل بارگذاری شده با الگوی مورد انتظار مطابقت ندارد.");
    }
  }
}

function getParentColumnLetter({ columns, parentKey }: { columns: readonly ExportColumn[]; parentKey: string }): string {
  const parentColumnIndex = columns.findIndex((column) => getColumnKey({ column }) === parentKey);

  if (parentColumnIndex < 0) {
    throw new Error(`ستون والد "${parentKey}" برای لیست وابسته پیدا نشد.`);
  }

  const parentColumnLetter = String.fromCharCode(65 + parentColumnIndex);

  if (!parentColumnLetter) {
    throw new Error(`نتوانست حرف ستون والد "${parentKey}" را تعیین کند.`);
  }

  return parentColumnLetter;
}

function applyColumnValidations({
  worksheet,
  validationSheet,
  columns,
  rows,
}: {
  worksheet: Worksheet;
  validationSheet?: Worksheet;
  columns: readonly ExportColumn[];
  rows: readonly ExportRow[];
}): void {
  const worksheetWithDataValidations = toWorksheetWithDataValidations({ worksheet });
  let helperColumnIndex = 1;

  columns.forEach((column, columnIndex) => {
    const validation = getValidation({ column });

    if (!validation) {
      return;
    }

    const columnKey = getColumnKey({ column });

    if (!columnKey) {
      throw new Error("ستون‌های دارای اعتبارسنجی باید یک کلید غیر خالی تعریف کنند.");
    }

    const targetColumn = worksheet.getColumn(columnIndex + 1);
    const targetColumnLetter = targetColumn.letter;
    const startRow = validation.skipHeader ? FIRST_DATA_ROW_NUMBER : HEADER_ROW_NUMBER;

    if (!targetColumnLetter) {
      throw new Error(`نتوانست حرف ستون هدف را برای "${columnKey}" تعیین کند.`);
    }

    let listFormula: string | undefined;
    let customFormula: string | undefined;
    let dependentListSourceRange: DependentListSourceRange | undefined;
    let dependentListParentColumnLetter: string | undefined;

    if (validation.kind === "list") {
      if (!validationSheet) {
        throw new Error("صفحه اعتبارسنجی برای اعتبارسنجی لیست الزامی است.");
      }

      listFormula = addListSourceValues({
        validationSheet,
        helperColumnIndex,
        values: validation.values,
      });
      helperColumnIndex += 1;
    }

    if (validation.kind === "dependentList") {
      if (!validationSheet) {
        throw new Error("صفحه اعتبارسنجی برای اعتبارسنجی لیست وابسته الزامی است.");
      }

      dependentListParentColumnLetter = getParentColumnLetter({
        columns,
        parentKey: validation.parentKey,
      });

      dependentListSourceRange = addDependentListSourceValues({
        validationSheet,
        helperColumnIndex,
        valuesByParent: validation.valuesByParent,
      });

      listFormula = buildDependentListFormula({
        sourceRange: dependentListSourceRange,
        parentColumnLetter: dependentListParentColumnLetter,
        startRow,
      });
      helperColumnIndex = dependentListSourceRange.nextHelperColumnIndex;
    }

    if (validation.kind === "custom") {
      customFormula = resolveCustomFormula({
        validation,
        columnLetter: targetColumnLetter,
        startRow,
      });
    }

    const shouldApplyRowByRow = rows.some((row) => row.skipValidation?.(columnKey));

    if (shouldApplyRowByRow) {
      rows.forEach((row, rowIndex) => {
        if (row.skipValidation?.(columnKey)) {
          return;
        }

        const rowNumber = FIRST_DATA_ROW_NUMBER + rowIndex;
        const rowListFormula =
          validation.kind === "dependentList" && dependentListSourceRange && dependentListParentColumnLetter
            ? buildDependentListFormula({
                sourceRange: dependentListSourceRange,
                parentColumnLetter: dependentListParentColumnLetter,
                startRow: rowNumber,
              })
            : listFormula;
        const rowCustomFormula =
          validation.kind === "custom"
            ? resolveCustomFormula({
                validation,
                columnLetter: targetColumnLetter,
                startRow: rowNumber,
              })
            : customFormula;
        const worksheetValidation = buildWorksheetValidation({
          validation,
          listFormula: rowListFormula,
          customFormula: rowCustomFormula,
        });

        worksheetWithDataValidations.dataValidations.add(
          buildCellAddress({
            columnLetter: targetColumnLetter,
            rowNumber,
          }),
          worksheetValidation,
        );
      });
      return;
    }

    const worksheetValidation = buildWorksheetValidation({
      validation,
      listFormula,
      customFormula,
    });
    worksheetWithDataValidations.dataValidations.add(buildColumnRange({ columnLetter: targetColumnLetter, startRow }), worksheetValidation);
  });
}

export async function exportExcelInternal({
  excelName,
  columns,
  rows,
  options,
}: {
  excelName: string;
  columns: readonly ExportColumn[];
  rows: readonly ExportRow[];
  options?: ExportExcelOptions;
}): Promise<void> {
  assertRowsAreValid({ rows, columns });

  const workbook = createWorkbook();
  const worksheet = createWorksheet({ workbook, excelName });
  const validationSheet = createValidationSheet({ workbook, columns });

  worksheet.columns = columns.map((column) => toWorksheetColumn({ column }));
  worksheet.addRows([...rows]);

  applyWorksheetFormatting({ worksheet, rows, columns });
  applyColumnValidations({ worksheet, validationSheet, columns, rows });
  applyWorksheetAutoFilter({ worksheet, columns });
  await protectExportWorksheet({ worksheet });

  if (validationSheet) {
    await protectHiddenSheet({ worksheet: validationSheet });
  }

  if (options?.template) {
    await addTemplateMetadataSheet({
      workbook,
      excelName,
      columns,
      template: options.template,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${excelName}.xlsx`);
}

export function readFileAsArrayBuffer({ file }: { file: File }): Promise<ArrayBuffer> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;

      if (!result) {
        reject(new Error("خطا در خواندن فایل"));
        return;
      }

      resolve(result as ArrayBuffer);
    };

    reader.onerror = () => {
      reject(new Error("خطا در خواندن فایل"));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function normalizeRowValues({ rowValues }: { rowValues: ExcelRow }): ExcelRow {
  const normalizedRowValues = [...rowValues];

  if (normalizedRowValues.length > 0 && normalizedRowValues[0] === undefined) {
    normalizedRowValues.shift();
  }

  return normalizedRowValues;
}

export function isImportedRowEmpty({ rowValues }: { rowValues: ExcelRow }): boolean {
  return rowValues.every((item) => String(item ?? "").trim() === "");
}

/**
 * Maps a row’s values to an object using column headers.
 * Throws a Persian error string when a cell contains an Excel error.
 */
export function mapRowToObject<T extends ImportedExcelRow>({
  rowValues,
  columnsHeader,
  rowIndex,
}: {
  rowValues: ExcelRow;
  columnsHeader: readonly string[];
  rowIndex: number;
}): T {
  const mappedRowValues: Partial<T> = {};

  rowValues.forEach((item, index) => {
    const key = columnsHeader[index];

    if (!key) {
      return;
    }

    if (item && typeof item === "object" && "error" in item) {
      const errorObj = item as unknown as { error?: unknown };

      if (errorObj.error !== undefined) {
        const colLetter = String.fromCharCode(65 + index);
        throw new Error(`ردیف ${rowIndex}، ستون ${colLetter} دارای خطای Excel (مانند #REF!) است. لطفاً اصلاح و دوباره بارگذاری کنید.`);
      }
    }

    let textValue: string;

    if (item && typeof item === "object" && "richText" in item) {
      textValue = (item as { richText: { text: string }[] }).richText.map((run) => run.text).join("");
    } else {
      textValue = String(item ?? "");
    }

    (mappedRowValues as ImportedExcelRow)[key] = textValue.trim();
  });

  return mappedRowValues as T;
}
