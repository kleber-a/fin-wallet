import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardNav from './page';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from 'next/navigation';

describe('DashboardNav', () => {
  it('deve renderizar todos os links de navegação', () => {

    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(<DashboardNav />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /transferir/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /depositar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /histórico/i })).toBeInTheDocument();
  });

  it('deve marcar o link ativo baseado no pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/transfer');

    render(<DashboardNav />);

    const activeLink = screen.getByRole('link', { name: /transferir/i });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('bg-green-100', 'text-green-700', 'border-l-4', 'border-green-600');

    const otherLink = screen.getByRole('link', { name: /dashboard/i });
    expect(otherLink).not.toHaveAttribute('aria-current');
  });
});
