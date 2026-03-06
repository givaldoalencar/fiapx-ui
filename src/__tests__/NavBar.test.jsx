import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../components/NavBar';
import { useAuth } from "react-oidc-context";

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}));

describe('NavBar', () => {
  it('renderiza botão Sair', () => {
    useAuth.mockReturnValue({ removeUser: jest.fn() });
    render(<NavBar />);
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('renderiza botão Downloads', () => {
    useAuth.mockReturnValue({ removeUser: jest.fn() });
    render(<NavBar />);
    expect(screen.getByText('Downloads')).toBeInTheDocument();
  });
});