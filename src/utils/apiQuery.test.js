import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchJSON, useApiQuery } from "./apiQuery";

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

describe("apiQuery utils", () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchJSON", () => {
    test("debe hacer fetch y parsear JSON exitosamente", async () => {
      const mockData = { name: "test", value: 123 };

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockData,
      });

      const result = await fetchJSON("http://test.com/api");

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        "http://test.com/api",
        expect.objectContaining({
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }),
      );
    });

    test("debe retornar texto si content-type no es JSON", async () => {
      const mockText = "Plain text response";

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "text/plain" }),
        text: async () => mockText,
      });

      const result = await fetchJSON("http://test.com/api");
      expect(result).toBe(mockText);
    });

    test("debe lanzar error cuando la respuesta no es ok", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: new Headers(),
        text: async () => "",
      });

      await expect(fetchJSON("http://test.com/api")).rejects.toThrow(
        "404 Not Found",
      );
    });

    test("debe incluir mensaje de error del servidor si está disponible", async () => {
      const errorMessage = "Invalid request parameters";

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: new Headers(),
        text: async () => JSON.stringify({ message: errorMessage }),
      });

      await expect(fetchJSON("http://test.com/api")).rejects.toThrow(
        errorMessage,
      );
    });

    test("debe manejar error 304 con mensaje específico", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 304,
        statusText: "Not Modified",
        headers: new Headers(),
        text: async () => "",
      });

      await expect(fetchJSON("http://test.com/api")).rejects.toThrow(
        /Not Modified.*disable request caching/,
      );
    });

    test("debe permitir headers personalizados", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      });

      await fetchJSON("http://test.com/api", {
        headers: {
          Authorization: "Bearer token123",
          "X-Custom-Header": "value",
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        "http://test.com/api",
        expect.objectContaining({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer token123",
            "X-Custom-Header": "value",
          },
        }),
      );
    });

    test("debe permitir opciones de fetch personalizadas", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      });

      await fetchJSON("http://test.com/api", {
        method: "POST",
        body: JSON.stringify({ data: "test" }),
      });

      expect(fetch).toHaveBeenCalledWith(
        "http://test.com/api",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ data: "test" }),
        }),
      );
    });

    test("debe manejar cache personalizado", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      });

      await fetchJSON("http://test.com/api", {
        cache: "force-cache",
      });

      expect(fetch).toHaveBeenCalledWith(
        "http://test.com/api",
        expect.objectContaining({
          cache: "force-cache",
        }),
      );
    });
  });

  describe("useApiQuery", () => {
    test("debe ejecutar query exitosamente", async () => {
      const mockData = { result: "success" };

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockData,
      });

      const { result } = renderHook(
        () => useApiQuery("test-key", "http://test.com/api"),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockData);
    });

    test("debe aceptar queryKey como array", async () => {
      const mockData = { result: "success" };

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockData,
      });

      const { result } = renderHook(
        () => useApiQuery(["test", "key"], "http://test.com/api"),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockData);
    });

    test("debe pasar fetchOptions a fetchJSON", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      });

      const { result } = renderHook(
        () =>
          useApiQuery("test-key", "http://test.com/api", { method: "POST" }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(fetch).toHaveBeenCalledWith(
        "http://test.com/api",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    test("debe aplicar queryOptions personalizadas", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      });

      const { result } = renderHook(
        () =>
          useApiQuery(
            "test-key",
            "http://test.com/api",
            {},
            { enabled: false },
          ),
        { wrapper: createWrapper() },
      );

      // Esperar un momento
      await new Promise((resolve) => setTimeout(resolve, 100));

      // No debe hacer fetch porque enabled: false
      expect(fetch).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
