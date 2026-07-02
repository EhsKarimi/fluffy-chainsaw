import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { formatPageTitle, getPageTitle } from "@/shared/utils/page-title";

export function AppDocumentTitle() {
  const location = useLocation({
    select: (currentLocation) => ({
      pathname: currentLocation.pathname,
      search: currentLocation.search,
    }),
  });

  useEffect(() => {
    document.title = formatPageTitle(getPageTitle(location));
  }, [location]);

  return null;
}
