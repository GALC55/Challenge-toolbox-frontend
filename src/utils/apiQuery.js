import { QueryClient, useQuery } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function fetchJSON(url, options = {}) {
  const { headers, cache, ...rest } = options;
  const res = await fetch(url, {
    cache: cache ?? "no-store",
    headers: {
      Accept: "application/json",
      ...(headers || {}),
    },
    ...rest,
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    let message = res.statusText || "Request failed";
    try {
      const data = bodyText ? JSON.parse(bodyText) : null;
      if (data && typeof data === "object") {
        message = data.message || message;
      }
    } catch {}
    if (res.status === 304) {
      message =
        "Not Modified (304) — disable request caching or ensure the server returns 200 with a body.";
    }
    throw new Error(`${res.status} ${message}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export function useApiQuery(
  queryKey,
  url,
  fetchOptions = {},
  queryOptions = {},
) {
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchJSON(url, fetchOptions),
    staleTime: 30000,
    retry: 2,
    ...queryOptions,
  });
}
