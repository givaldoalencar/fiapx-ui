import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

jest.mock('react-oidc-context', () => ({
  useAuth: () => ({ user: { profile: { email: 'teste@fiap.com' } } }),
}));

describe('Home', () => {
  it('renderiza Dashboard', () => {
    render(<Home />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});