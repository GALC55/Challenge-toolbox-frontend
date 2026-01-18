import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import * as filesService from "./services/files";

// Mock del servicio de archivos
jest.mock("./services/files");

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

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mocks por defecto
    filesService.useFilesData.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });
    filesService.useFileByName.mockReturnValue({
      data: null,
      isLoading: false,
    });
  });

  test("debe renderizar el componente App", () => {
    render(<App />, { wrapper: createWrapper() });
    expect(screen.getByText("React Test App")).toBeInTheDocument();
  });

  test("debe renderizar el componente Tabla", () => {
    render(<App />, { wrapper: createWrapper() });

    // Verificar que la tabla está presente
    expect(screen.getByText("File Name")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByText("Number")).toBeInTheDocument();
    expect(screen.getByText("Hex")).toBeInTheDocument();
  });

  test("debe renderizar correctamente sin datos", () => {
    render(<App />, { wrapper: createWrapper() });
    expect(screen.getByText("No Data")).toBeInTheDocument();
  });
});
