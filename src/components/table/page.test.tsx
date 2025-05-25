import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Table from './page';
import { getUser } from '@/lib/api';


   jest.mock('@/lib/api', () => ({
        getUser: jest.fn(() => {users: []}),
    }));
describe('Table', () => {
  const mockUser = { email: 'test@example.com' };

  const mockTransactions = [
    {
      _id: '1',
      type: 'deposit',
      description: 'Depósito inicial',
      from: null,
      to: 'Conta XPTO',
      createdAt: '2025-05-22T10:00:00.000Z',
      status: 'completed',
      amount: 1000.00,
    },
    {
      _id: '2',
      type: 'transfer',
      description: 'Transferência para amigo',
      from: 'Conta XPTO',
      to: 'Amigo A',
      createdAt: '2025-05-21T15:30:00.000Z',
      status: 'completed',
      amount: -250.00,
    },
    {
      _id: '3',
      type: 'reversal',
      description: 'Estorno de compra',
      from: 'Loja B',
      to: 'Conta XPTO',
      createdAt: '2025-05-20T08:45:00.000Z',
      status: 'completed',
      amount: 50.00,
    },
  ];

    beforeEach(() => {
      (getUser as jest.Mock).mockClear();
      (getUser as jest.Mock).mockReset();
    });
  
    it('teste', () => {
      render(<Table user={mockUser} />)
    })





});