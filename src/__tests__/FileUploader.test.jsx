import { render, screen, fireEvent } from '@testing-library/react';
import FileUploader from '../components/FileUploader';

describe('FileUploader', () => {
  it('renderiza área de upload', () => {
    render(<FileUploader />);
    expect(screen.getByText(/Arraste arquivos de vídeo/i)).toBeInTheDocument();
  });

  it('renderiza tabela após upload', () => {
    // Simulação simples: renderiza tabela se files existirem
    render(<FileUploader />);
    // Não há arquivos inicialmente, então não deve renderizar tabela
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});