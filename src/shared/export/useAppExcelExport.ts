import { useCallback, useState } from "react";

import { waitForNextPaint } from "@/shared/utils/browser/waitForNextPaint";
import { type ExportColumn, type ExportExcelOptions, type ExportRow, exportExcel } from "@/shared/utils/excel/excel";

type Resolvable<TValue> = TValue | (() => TValue);

function resolveValue<TValue>(value: Resolvable<TValue>): TValue {
  return typeof value === "function" ? (value as () => TValue)() : value;
}

export type UseAppExcelExportOptions = {
  columns: readonly ExportColumn[];
  excelName: Resolvable<string>;
  getRows: () => readonly ExportRow[];
  options?: ExportExcelOptions;
};

export function useAppExcelExport({ columns, excelName, getRows, options }: UseAppExcelExportOptions) {
  const [isExporting, setIsExporting] = useState(false);

  const exportRows = useCallback(async () => {
    setIsExporting(true);

    try {
      await waitForNextPaint();
      await exportExcel(resolveValue(excelName), columns, getRows(), options);
    } finally {
      setIsExporting(false);
    }
  }, [columns, excelName, getRows, options]);

  return {
    exportRows,
    isExporting,
  };
}
