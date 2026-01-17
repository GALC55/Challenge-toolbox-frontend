import { useFilesList } from "../services/files";
export function Tabla({ data }) {
  const { data: filesData, error, isLoading } = useFilesList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("Fetched files data:", filesData);
  return (
    <div className="container mt-4">
      <h2 className="text-white bg-coral p-2" style={{ fontSize: "20px" }}>
        React Test App
      </h2>

      <div className="d-flex gap-2 h-40">
        <input placeholder="File Name"></input>
        <button className="btn btn-primary">Buscar</button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Registros</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>file1.csv</td>
            <td>10</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
