import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

const LATEST_APP_LIST_RETURN_LOCATION_STORAGE_KEY = "atis.latestAppListReturnLocation";

type LatestAppListReturnLocation = {
  pathname: string;
  search: string;
};

function normalizeSearch(search: string) {
  if (!search) {
    return "";
  }

  return search.startsWith("?") ? search : `?${search}`;
}

function parseSearchParams(search: string): Record<string, string> {
  const searchParams = new URLSearchParams(normalizeSearch(search));
  const parsedSearch: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    parsedSearch[key] = value;
  });

  return parsedSearch;
}

function readLatestAppListReturnLocation(expectedPathname: string): LatestAppListReturnLocation | null {
  try {
    const rawLocation = sessionStorage.getItem(LATEST_APP_LIST_RETURN_LOCATION_STORAGE_KEY);

    if (!rawLocation) {
      return null;
    }

    const parsedLocation = JSON.parse(rawLocation) as Partial<LatestAppListReturnLocation>;

    if (parsedLocation.pathname !== expectedPathname || typeof parsedLocation.search !== "string") {
      return null;
    }

    return {
      pathname: parsedLocation.pathname,
      search: parsedLocation.search,
    };
  } catch {
    return null;
  }
}

export function saveLatestAppListReturnLocation(location: LatestAppListReturnLocation) {
  try {
    sessionStorage.setItem(
      LATEST_APP_LIST_RETURN_LOCATION_STORAGE_KEY,
      JSON.stringify({
        pathname: location.pathname,
        search: normalizeSearch(location.search),
      }),
    );
  } catch {
    // Ignore unavailable storage. The fallback route is still safe.
  }
}

export function useAppListReturnNavigation({ fallbackTo }: { fallbackTo: string }) {
  const navigate = useNavigate();

  return useCallback(async () => {
    const latestListLocation = readLatestAppListReturnLocation(fallbackTo);

    await navigate({
      to: fallbackTo as never,
      search: parseSearchParams(latestListLocation?.search ?? "") as never,
    });
  }, [fallbackTo, navigate]);
}
