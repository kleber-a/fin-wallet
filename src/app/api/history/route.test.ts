/**
 * @jest-environment node
 */

import { GET } from "@/app/api/history/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

jest.mock('@/modules/mongodb', () => {
    return {
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
                })),
            })),
        }
    };
});

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
            user: { email: userEmail }
        });

        const mockTransactions = [
            { from: userEmail, to: 'other@example.com', amount: 100 },
            { from: 'other@example.com', to: userEmail, amount: 50 },
        ];

        const toArrayMock = jest.fn().mockResolvedValue(mockTransactions);

        (client.db().collection as jest.Mock).mockReturnValue({
            find: jest.fn(() => ({
                sort: jest.fn(() => ({
                    limit: jest.fn(() => ({
                        toArray: toArrayMock,
                    })),
                })),
            })),
        });

        const req = new NextRequest('http://localhost', { method: 'GET' });

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.history).toEqual(undefined);

        expect(client.connect).toHaveBeenCalled();
    });

    it('deve retornar 401 se não estiver autenticado', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const req = new NextRequest('http://localhost', { method: 'GET' });

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe('Não autorizado');
    });

    it('deve lidar com erro interno do servidor', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        (client.connect as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

        const req = new NextRequest('http://localhost', { method: 'GET' });

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe('Erro interno ao buscar histórico');
    });
});
