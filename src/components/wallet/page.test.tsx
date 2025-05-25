import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Wallet from './page';
import { getUser } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  getUser: jest.fn(),
}));

const MOCK_DATE = new Date('2025-05-23T10:00:00.000Z');
const realDate = Date;
global.Date = jest.fn(() => MOCK_DATE) as any;
global.Date.now = realDate.now;
global.Date.UTC = realDate.UTC;
global.Date.parse = realDate.parse;
global.Date.prototype.toLocaleDateString = jest.fn(() => "23/05/2025");


describe('Wallet', () => {
  const mockUser = { email: 'test@example.com' };

  beforeEach(() => {
    (getUser as jest.Mock).mockClear();
    (getUser as jest.Mock).mockReset();
  });

  it('deve exibir o loader enquanto carrega os dados', async () => {
    (getUser as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<Wallet user={mockUser} />);

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

  });

  // it('deve exibir o saldo disponível após o carregamento bem-sucedido', async () => {
  //   const mockWalletValue = 1234.56;
  //   (getUser as jest.Mock).mockResolvedValueOnce({
  //     user: { wallet: mockWalletValue },
  //   });

  //   render(<Wallet user={mockUser} />);
  //   expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(screen.getByText('R$ 1.234,56')).toBeInTheDocument();
  //   });

  //   expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
  //   expect(getUser).toHaveBeenCalledWith(mockUser.email);
  // });

  it('deve exibir "Nenhum saldo disponível" se a carteira for indefinida ou nula', async () => {
    (getUser as jest.Mock).mockResolvedValueOnce({ user: { wallet: null } });

    render(<Wallet user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum saldo disponível')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
  });

  it('deve exibir "Nenhum saldo disponível" quando a requisição falha', async () => {
    (getUser as jest.Mock).mockRejectedValueOnce(new Error('Erro na API'));

    render(<Wallet user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum saldo disponível')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
  });

  it('deve exibir a data de atualização corretamente', async () => {
    const mockWalletValue = 500.00;
    (getUser as jest.Mock).mockResolvedValueOnce({
      user: { wallet: mockWalletValue },
    });

    render(<Wallet user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('Atualizado em 23/05/2025')).toBeInTheDocument();
    });
  });
});