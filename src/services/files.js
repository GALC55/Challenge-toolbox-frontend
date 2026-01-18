import { useApiQuery } from "../utils/apiQuery";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Hook para hacer fetch de la lista de archivos
export function useFilesList(queryOptions = {}) {
  return useApiQuery(
    ["files", "list"],
    `${API_URL}/files/list`,
    {},
    queryOptions,
  );
}

// Hook para hacer fetch de la lista de archivos con sus datos
export function useFilesData(queryuOptions = {}) {
  return useApiQuery(
    ["files", "data"],
    `${API_URL}/files/data`,
    {},
    queryuOptions,
  );
}

// Hook para hacer fetch de la lista de archivos con sus datos filtrados por nombre
export function useFileByName(fileName, queryOptions = {}) {
  return useApiQuery(
    ["files", "data", fileName],
    `${API_URL}/files/data?filename=${encodeURIComponent(fileName)}`,
    {},
    { ...queryOptions, enabled: !!fileName && queryOptions.enabled !== false },
  );
}
