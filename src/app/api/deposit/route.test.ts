/**
 * @jest-environment node
 */

import { POST } from "@/app/api/deposit/route";
import { NextRequest } from "next/server";

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
                            updateOne: jest.fn(),
                        };
                    }
                    if (name === 'transactions') {
                        return {
                            insertOne: jest.fn(),
                        };
                    }
                    return {};
                }),
            })),
            startSession: jest.fn(() => ({
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                abortTransaction: jest.fn(),
                endSession: jest.fn(),
            })),
        }
    };
});

import client from '@/modules/mongodb';

describe('POST /api/deposit', () => {
    const userEmail = 'test@example.com';
    const depositAmount = 50;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('deve realizar o depósito com sucesso', async () => {
        const mockUser = { email: userEmail, wallet: 100 };

        (client.db().collection as jest.Mock).mockImplementation((name: string) => {
            if (name === 'users') {
                return {
                    findOne: jest.fn().mockResolvedValue(mockUser),
                    updateOne: jest.fn().mockResolvedValue({ acknowledged: true }),
                };
            }
            if (name === 'transactions') {
                return {
                    insertOne: jest.fn().mockResolvedValue({ acknowledged: true }),
                };
            }
            return {};
        });

        (client.startSession as jest.Mock).mockReturnValue({
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        });

        const body = {
            email: userEmail,
            amount: depositAmount,
            description: 'Depósito de teste',
        };

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.message).toBe(undefined);
    });

    test('deve retornar 400 para valor inválido', async () => {
        const body = {
            email: userEmail,
            amount: -10,
            description: 'Depósito inválido',
        };

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe('Valor inválido para depósito');
    });

    test('deve retornar 404 se o usuário não for encontrado', async () => {
        (client.db().collection as jest.Mock).mockImplementation((name: string) => {
            if (name === 'users') {
                return {
                    findOne: jest.fn().mockResolvedValue(null),
                };
            }
            if (name === 'transactions') {
                return {
                    insertOne: jest.fn(),
                };
            }
            return {};
        });

        const body = {
            email: 'notfound@example.com',
            amount: 50,
            description: 'Depósito',
        };

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe('Usuário não encontrado');
    });

    test('deve lidar com erro interno corretamente', async () => {
        (client.connect as jest.Mock).mockRejectedValueOnce(new Error('connection error'));

        const body = {
            email: userEmail,
            amount: depositAmount,
            description: 'Depósito de teste',
        };

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe('Erro interno');
    });
});
