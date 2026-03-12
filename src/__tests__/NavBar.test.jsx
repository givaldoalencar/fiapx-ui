import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../components/NavBar';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('NavBar', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('renderiza botão Sair', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('renderiza botão Downloads', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText('Downloads')).toBeInTheDocument();
  });

  it('faz logout e navega para login', () => {
    localStorage.setItem('authToken', 'token-teste');
    localStorage.setItem('loginResponse', JSON.stringify({ token: 'token-teste' }));

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Sair'));

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('loginResponse')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});