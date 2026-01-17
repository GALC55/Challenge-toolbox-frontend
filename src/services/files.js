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

export function useFilesData(queryuOptions = {}) {
  return useApiQuery(
    ["files", "data"],
    "http://localhost:3000/files/data",
    {},
    queryuOptions,
  );
}

export function useFileByName(fileName, queryOptions = {}) {
  return useApiQuery(
    ["files", "data", fileName],
    `http://localhost:3000/files/data?filename=${encodeURIComponent(fileName)}`,
    {},
    queryOptions,
  );
}
