import { authOptions } from '@/lib/auth';
import { compare } from 'bcrypt';
import client from '@/modules/mongodb';

jest.mock('@/modules/mongodb', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        findOne: jest.fn(),
      })),
    })),
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('authOptions', () => {
  const mockUser = {
    _id: 'mocked-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    wallet: 100,
  };

  const db = client.db();
  const usersCollection = db.collection('users');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('callbacks', () => {
    it('jwt callback deve adicionar dados no token', async () => {
      const token = { test: true };
      const user = {
        id: 'user-id',
        email: 'user@example.com',
        name: 'User',
        wallet: 200,
      };

      const result = await authOptions.callbacks?.jwt?.({ token, user } as any);

      expect(result).toEqual({
        test: true,
        id: 'user-id',
        email: 'user@example.com',
        name: 'User',
        wallet: 200,
      });
    });

    it('session callback deve adicionar dados na sessão', async () => {
      const session = { user: { name: 'User', email: 'user@example.com' } };
      const token = {
        id: 'user-id',
        email: 'user@example.com',
        name: 'User',
        wallet: 300,
      };

      const result = await authOptions.callbacks?.session?.({ session, token } as any);

      expect(result).toEqual({
        user: {
          id: 'user-id',
          email: 'user@example.com',
          name: 'User',
          wallet: 300,
        },
      });
    });
  });
});
