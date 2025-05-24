import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from './page';

describe('Footer', () => {
  it('deve verificar Termos de Serviço', () => {
    render(<Footer />);

    const depositLink = screen.getByRole('link', { name: /Termos de Serviço/i });
    expect(depositLink).toBeInTheDocument();

  });
});