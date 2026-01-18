import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFilesList, useFilesData, useFileByName } from "./files";

// Mock de fetch
global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Files Service Hooks", () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock de variable de entorno
    process.env.REACT_APP_BACKEND_URL = "http://localhost:3000";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("useFilesList", () => {
    test("debe obtener la lista de archivos exitosamente", async () => {
      const mockFiles = ["file1.txt", "file2.txt", "file3.txt"];

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockFiles,
      });

      const { result } = renderHook(() => useFilesList(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockFiles);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/files/list",
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
          }),
        }),
      );
    });
  });

  describe("useFilesData", () => {
    test("debe obtener los datos de archivos exitosamente", async () => {
      const mockData = [
        {
          file: "test.txt",
          lines: [{ text: "Hello", number: "1", hex: "0x48" }],
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockData,
      });

      const { result } = renderHook(() => useFilesData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/files/data",
        expect.any(Object),
      );
    });

    test("debe manejar respuesta vacía", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => [],
      });

      const { result } = renderHook(() => useFilesData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([]);
    });
  });

  describe("useFileByName", () => {
    test("debe obtener archivo por nombre exitosamente", async () => {
      const fileName = "test.txt";
      const mockFileData = {
        file: "test.txt",
        lines: [{ text: "Content", number: "1", hex: "0x43" }],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockFileData,
      });

      const { result } = renderHook(() => useFileByName(fileName), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockFileData);
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/files/data?filename=${encodeURIComponent(fileName)}`,
        expect.any(Object),
      );
    });

    test("debe codificar nombres de archivo con caracteres especiales", async () => {
      const fileName = "test file (1).txt";

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      });

      const { result } = renderHook(() => useFileByName(fileName), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(fileName)),
        expect.any(Object),
      );
    });

    test("no debe hacer request si fileName está vacío", async () => {
      const { result } = renderHook(() => useFileByName(""), {
        wrapper: createWrapper(),
      });

      // Esperar un momento para asegurar que no se hizo ninguna llamada
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
