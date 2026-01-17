import { useState } from "react";
import { useFilesData, useFileByName } from "../services/files";
export function Tabla({ data }) {
  const { data: filesData, error, isLoading } = useFilesData();

  const [inputValue, setInputValue] = useState("");
  const [searchName, setSearchName] = useState("");
  const { data: fileByData, isLoading: isLoadingByName } =
    useFileByName(searchName);

  const rows = Array.isArray(filesData) ? filesData : [];
  const baseRows =
    searchName && fileByData
      ? Array.isArray(fileByData)
        ? fileByData
        : [fileByData]
      : rows;

  const flatRows = baseRows.flatMap((row, fileIdx) => {
    const fileName = row?.file || "N/A";
    if (!Array.isArray(row?.lines) || row.lines.length === 0) {
      return [
        {
          key: `${fileName}-empty-${fileIdx}`,
          file: fileName,
          text: "",
          number: "",
          hex: "",
        },
      ];
    }

    return row.lines.map((line, lineIdx) => ({
      key: `${fileName}-${lineIdx}`,
      file: fileName,
      text: line?.text || line?.Text || "",
      number: line?.number || line?.Number || "",
      hex: line?.hex || line?.Hex || "",
    }));
  });

  return (
    <div className="container mt-4">
      <h2 className="text-white bg-coral p-2" style={{ fontSize: "20px" }}>
        React Test App
      </h2>

      {isLoading || isLoadingByName ? (
        <div className="d-flex align-items-center justify-content-center min-vh-60">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive mt-4 p-4">
          <div className="d-flex gap-2 h-40 mb-3">
            <input
              placeholder="File Name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchName(inputValue.trim());
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => setSearchName(inputValue.trim())}
            >
              Search
            </button>
            {searchName && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchName("");
                  setInputValue("");
                }}
              >
                Clean
              </button>
            )}
          </div>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th className="bottom-border">File Name</th>
                <th className="bottom-border">Text</th>
                <th className="bottom-border">Number</th>
                <th className="bottom-border">Hex</th>
              </tr>
            </thead>
            <tbody>
              {flatRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No hay datos disponibles
                  </td>
                </tr>
              ) : (
                flatRows.map((row, index) => {
                  const rowClass =
                    index % 2 === 0 ? "table-secondary" : "bg-white";
                  return (
                    <tr key={row.key || index} className={rowClass}>
                      <td>{row.file}</td>
                      <td>{row.text}</td>
                      <td>{row.number}</td>
                      <td>{row.hex}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
