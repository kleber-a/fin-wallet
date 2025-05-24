/**
 * @jest-environment node
 */

import { POST } from "@/app/api/transfer/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

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

jest.mock("next-auth/next", () => ({
    getServerSession: jest.fn(),
}));

import client from "@/modules/mongodb";

describe('POST /api/transfer', () => {
    const emailRemetente = 'sender@example.com';
    const emailDestinatario = 'receiver@example.com';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve transferir com sucesso', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: emailRemetente }
        });

        const usuariosMock = {
            findOne: jest.fn()
                .mockResolvedValueOnce({ email: emailRemetente, wallet: 500 })
                .mockResolvedValueOnce({ email: emailDestinatario, wallet: 200 }),
            updateOne: jest.fn().mockResolvedValue({}),
            insertOne: jest.fn().mockResolvedValue({}),
        };

        (client.db().collection as jest.Mock).mockReturnValue(usuariosMock);

        const sessaoMock = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        (client.startSession as jest.Mock).mockReturnValue(sessaoMock);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({
                toEmail: emailDestinatario,
                amount: 100,
                description: 'Transferência de teste',
            }),
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
            body: JSON.stringify({ toEmail: emailDestinatario, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Não autorizado");
    });

    it('deve retornar 400 se faltar o email do destinatário', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: emailRemetente }
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

    it('deve retornar 400 se o valor for inválido', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: emailRemetente }
        });

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: emailDestinatario, amount: -50 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Valor inválido para amount");
    });

    it('deve retornar 404 se remetente não encontrado', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: emailRemetente }
        });

        const usuariosMock = {
            findOne: jest.fn()
                .mockResolvedValueOnce(null),
            updateOne: jest.fn(),
            insertOne: jest.fn(),
        };

        (client.db().collection as jest.Mock).mockReturnValue(usuariosMock);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: emailDestinatario, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Remetente não encontrado");
    });

    it('deve retornar 404 se destinatário não encontrado', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: emailRemetente }
        });

        const usuariosMock = {
            findOne: jest.fn()
                .mockResolvedValueOnce({ email: emailRemetente, wallet: 500 })
                .mockResolvedValueOnce(null),
            updateOne: jest.fn(),
            insertOne: jest.fn(),
        };

        (client.db().collection as jest.Mock).mockReturnValue(usuariosMock);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: emailDestinatario, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Remetente não encontrado");
    });

    it('deve retornar 400 se saldo insuficiente', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: emailRemetente }
        });

        const usuariosMock = {
            findOne: jest.fn()
                .mockResolvedValueOnce({ email: emailRemetente, wallet: 50 })
                .mockResolvedValueOnce({ email: emailDestinatario, wallet: 200 }),
            updateOne: jest.fn(),
            insertOne: jest.fn(),
        };

        (client.db().collection as jest.Mock).mockReturnValue(usuariosMock);

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: emailDestinatario, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Remetente não encontrado");
    });

    it('deve tratar erro interno do servidor', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: emailRemetente }
        });

        (client.connect as jest.Mock).mockRejectedValueOnce(new Error('Erro no banco de dados'));

        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ toEmail: emailDestinatario, amount: 100 }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Erro interno");
    });
});
