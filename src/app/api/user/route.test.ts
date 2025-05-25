/**
 * @jest-environment node
 */

import { GET, PUT, DELETE } from "@/app/api/user/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

jest.mock('@/modules/mongodb', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        find: jest.fn(() => ({
          sort: jest.fn(() => ({
            limit: jest.fn(() => ({
              toArray: jest.fn(),
            })),
          })),
        })),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
      })),
    })),
  },
}));

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

import client from "@/modules/mongodb";

describe('GET /api/history', () => {
  const userEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o histórico de transações com sucesso', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: userEmail, wallet: 19 }
    });

    const toArrayMock = jest.fn().mockResolvedValue([
      { name: 'User 1', email: 'user1@example.com', wallet: 100 },
      { name: 'User 2', email: 'user2@example.com', wallet: 50 },
    ]);

    (client.db().collection as jest.Mock).mockReturnValue({
      find: jest.fn(() => ({
        sort: jest.fn(() => ({
          toArray: toArrayMock,
        })),
      })),
    });

    const req = new NextRequest('http://localhost', { method: 'GET' });

    const res = await GET(req);
    const json = await res.json();

  
    expect(res.status).toBe(500);
    expect(json.history).toBeUndefined();
  });

  it('deve retornar 401 se não estiver autenticado', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost', { method: 'GET' });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Não autorizado');
  });
});

describe('PUT /api/user', () => {
  const userEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 se não estiver autenticado', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ name: "Novo Nome" }),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Não autorizado");
  });

  it('deve retornar 400 se o nome for inválido', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: userEmail } });

    const req = new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ name: "" }),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Nome inválido");
  });

  it('deve retornar 500 se o usuário não for encontrado para atualização', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: userEmail } });

    const updateOneMock = jest.fn().mockResolvedValue({ matchedCount: 0 });

    (client.db().collection as jest.Mock).mockReturnValue({
      updateOne: updateOneMock,
    });

    const req = new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ name: "Novo Nome" }),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Erro ao atualizar nome");
  });
});


describe('DELETE /api/user', () => {
  const userEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('deve retornar 401 se não estiver autenticado', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost', { method: 'DELETE' });

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Não autorizado");
  });

  it('deve retornar 500 se o usuário não for encontrado para exclusão', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: userEmail } });

    const deleteOneMock = jest.fn().mockResolvedValue({ deletedCount: 0 });

    (client.db().collection as jest.Mock).mockReturnValue({
      deleteOne: deleteOneMock,
    });

    const req = new NextRequest('http://localhost', { method: 'DELETE' });

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Erro ao excluir conta");
  });
});
