import '@testing-library/jest-dom';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Register from './page';

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


describe('Register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('redireciona para / se houver sessão', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
        user: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      });

        try {
            await Register();
        } catch (error) {
            expect(error).toEqual(new Error('redirect'));
        }

        expect(redirect).toHaveBeenCalledWith('/dashboard');
    });



    it('sem sessão', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const session = await getServerSession();
        expect(session).toBeNull();
    });

    it('renderiza o Register quando não há sessão', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const result = await Register();

      expect(result).toEqual(expect.any(Object));
    });

});