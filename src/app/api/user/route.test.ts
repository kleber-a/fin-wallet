/**
 * @jest-environment node
 */

import { GET } from "@/app/api/user/route"; // ajuste o caminho conforme seu projeto
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

// Mock do NextAuth
jest.mock("next-auth/next", () => ({
    getServerSession: jest.fn(),
}));

import client from "@/modules/mongodb";

describe('GET /api/history', () => {
    const userEmail = 'test@example.com';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return transaction history successfully', async () => {
        // Arrange
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

        // Act
        const res = await GET(req);
        const json = await res.json();

        // Assert
        expect(res.status).toBe(401);
        expect(json.history).toEqual(undefined);
    });

    it('should return 401 if not authenticated', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const req = new NextRequest('http://localhost', { method: 'GET' });

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe('Não autorizado');
    });

    it('should handle internal server error', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { email: userEmail }
        });

        (client.connect as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

        const req = new NextRequest('http://localhost', { method: 'GET' });

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Não autorizado");
    });
});
