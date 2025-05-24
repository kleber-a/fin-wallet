/**
 * @jest-environment node
 */

import { POST } from "@/app/api/transfer/route"; // ajuste o caminho conforme seu projeto
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

// Mock do client do MongoDB
jest.mock('@/modules/mongodb', () => {
    return {
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
        }
    };
});

// Mock do NextAuth
jest.mock("next-auth/next", () => ({
    getServerSession: jest.fn(),
}));

import client from "@/modules/mongodb";

describe('POST /api/transfer', () => {
    const userEmail = 'sender@example.com';
    const receiverEmail = 'receiver@example.com';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should transfer successfully', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        const mockUsers = {
            findOne: jest.fn()
                .mockResolvedValueOnce({ email: userEmail, wallet: 500 }) // Sender
                .mockResolvedValueOnce({ email: receiverEmail, wallet: 200 }), // Receiver
            updateOne: jest.fn().mockResolvedValue({}),
            insertOne: jest.fn().mockResolvedValue({}),
        };

        (client.db().collection as jest.Mock).mockReturnValue(mockUsers);

        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        (client.startSession as jest.Mock).mockReturnValue(mockSession);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({
                toEmail: receiverEmail,
                amount: 100,
                description: 'Test transfer',
            }),
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
            body: JSON.stringify({ toEmail: receiverEmail, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Não autorizado");
    });

    it('should return 400 if toEmail is missing', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Email do destinatário é obrigatório");
    });

    it('should return 400 if amount is invalid', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: receiverEmail, amount: -50 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Valor inválido para amount");
    });

    it('should return 404 if sender not found', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        const mockUsers = {
            findOne: jest.fn()
                .mockResolvedValueOnce(null), // Sender not found
            updateOne: jest.fn(),
            insertOne: jest.fn(),
        };

        (client.db().collection as jest.Mock).mockReturnValue(mockUsers);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: receiverEmail, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Remetente não encontrado");
    });

    it('should return 404 if receiver not found', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        const mockUsers = {
            findOne: jest.fn()
                .mockResolvedValueOnce({ email: userEmail, wallet: 500 }) // Sender
                .mockResolvedValueOnce(null), // Receiver not found
            updateOne: jest.fn(),
            insertOne: jest.fn(),
        };

        (client.db().collection as jest.Mock).mockReturnValue(mockUsers);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: receiverEmail, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Remetente não encontrado");
    });

    it('should return 400 if insufficient funds', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        const mockUsers = {
            findOne: jest.fn()
                .mockResolvedValueOnce({ email: userEmail, wallet: 50 }) // Sender with low balance
                .mockResolvedValueOnce({ email: receiverEmail, wallet: 200 }),
            updateOne: jest.fn(),
            insertOne: jest.fn(),
        };

        (client.db().collection as jest.Mock).mockReturnValue(mockUsers);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: receiverEmail, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Remetente não encontrado");
    });

    it('should handle internal server error', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        (client.connect as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: receiverEmail, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Erro interno");
    });
});
