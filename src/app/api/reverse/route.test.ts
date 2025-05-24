/**
 * @jest-environment node
 */

import { POST } from "@/app/api/reverse/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";

jest.mock('@/modules/mongodb', () => ({
    __esModule: true,
    default: {
        connect: jest.fn(),
        db: jest.fn(() => ({
            collection: jest.fn(() => ({
                findOne: jest.fn(),
                updateOne: jest.fn(),
                insertOne: jest.fn(),
            })),
        })),
        startSession: jest.fn(() => ({
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        })),
    },
}));

jest.mock("next-auth/next", () => ({
    getServerSession: jest.fn(),
}));

import client from "@/modules/mongodb";

describe('POST /api/reverse', () => {
    const userEmail = 'test@example.com';
    const transactionId = new ObjectId().toHexString();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve reverter uma transação com sucesso', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail },
        });

        const mockTransaction = {
            _id: new ObjectId(transactionId),
            from: userEmail,
            to: 'receiver@example.com',
            amount: 100,
            type: 'transfer',
            status: 'Concluída',
        };

        const usersCollectionMock = {
            findOne: jest.fn()
                .mockResolvedValueOnce({ email: userEmail, wallet: 500 })
                .mockResolvedValueOnce({ email: 'receiver@example.com', wallet: 500 }),
            updateOne: jest.fn().mockResolvedValue({}),
        };

        const transactionsCollectionMock = {
            findOne: jest.fn().mockResolvedValue(mockTransaction),
            insertOne: jest.fn().mockResolvedValue({}),
            updateOne: jest.fn().mockResolvedValue({}),
        };

        (client.db().collection as jest.Mock)
            .mockImplementation((name: string) => {
                if (name === 'users') return usersCollectionMock;
                if (name === 'transactions') return transactionsCollectionMock;
            });

        const sessionMock = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        (client.startSession as jest.Mock).mockReturnValue(sessionMock);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ transactionId, description: 'Teste de reversão' }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.message).toBe(undefined);
    });

    it('deve retornar 401 se não estiver autenticado', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ transactionId }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe('Não autorizado');
    });

    it('deve retornar 404 se a transação não for encontrada', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail },
        });

        (client.db().collection as jest.Mock).mockReturnValue({
            findOne: jest.fn().mockResolvedValue(null),
        });

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ transactionId }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe('Transação não encontrada');
    });

    it('deve lidar com erro interno do servidor', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail },
        });

        (client.connect as jest.Mock).mockRejectedValueOnce(new Error('Erro no banco'));

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ transactionId }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe('Erro interno');
    });
});
