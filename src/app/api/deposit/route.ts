import { NextResponse } from "next/server";
import client from '@/modules/mongodb';

export async function POST(request: Request) {
    try {
        const { email, amount, description } = await request.json();

        const userEmail = email;

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

        const depositAmount = typeof amount === "string" ? parseFloat(amount) : amount;

        const sessionDb = client.startSession();

        try {
            sessionDb.startTransaction();

            await users.updateOne(
                { email: userEmail },
                {
                    $inc: { wallet: depositAmount },
                    $set: { updatedAt: new Date() },
                },
                { session: sessionDb }
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
                { session: sessionDb }
            );

            await sessionDb.commitTransaction();

            return NextResponse.json({ message: "Depósito realizado com sucesso" });

        } catch (error) {
            await sessionDb.abortTransaction();
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
                { session: sessionDb }
            );
            return NextResponse.json({ error: "Erro interno no depósito" }, { status: 500 });

        } finally {
            await sessionDb.endSession();
        }

    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}