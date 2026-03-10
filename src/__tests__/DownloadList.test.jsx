import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DownloadList from '../pages/DownloadList';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('DownloadList', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'token-teste');
    axios.get.mockReset();
    window.open = jest.fn();
  });

  it('exibe "Carregando arquivos..." inicialmente', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    render(
      <MemoryRouter>
        <DownloadList />
      </MemoryRouter>
    );
    expect(screen.getByText(/Carregando arquivos/i)).toBeInTheDocument();
  });

  it('exibe "Nenhum arquivo disponível." quando não há arquivos', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter>
        <DownloadList />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/Nenhum arquivo disponível/i)).toBeInTheDocument());
  });

  it('exibe tabela de arquivos quando arquivos são encontrados', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', fileName: 'video1.mp4' },
        { id: '2', fileName: 'video2.mp4' },
      ],
    });
    render(
      <MemoryRouter>
        <DownloadList />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('video1.mp4')).toBeInTheDocument());
    expect(screen.getByText('video2.mp4')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Download' }).length).toBe(2);
  });

  it('chama handleDownload ao clicar no botão Download', async () => {
    axios.get
      .mockResolvedValueOnce({ data: [{ id: 'abc-123', fileName: 'video1.mp4' }] })
      .mockResolvedValueOnce({ data: { url: 'https://url-download' } });
    render(
      <MemoryRouter>
        <DownloadList />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('video1.mp4')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    await waitFor(() => expect(window.open).toHaveBeenCalledWith('https://url-download', '_blank'));
  });
});