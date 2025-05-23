import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const senderEmail = session.user.email;
        const { toEmail, amount, description } = await request.json();

        const amountNumber = Number(amount);

        if (!toEmail) {
            return NextResponse.json({ error: "Email do destinatário é obrigatório" }, { status: 400 });
        }

        if (isNaN(amountNumber) || amountNumber <= 0) {
            return NextResponse.json({ error: "Valor inválido para amount" }, { status: 400 });
        }

        await client.connect();
        const db = client.db("bankOffice");
        const users = db.collection("users");
        const transactions = db.collection('transactions');

        const sender = await users.findOne({ email: senderEmail });
        const receiver = await users.findOne({ email: toEmail });

        if (!sender) {
            return NextResponse.json({ error: "Remetente não encontrado" }, { status: 404 });
        }

        if (!receiver) {
            return NextResponse.json({ error: "Destinatário não encontrado" }, { status: 404 });
        }

        if (sender.wallet < amountNumber) {
            return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });
        }

        const sessionDb = client.startSession();

        try {
            sessionDb.startTransaction();

            await users.updateOne(
                { email: senderEmail },
                {
                    $inc: { wallet: -amountNumber },
                    $set: { updatedAt: new Date() },
                },
                { session: sessionDb }
            );

            await users.updateOne(
                { email: toEmail },
                {
                    $inc: { wallet: amountNumber },
                    $set: { updatedAt: new Date() },
                },
                { session: sessionDb }
            );

            await transactions.insertOne(
                {
                    type: 'transfer',
                    from: senderEmail,
                    to: toEmail,
                    amount: amountNumber,
                    description: description || `Transferência de R$${amountNumber.toFixed(2)} de ${senderEmail} para ${toEmail}`,
                    status: "Concluída",
                    createdAt: new Date(),
                },
                { session: sessionDb }
            );
            
            await sessionDb.commitTransaction();

            return NextResponse.json({ message: "Transferência realizada com sucesso" });

        } catch (error) {
            await sessionDb.abortTransaction();

            await transactions.insertOne({
                type: 'transfer',
                from: senderEmail,
                to: toEmail,
                amount: amountNumber,
                description: description || "Tentativa de transferência falhou",
                status: "Falhou",
                createdAt: new Date(),
            });

            return NextResponse.json({ error: "Erro na transferência" }, { status: 500 });
        } finally {
            await sessionDb.endSession();
        }

    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
