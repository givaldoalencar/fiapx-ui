import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import axios from 'axios';

export default function FileUploader({ userEmail }) {
  const [files, setFiles] = useState([]);
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

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: 'Carregando',
      progress: 0,
      error: null,
      downloadUrl: null,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach((fileObj, index) => uploadFile(fileObj, files.length + index));
  };

  const getPresignedUrl = async (file) => {
    const response = await axios.get(`${apiBaseUrl}/api/videos/upload-url`, {
      params: { fileName: file.name },
      headers: getAuthHeaders(),
    });

    return response?.data?.url || response?.data?.signedUrl;
  };

  const registerVideo = async (fileName, presignedUrl) => {
    const rawS3Path = (presignedUrl || '').split('?')[0];

    const response = await axios.post(
      '/api/videos',
      {
        fileName,
        rawS3Path,
      },
      {
        headers: getAuthHeaders(),
      }
    );

    return response?.data;
  };

  const getDownloadUrl = async (createdVideo) => {
    const videoId = createdVideo?.id || createdVideo?.videoId;
    if (!videoId) return null;

    const response = await axios.get(`${apiBaseUrl}/api/videos/${videoId}/download`, {
      headers: getAuthHeaders(),
    });

    return response?.data?.url || response?.data?.signedUrl || null;
  };

  const uploadFile = async (fileObj, index) => {
    try {
      setFiles(prev => {
        const copy = [...prev];
        copy[index].status = 'Carregando';
        copy[index].error = null;
        return copy;
      });

      const presignedUrl = await getPresignedUrl(fileObj.file);
      if (!presignedUrl) {
        throw new Error('API não retornou URL pré-assinada para upload.');
      }

      await axios.put(presignedUrl, fileObj.file, {
        headers: {
          'Content-Type': fileObj.file.type
        },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setFiles(prev => {
            const copy = [...prev];
            copy[index].progress = percent;
            return copy;
          });
        }
      });

      const createdVideo = await registerVideo(fileObj.file.name, presignedUrl);
      const downloadUrl = await getDownloadUrl(createdVideo);

      setFiles(prev => {
        const copy = [...prev];
        copy[index].status = 'Concluído';
        copy[index].progress = 100;
        copy[index].error = null;
        copy[index].downloadUrl = downloadUrl;
        return copy;
      });

    } catch (error) {
      const apiErrorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === 'string' ? error.response.data : null);

      setFiles(prev => {
        const copy = [...prev];
        copy[index].status = 'Erro';
        copy[index].error = apiErrorMessage || error?.message || 'Erro desconhecido';
        return copy;
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true });

  return (
    <div className="container mt-5">
      <div
        {...getRootProps()}
        className="d-flex flex-row align-items-center justify-content-center border border-2 border-primary rounded-4 p-5 mb-4 bg-light"
        style={{ cursor: 'pointer', minHeight: 180, transition: 'background 0.3s' }}
      >
        <input {...getInputProps()} />
        <svg width="48" height="48" fill="currentColor" className="me-3 text-primary" viewBox="0 0 16 16">
          <path d="M8 0a.5.5 0 0 1 .5.5v7.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 8.293V.5A.5.5 0 0 1 8 0zm-6 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2a.5.5 0 0 1 1 0v2a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-2a.5.5 0 0 1 1 0v2z"/>
        </svg>
        <p className="mb-0 fs-5 fw-semibold text-secondary">Arraste arquivos de vídeo aqui ou clique para selecionar</p>
      </div>
      {files.length > 0 && (
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Progresso</th>
              <th>Erro</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f, i) => (
              <tr key={i}>
                <td>{f.file.name}</td>
                <td>
                  {f.status === 'Carregando' && <span className="badge bg-warning text-dark">Carregando</span>}
                  {f.status === 'Concluído' && <span className="badge bg-success">Concluído</span>}
                  {f.status === 'Erro' && <span className="badge bg-danger">Erro</span>}
                </td>
                <td>
                  <div className="progress" style={{ height: '20px' }}>
                    <div
                      className={`progress-bar ${f.status === 'Concluído' ? 'bg-success' : f.status === 'Erro' ? 'bg-danger' : 'bg-warning'}`}
                      role="progressbar"
                      style={{ width: `${f.progress}%` }}
                      aria-valuenow={f.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {f.progress}%
                    </div>
                  </div>
                </td>
                <td>
                  {f.status === 'Erro' && f.error && (
                    <span className="text-danger">{f.error}</span>
                  )}
                </td>
                <td>
                  {f.status === 'Concluído' && f.downloadUrl && (
                    <a href={f.downloadUrl} className="btn btn-outline-primary btn-sm" target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
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
