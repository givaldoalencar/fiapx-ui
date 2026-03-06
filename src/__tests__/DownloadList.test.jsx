import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DownloadList from '../pages/DownloadList';
import axios from 'axios';

jest.mock('axios');

describe('DownloadList', () => {
  it('exibe "Carregando arquivos..." inicialmente', () => {
    render(<DownloadList />);
    expect(screen.getByText(/Carregando arquivos/i)).toBeInTheDocument();
  });

  it('exibe "Nenhum arquivo disponível." quando não há arquivos', async () => {
    axios.get.mockResolvedValueOnce({ data: { files: [] } });
    render(<DownloadList />);
    await waitFor(() => expect(screen.getByText(/Nenhum arquivo disponível/i)).toBeInTheDocument());
  });

  it('exibe tabela de arquivos quando arquivos são encontrados', async () => {
    axios.get.mockResolvedValueOnce({ data: { files: ['video1.mp4', 'video2.mp4'] } });
    render(<DownloadList />);
    await waitFor(() => expect(screen.getByText('video1.mp4')).toBeInTheDocument());
    expect(screen.getByText('video2.mp4')).toBeInTheDocument();
    expect(screen.getAllByText('Download').length).toBe(2);
  });

  it('chama handleDownload ao clicar no botão Download', async () => {
    axios.get.mockResolvedValueOnce({ data: { files: ['video1.mp4'] } });
    axios.post.mockResolvedValueOnce({ data: { signedUrl: 'https://url-download' } });
    window.open = jest.fn();
    render(<DownloadList />);
    await waitFor(() => expect(screen.getByText('video1.mp4')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Download'));
    await waitFor(() => expect(window.open).toHaveBeenCalledWith('https://url-download', '_blank'));
  });
});