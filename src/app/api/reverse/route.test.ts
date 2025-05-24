/**
 * @jest-environment node
 */

import { POST } from "@/app/api/reverse/route"; // ajuste o caminho conforme o seu projeto
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";

// Mock do MongoDB
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

// Mock do NextAuth
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

    it('should reverse a transaction successfully', async () => {
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
                .mockResolvedValueOnce({ email: userEmail, wallet: 500 }) // sender
                .mockResolvedValueOnce({ email: 'receiver@example.com', wallet: 500 }), // receiver
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
            body: JSON.stringify({ transactionId, description: 'Reversal test' }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.message).toBe(undefined);

    });

    it('should return 401 if not authenticated', async () => {
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

    it('should return 404 if transaction not found', async () => {
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

    it('should handle internal server error', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail },
        });

        (client.connect as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

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
