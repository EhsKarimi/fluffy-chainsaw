import { useCallback, useRef, useState } from "react";

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

export function useAppExcelExport(options: UseAppExcelExportOptions) {
  const [isExporting, setIsExporting] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const exportRows = useCallback(async () => {
    const currentOptions = optionsRef.current;

    setIsExporting(true);

    try {
      await waitForNextPaint();
      await exportExcel(resolveValue(currentOptions.excelName), currentOptions.columns, currentOptions.getRows(), currentOptions.options);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportRows,
    isExporting,
  };
}
