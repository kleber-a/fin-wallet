import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

export async function POST(request: Request) {
    try {
        const authorization = request.headers.get('authorization');
        if (!authorization) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const token = authorization.replace("Bearer ", "");
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch {
            return NextResponse.json({ error: "Token inválido" }, { status: 401 });
        }

        const userEmail = decoded.email;

        const { amount, description } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Valor inválido para depósito" }, { status: 400 });
        }

        await client.connect();
        const db = client.db("bankOffice");
        const users = db.collection("users");
        const transactions = db.collection("transactions");

        const user = await users.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // Converte amount para number (caso venha string)
        const depositAmount = typeof amount === "string" ? parseFloat(amount) : amount;

        // Atualiza wallet somando o valor depositado (pode ser negativo antes)
        const session = client.startSession();

        try {
            // Inicia a transação
            session.startTransaction();

            // Operações dentro da transação
            await users.updateOne(
                { email: userEmail },
                {
                    $inc: { wallet: depositAmount },
                    $set: { updatedAt: new Date() },
                },
                { session }
            );

            await transactions.insertOne(
                {
                    type: 'deposit',
                    from: null,
                    to: userEmail,
                    amount: depositAmount,
                    description: description || `Depósito de R$${depositAmount.toFixed(2)}`,
                    status: "concluida",
                    createdAt: new Date(),
                },
                { session }
            );

            // Confirma (commit) a transação
            await session.commitTransaction();

            return NextResponse.json({ message: "Depósito realizado com sucesso" });

        } catch (error) {
            // Desfaz (rollback) se der erro
            await session.abortTransaction();
             await transactions.insertOne(
                {
                    type: 'deposit',
                    from: null,
                    to: userEmail,
                    amount: depositAmount,
                    description: description || `Depósito de R$${depositAmount.toFixed(2)}`,
                    status: "Falhou",
                    createdAt: new Date(),
                },
                { session }
            );
            console.error('Erro no depósito:', error);
            return NextResponse.json({ error: "Erro interno no depósito" }, { status: 500 });

        } finally {
            // Encerra a sessão
            await session.endSession();
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
