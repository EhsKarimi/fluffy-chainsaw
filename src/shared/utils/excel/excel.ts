import ExcelJS from "exceljs";

import {
  exportExcelInternal,
  handleExcelError,
  isImportedRowEmpty,
  mapRowToObject,
  normalizeRowValues,
  readFileAsArrayBuffer,
  verifyImportedTemplate,
} from "./excelHelpers";
import type { ExportColumn, ExportExcelOptions, ExportRow, ImportExcelOptions, ImportedExcelRow } from "./excelTypes";

export type {
  ValidationConfig,
  ValidationOperator,
  ValidationFormula,
  ValidationBase,
  ListValue,
  ListValidation,
  DependentListValueGroup,
  DependentListValidation,
  WholeValidation,
  DecimalValidation,
  TextLengthValidation,
  DateValidation,
  CustomFormulaContext,
  CustomValidation,
  ExportColumnTextDirection,
  ExportColumn,
  ExportRow,
  ExportTemplateOptions,
  ExportExcelOptions,
  ImportTemplateOptions,
  ImportExcelOptions,
  ImportedExcelRowValue,
  ImportedExcelRow,
} from "./excelTypes";

const HEADER_ROW_NUMBER = 1;

export function exportExcel(excelName: string, columns: readonly ExportColumn[], rows: readonly ExportRow[], options?: ExportExcelOptions): Promise<void> {
  return exportExcelInternal({ excelName, columns, rows, options }).catch((error: unknown) => {
    handleExcelError({ error });
  });
}

/**
 * Imports an Excel file and returns an array of typed rows.
 *
 * The returned Promise rejects with a string[] when an import or validation error occurs.
 */
export function importExcel<T extends ImportedExcelRow = ImportedExcelRow>(file: File, columnsHeader: readonly string[], options?: ImportExcelOptions): Promise<T[]> {
  const maxFileSizeBytes = options?.maxFileSizeBytes ?? 4.9 * 1024 * 1024;
  const maxRows = options?.maxRows ?? 5000;
  const skipEmptyRows = options?.skipEmptyRows ?? true;

  if (file.size > maxFileSizeBytes) {
    const maxMB = (maxFileSizeBytes / (1024 * 1024)).toFixed(1);
    return Promise.reject([`حجم فایل بیش از حد مجاز ${maxMB} مگابایت است.`]);
  }

  return readFileAsArrayBuffer({ file }).then(async (buffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    await verifyImportedTemplate({ workbook, columnsHeader, options });

    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      return Promise.reject(["کاربرگ (worksheet) یافت نشد."]);
    }

    const data: T[] = [];
    const rowErrors: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === HEADER_ROW_NUMBER) {
        return;
      }

      const normalizedRowValues = normalizeRowValues({
        rowValues: row.values as (string | undefined)[],
      });

      if (skipEmptyRows && isImportedRowEmpty({ rowValues: normalizedRowValues })) {
        return;
      }

      try {
        data.push(
          mapRowToObject<T>({
            rowValues: normalizedRowValues,
            columnsHeader,
            rowIndex: rowNumber,
          }),
        );
      } catch (error: unknown) {
        rowErrors.push(error instanceof Error ? error.message : String(error));
      }
    });

    if (rowErrors.length > 0) {
      return Promise.reject(rowErrors);
    }

    if (data.length > maxRows) {
      return Promise.reject([`تعداد ردیف‌های فایل بیش از حد مجاز ${maxRows} ردیف است.`]);
    }

    return data;
  });
}
