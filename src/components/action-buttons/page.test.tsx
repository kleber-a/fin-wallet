import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ActionButtons from './page';

describe('ActionButtons', () => {
  it('deve renderizar os botões de ação com textos e links corretos', () => {
    render(<ActionButtons />);
    
    const depositLink = screen.getByRole('link', { name: /depositar/i });
    expect(depositLink).toBeInTheDocument();
    expect(depositLink).toHaveAttribute('href', '/dashboard/deposit');
    
    const transferLink = screen.getByRole('link', { name: /transferir/i });
    expect(transferLink).toBeInTheDocument();
    expect(transferLink).toHaveAttribute('href', '/dashboard/transfer');
  });
});