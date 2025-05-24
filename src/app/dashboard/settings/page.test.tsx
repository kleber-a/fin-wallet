import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { getServerSession } from 'next-auth';
import Settings from './page';
import { redirect } from 'next/navigation';


jest.mock('next-auth', () => ({

  getServerSession: jest.fn(),
}));

jest.mock('next-auth');

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('redirect');
  }),
    useRouter: jest.fn(),
}));


describe('Settings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

it('redireciona para / se não houver sessão', async () => {
  (getServerSession as jest.Mock).mockResolvedValue(null);

  try {
    await Settings();
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

it('renderiza o Settings quando há sessão', async () => {
  (getServerSession as jest.Mock).mockResolvedValue({
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });

  const result = await Settings();

  expect(result).toEqual(expect.any(Object));
});

});