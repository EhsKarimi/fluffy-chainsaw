import { useEffect } from "react";

export function useAppListPageBounds({
  onReplacePage,
  page,
  pageSize,
  totalItems,
}: {
  onReplacePage: (page: number) => void;
  page: number;
  pageSize: number;
  totalItems: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      onReplacePage(totalPages);
    }
  }, [onReplacePage, page, totalPages]);
}
