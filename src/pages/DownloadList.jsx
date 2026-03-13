import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DownloadList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const getAuthToken = () => {
    const directToken = localStorage.getItem('authToken');
    if (directToken) return directToken;

    try {
      const loginRaw = localStorage.getItem('loginResponse');
      if (!loginRaw) return null;
      const loginData = JSON.parse(loginRaw);
      return loginData?.token || loginData?.idToken || loginData?.jwt || null;
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
    axios.get(`${apiBaseUrl}/api/videos/me`, { headers: getAuthHeaders() })
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

    const res = await axios.get(`${apiBaseUrl}/api/videos/${videoId}/download`, {
      headers: getAuthHeaders(),
    });

    const url = res?.data?.url || res?.data?.signedUrl;
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="container mt-5">
      
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0 me-3">Meus Vídeos</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchFiles} title="Atualizar lista">
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </div>
      {loading ? (
        <div>Carregando arquivos...</div>
      ) : files.length === 0 ? (
        <>
          <div>Nenhum arquivo disponível.</div>
          {/* <div className="mt-3">
            <button className="btn btn-outline-primary" onClick={fetchFiles}>
              Buscar arquivos
            </button>
          </div> */}
        </>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>Nome</th>
              <th>Criado em</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {files.map((video, idx) => (
              <tr key={video?.id || video?.videoId || idx}>
                <td>{video?.fileName || video?.name || `Vídeo ${idx + 1}`}</td>
                <td>{video?.createdAt ? new Date(video.createdAt).toLocaleString() : 'N/A'}</td>
                <td>
                  {video?.status === "Completed" ? (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleDownload(video)}
                    >
                      Download
                    </button>
                  ) : (
                    video?.status || 'Processando'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}