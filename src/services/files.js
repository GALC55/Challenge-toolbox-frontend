import { useApiQuery } from "../utils/apiQuery";

// Hook to fetch the files list using TanStack Query
export function useFilesList(queryOptions = {}) {
  return useApiQuery(
    ["files", "list"],
    "http://localhost:3000/files/list",
    {},
    queryOptions,
  );
}
