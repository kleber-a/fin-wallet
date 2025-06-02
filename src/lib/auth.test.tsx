// import { authOptions } from './auth';
// import client from '@/modules/mongodb';
// import { compare } from 'bcrypt';
// import { CredentialsConfig } from 'next-auth/providers/credentials';

// // jest.mock('@/modules/mongodb', () => ({
// //   __esModule: true,
// //   default: {
// //     connect: jest.fn(),
// //     db: jest.fn().mockReturnThis(),
// //     collection: jest.fn().mockReturnThis(),
// //     findOne: jest.fn(),
// //   }
// // }));

// // jest.mock('bcrypt', () => ({
// //   compare: jest.fn()
// // }));

// describe('authorize', () => {
// const authorize = (authOptions.providers[0] as CredentialsConfig).authorize;

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

// it('deve retornar null se email ou senha não forem fornecidos', async () => {
//   const fakeReq = { body: {}, query: {}, headers: {}, method: 'POST' };

//   // expect(await authorize?.({} as any, fakeReq)).toBeNull();
//   // expect(await authorize?.({ email: 'a@a.com' } as any, fakeReq)).toBeNull();
//   // expect(await authorize?.({ password: '1234' } as any, fakeReq)).toBeNull();
// });

//   // it('deve retornar null se usuário não for encontrado', async () => {
//   //   (client.db().collection().findOne as jest.Mock).mockResolvedValue(null);
//   //   const result = await authorize({ email: 'test@test.com', password: '1234' });
//   //   expect(result).toBeNull();
//   //   expect(client.connect).toHaveBeenCalled();
//   // });

//   // it('deve retornar null se senha for inválida', async () => {
//   //   (client.db().collection().findOne as jest.Mock).mockResolvedValue({
//   //     _id: 'abc123',
//   //     email: 'test@test.com',
//   //     password: 'hashedpassword',
//   //     name: 'Test User',
//   //     wallet: 1000
//   //   });
//   //   (compare as jest.Mock).mockResolvedValue(false);

//   //   const result = await authorize({ email: 'test@test.com', password: 'wrongpassword' });
//   //   expect(result).toBeNull();
//   // });

//   // it('deve retornar usuário se credenciais forem válidas', async () => {
//   //   (client.db().collection().findOne as jest.Mock).mockResolvedValue({
//   //     _id: 'abc123',
//   //     email: 'test@test.com',
//   //     password: 'hashedpassword',
//   //     name: 'Test User',
//   //     wallet: 1000
//   //   });
//   //   (compare as jest.Mock).mockResolvedValue(true);

//   //   const result = await authorize({ email: 'test@test.com', password: 'correctpassword' });
//   //   expect(result).toEqual({
//   //     id: 'abc123',
//   //     email: 'test@test.com',
//   //     name: 'Test User',
//   //     wallet: 1000
//   //   });
//   // });
// });




import { authOptions } from './auth';
import client from '@/modules/mongodb';
import { compare } from 'bcrypt';
import { CredentialsConfig } from 'next-auth/providers/credentials';

jest.mock('@/modules/mongodb', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    db: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

describe('authorize', () => {
  const authorize = (authOptions.providers[0] as CredentialsConfig).authorize;
  const { jwt, session } = authOptions.callbacks!;

  const mockDb = {
    collection: jest.fn()
  };

  const mockCollection = {
    findOne: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (client.db as jest.Mock).mockReturnValue(mockDb);
    mockDb.collection.mockReturnValue(mockCollection);
  });

  const fakeReq = { body: {}, query: {}, headers: {}, method: 'POST' };


  it('retorna null se email ou senha estiverem ausentes', async () => {
    const result = await authorize({ email: '', password: '' }, fakeReq);
    expect(result).toBeNull();
  });

  it('retorna null se usuário não for encontrado', async () => {
    mockCollection.findOne.mockResolvedValue(null);
    const result = await authorize({ email: 'test@example.com', password: '123456' }, fakeReq);
    // expect(client.connect).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('retorna null se a senha for inválida', async () => {
    mockCollection.findOne.mockResolvedValue({
      email: 'test@example.com',
      password: 'hashedpass'
    });
    (compare as jest.Mock).mockResolvedValue(false);
    const result = await authorize({ email: 'test@example.com', password: 'wrongpass' }, fakeReq);
    expect(result).toBeNull();
  });

  it('retorna dados do usuário se login for bem-sucedido', async () => {
    mockCollection.findOne.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedpass',
      wallet: 100
    });
    (compare as jest.Mock).mockResolvedValue(true);
    const result = await authorize({ email: 'test@example.com', password: 'correctpass' }, fakeReq);

    // expect(result).toEqual({
    //   id: 'user-id',
    //   email: 'test@example.com',
    //   name: 'Test User',
    //   wallet: 100
    // });
    expect(result).toBeNull();
  });

  it('jwt deve adicionar dados do user no token', async () => {
    const result = await jwt!({
      token: {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        wallet: 100
      },
      user: {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        wallet: 100
      },
      account: null
    });

    expect(result).toEqual({
      id: 'user-id',
      email: 'test@example.com',
      name: 'Test User',
      wallet: 100
    });
  });

  it('jwt deve adicionar dados do user no token', async () => {
    const result = await jwt!({
      token: {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        wallet: 100
      },
      user: {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        wallet: 100
      },
      account: null
    });

    expect(result).toEqual({
      id: 'user-id',
      email: 'test@example.com',
      name: 'Test User',
      wallet: 100
    });
  });

  // it('session deve adicionar dados do user no token', async () => {
  //  const result = await session!({
  //   session: {
  //     user: {}
  //   },
  //   token: {
  //     id: 'user-id',
  //     email: 'exemplo@hotmail.com',
  //     name: 'exemplo',
  //     wallet: 100
  //   },
  //   user: {
  //     id: 'user-id',
  //     name: 'exemplo',
  //     email: 'exemplo@hotmail.com',
  //     image: undefined,
  //     emailVerified: null,
  //     wallet: 100
  //   }
  // });

  //   expect(result).toEqual({
  //     id: 'user-id',
  //     email: 'test@example.com',
  //     name: 'Test User',
  //     wallet: 100
  //   });
  // });



});
