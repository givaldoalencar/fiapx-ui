import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

describe('Home', () => {
  it('renderiza Dashboard', () => {
    render(<Home />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});