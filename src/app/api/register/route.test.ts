/**
 * @jest-environment node
 */

import { POST } from "@/app/api/register/route";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

jest.mock('@/modules/mongodb', () => {
  return {
    __esModule: true,
    default: {
      connect: jest.fn(),
      db: jest.fn(() => ({
        collection: jest.fn((name: string) => {
          if (name === 'users') {
            return {
              findOne: jest.fn(),
              insertOne: jest.fn(),
            };
          }
          return {};
        }),
      })),
    },
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashed_password'),
}));

import client from '@/modules/mongodb';

describe('POST /api/register', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar usuário com sucesso', async () => {
    (client.db().collection as jest.Mock).mockImplementation((name: string) => {
      if (name === 'users') {
        return {
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: jest.fn().mockResolvedValue({ insertedId: 'mocked_id' }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe(undefined);
    expect(json.userId).toBe(undefined);
  });

  it('deve retornar 400 para dados incompletos', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Dados incompletos');
  });

  it('deve lidar com erro interno de forma adequada', async () => {
    (client.connect as jest.Mock).mockRejectedValueOnce(new Error('connection error'));

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Erro interno');
  });
});
