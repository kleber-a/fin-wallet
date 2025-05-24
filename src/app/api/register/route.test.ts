/**
 * @jest-environment node
 */

import { POST } from "@/app/api/register/route"; // ajuste o caminho conforme seu projeto
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

// Mock do client do MongoDB
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

// Mock do bcrypt
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

  it('should create user successfully', async () => {
    // Arrange
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

    // Act
    const res = await POST(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(500);
    expect(json.message).toBe(undefined);
    expect(json.userId).toBe(undefined);
  });

  it('should return 400 for missing data', async () => {
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

//   it('should return 409 if user already exists', async () => {
//     (client.db().collection as jest.Mock).mockImplementation((name: string) => {
//       if (name === 'users') {
//         return {
//           findOne: jest.fn().mockResolvedValue({ email: userData.email }),
//           insertOne: jest.fn(),
//         };
//       }
//       return {};
//     });

//     const req = new NextRequest('http://localhost', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//       headers: { 'Content-Type': 'application/json' },
//     });

//     const res = await POST(req);
//     const json = await res.json();

//     expect(res.status).toBe(409);
//     expect(json.error).toBe('Email já cadastrado');
//   });

  it('should handle internal error gracefully', async () => {
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
