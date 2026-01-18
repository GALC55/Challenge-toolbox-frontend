import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabla } from "./tabla";
import * as filesService from "../services/files";

// Mock del servicio de archivos
jest.mock("../services/files");

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

describe("Tabla Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe renderizar el título correctamente", () => {
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

    render(<Tabla />, { wrapper: createWrapper() });
    expect(screen.getByText("React Test App")).toBeInTheDocument();
  });

  test("debe mostrar spinner mientras carga", () => {
    filesService.useFilesData.mockReturnValue({
      data: [],
      error: null,
      isLoading: true,
      refetch: jest.fn(),
    });
    filesService.useFileByName.mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<Tabla />, { wrapper: createWrapper() });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("debe mostrar error cuando falla la carga", () => {
    const mockRefetch = jest.fn();
    filesService.useFilesData.mockReturnValue({
      data: null,
      error: new Error("Network error"),
      isLoading: false,
      refetch: mockRefetch,
    });
    filesService.useFileByName.mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<Tabla />, { wrapper: createWrapper() });
    expect(
      screen.getByText("Error loading table, please try again"),
    ).toBeInTheDocument();

    const tryAgainButton = screen.getByText("Try again");
    fireEvent.click(tryAgainButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  test('debe mostrar "No Data" cuando no hay datos', () => {
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

    render(<Tabla />, { wrapper: createWrapper() });
    expect(screen.getByText("No Data")).toBeInTheDocument();
  });

  test("debe renderizar datos correctamente", () => {
    const mockData = [
      {
        file: "test.txt",
        lines: [
          { text: "Hello", number: "1", hex: "0x48" },
          { text: "World", number: "2", hex: "0x57" },
        ],
      },
    ];

    filesService.useFilesData.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });
    filesService.useFileByName.mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<Tabla />, { wrapper: createWrapper() });

    const fileNames = screen.getAllByText("test.txt");
    expect(fileNames).toHaveLength(2);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("debe permitir buscar por nombre de archivo", async () => {
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

    render(<Tabla />, { wrapper: createWrapper() });

    const input = screen.getByPlaceholderText("File Name");
    const searchButton = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "test.txt" } });
    fireEvent.click(searchButton);

    expect(input.value).toBe("test.txt");
  });

  test("debe limpiar la búsqueda al hacer click en Clean", () => {
    const mockSearchData = {
      file: "test.txt",
      lines: [{ text: "Test", number: "1", hex: "0x54" }],
    };

    filesService.useFilesData.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });
    filesService.useFileByName.mockReturnValue({
      data: mockSearchData,
      isLoading: false,
    });

    render(<Tabla />, { wrapper: createWrapper() });

    const input = screen.getByPlaceholderText("File Name");
    fireEvent.change(input, { target: { value: "test.txt" } });

    const searchButton = screen.getByText("Search");
    fireEvent.click(searchButton);

    const cleanButton = screen.getByText("Clean");
    fireEvent.click(cleanButton);

    expect(input.value).toBe("");
  });

  test("debe buscar al presionar Enter en el input", () => {
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

    render(<Tabla />, { wrapper: createWrapper() });

    const input = screen.getByPlaceholderText("File Name");
    fireEvent.change(input, { target: { value: "test.txt" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(input.value).toBe("test.txt");
  });

  test("debe aplicar clases alternas a las filas", () => {
    const mockData = [
      {
        file: "test.txt",
        lines: [
          { text: "Line1", number: "1", hex: "0x01" },
          { text: "Line2", number: "2", hex: "0x02" },
        ],
      },
    ];

    filesService.useFilesData.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });
    filesService.useFileByName.mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { container } = render(<Tabla />, { wrapper: createWrapper() });

    const rows = container.querySelectorAll("tbody tr");
    expect(rows[0]).toHaveClass("table-secondary");
    expect(rows[1]).toHaveClass("bg-white");
  });
});
