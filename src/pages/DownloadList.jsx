import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DownloadList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    const directToken = localStorage.getItem('authToken');
    if (directToken) return directToken;

    try {
      const loginRaw = localStorage.getItem('loginResponse');
      if (!loginRaw) return null;
      const loginData = JSON.parse(loginRaw);
      return loginData?.token || loginData?.accessToken || loginData?.jwt || null;
    } catch {
      return null;
    }
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    if (!token) throw new Error('Sessão expirada. Faça login novamente.');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchFiles = () => {
    setLoading(true);
    axios.get('/api/videos/me', { headers: getAuthHeaders() })
      .then(res => {
        const data = res?.data;
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.videos)
            ? data.videos
            : [];

        setFiles(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDownload = async (video) => {
    const videoId = video?.id || video?.videoId;
    if (!videoId) return;

    const res = await axios.get(`/api/videos/${videoId}/download`, {
      headers: getAuthHeaders(),
    });

    const url = res?.data?.url || res?.data?.signedUrl;
    if (url) window.open(url, '_blank');
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
            {files.map((video, idx) => (
              <tr key={video?.id || video?.videoId || idx}>
                <td>{video?.fileName || video?.name || `Vídeo ${idx + 1}`}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleDownload(video)}
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