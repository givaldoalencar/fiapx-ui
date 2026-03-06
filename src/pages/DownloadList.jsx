import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DownloadList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = () => {
    setLoading(true);
    // Altere para seu endpoint que lista arquivos do S3
    axios.get('https://EXEMPLO_ENDPOINT_LISTAR_ARQUIVOS')
      .then(res => {
        setFiles(res.data.files); // Espera um array de nomes de arquivos
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDownload = async (fileName) => {
    // Altere para seu endpoint que gera URL pré-assinada de download
    const res = await axios.post('https://EXEMPLO_ENDPOINT_DOWNLOAD', { fileName });
    window.open(res.data.signedUrl, '_blank');
  };

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-secondary">
          Voltar para Upload
        </Link>
      </div>
      <h2 className="mb-4">Arquivos disponíveis para download</h2>
      {loading ? (
        <div>Carregando arquivos...</div>
      ) : files.length === 0 ? (
        <>
          <div>Nenhum arquivo disponível.</div>
          <div className="mt-3">
            <button className="btn btn-outline-primary" onClick={fetchFiles}>
              Buscar arquivos
            </button>
          </div>
        </>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>Nome</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map((name, idx) => (
              <tr key={idx}>
                <td>{name}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleDownload(name)}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}