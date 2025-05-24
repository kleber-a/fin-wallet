import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { getServerSession } from 'next-auth';
import DashBoard from './page';
import { redirect } from 'next/navigation';


jest.mock('next-auth', () => ({

  getServerSession: jest.fn(),
}));

jest.mock('next-auth');

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('redirect');
  }),
}));


describe('DashBoard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

it('redireciona para / se não houver sessão', async () => {
  (getServerSession as jest.Mock).mockResolvedValue(null);

  try {
    await DashBoard();
  } catch (error) {
    expect(error).toEqual(new Error('redirect'));
  }

  expect(redirect).toHaveBeenCalledWith('/');
});

     it('sem sessão', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const session = await getServerSession();
    expect(session).toBeNull();
  });

  it('com sessão', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'user@example.com' },
    });

    const session = await getServerSession();
    expect(session?.user.email).toBe('user@example.com');
  });

  it('renderiza o dashboard quando há sessão', async () => {
  (getServerSession as jest.Mock).mockResolvedValue({
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });

  const { container } = render(await DashBoard());

  expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  expect(await screen.findByText('Bem-vindo de volta, Usuário Demo!')).toBeInTheDocument();

});

});