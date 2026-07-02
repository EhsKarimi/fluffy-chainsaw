import ExcelJS from "exceljs";

import type { ExportColumn, ListValue } from "./excelTypes";

export const EXCEL_INTEGER_NUMBER_FORMAT = "#,##0";
export const DEFAULT_EXCEL_SELECT_DELIMITER = " -- ";

type ExcelColumnParams = {
  header: string;
  key: string;
  numFmt?: string;
  width?: number;
};

type ExcelTextColumnParams = ExcelColumnParams & {
  minLength?: number;
  maxLength?: number;
};

export function withExcelIntegerFormat<T extends ExportColumn>(column: T): T {
  return {
    ...column,
    numFmt: EXCEL_INTEGER_NUMBER_FORMAT,
  };
}

export function createExcelIntegerColumn({ header, key, numFmt, width = 20 }: ExcelColumnParams): ExportColumn {
  return { header, key, numFmt, width };
}

export function createPositiveIntegerExcelColumn({ header, key, numFmt, width = 20 }: ExcelColumnParams): ExportColumn {
  return {
    header,
    key,
    numFmt,
    width,
    validation: {
      kind: "whole",
      operator: "greaterThan",
      formulae: [0],
      skipHeader: true,
      allowBlank: false,
    },
  };
}

export function createNonNegativeIntegerExcelColumn({ header, key, numFmt, width = 20 }: ExcelColumnParams): ExportColumn {
  return {
    header,
    key,
    numFmt,
    width,
    validation: {
      kind: "whole",
      operator: "greaterThanOrEqual",
      formulae: [0],
      skipHeader: true,
      allowBlank: false,
    },
  };
}

export function createBinaryExcelColumn({ header, key, numFmt, width = 20 }: ExcelColumnParams): ExportColumn {
  return {
    header,
    key,
    numFmt,
    width,
    validation: {
      kind: "list",
      values: [0, 1],
      skipHeader: true,
      allowBlank: false,
    },
  };
}

export function createExcelTextColumn({ header, key, width = 30, minLength = 1, maxLength = 255 }: ExcelTextColumnParams): ExportColumn {
  return {
    header,
    key,
    width,
    validation: {
      kind: "textLength",
      operator: "between",
      formulae: [minLength, maxLength],
      skipHeader: true,
      allowBlank: false,
    },
  };
}

export function createExcelListValidation(values: readonly ListValue[], allowBlank = false): ExportColumn["validation"] | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return {
    allowBlank,
    kind: "list",
    skipHeader: true,
    values,
  };
}

export function createExcelSelectText(
  item: { id: number | string; label?: string; name?: string; title?: string },
  delimiter = DEFAULT_EXCEL_SELECT_DELIMITER,
): string {
  const label = item.label ?? item.name ?? item.title;

  if (label === undefined) {
    throw new Error("Excel select option label is required.");
  }

  return `${label}${delimiter}${item.id}`;
}

export function getIdFromExcelSelectText(value: string, delimiter = DEFAULT_EXCEL_SELECT_DELIMITER): string | undefined {
  const delimiterIndex = value.lastIndexOf(delimiter);

  if (delimiterIndex < 0) {
    return undefined;
  }

  return value.slice(delimiterIndex + delimiter.length).trim();
}

export function normalizeExcelCellText(value: unknown): string {
  if (value && typeof value === "object" && "richText" in value) {
    return (value as { richText: { text: string }[] }).richText.map((item) => item.text).join("");
  }

  return String(value ?? "").trim();
}

export function getExcelDataRowNumber(index: number): number {
  return index + 2;
}

export async function getExcelRowsWithValuesAfterColumn(file: File, lastAllowedColumn: number): Promise<number[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const worksheet = workbook.getWorksheet(1);

  if (!worksheet) {
    throw new Error("کاربرگ (worksheet) یافت نشد.");
  }

  const invalidRowNumbers: number[] = [];

  worksheet.eachRow((row, rowNumber) => {
    const values = row.values as unknown[];

    if (values.slice(lastAllowedColumn + 1).some((value) => normalizeExcelCellText(value) !== "")) {
      invalidRowNumbers.push(rowNumber);
    }
  });

  return invalidRowNumbers;
}
