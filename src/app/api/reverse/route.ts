import { NextResponse } from "next/server";
import client from "@/modules/mongodb";
import { getServerSession } from "next-auth";

import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    const { transactionId, description } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: "ID da transação é obrigatório" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("bankOffice");
    const users = db.collection("users");
    const transactions = db.collection("transactions");

    const originalTx = await transactions.findOne({
      _id: new ObjectId(transactionId),
    });

    if (!originalTx) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    if (originalTx.type !== "transfer" || originalTx.status !== "Concluída") {
      return NextResponse.json(
        { error: "Transação não pode ser revertida" },
        { status: 400 }
      );
    }

    if (userEmail !== originalTx.from && userEmail !== originalTx.to) {
      return NextResponse.json(
        { error: "Sem permissão para reverter esta transação" },
        { status: 403 }
      );
    }

    const senderEmail = originalTx.from;
    const receiverEmail = originalTx.to;
    const amount = Number(originalTx.amount);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Valor inválido na transação original" },
        { status: 400 }
      );
    }

    const sender = await users.findOne({ email: senderEmail });
    const receiver = await users.findOne({ email: receiverEmail });

    if (!sender) {
      return NextResponse.json(
        { error: "Remetente não encontrado" },
        { status: 404 }
      );
    }

    if (!receiver) {
      return NextResponse.json(
        { error: "Destinatário não encontrado" },
        { status: 404 }
      );
    }

    if (receiver.wallet < amount) {
      return NextResponse.json(
        { error: "Saldo insuficiente no destinatário para reversão" },
        { status: 400 }
      );
    }

    const sessionDb = client.startSession();

    try {
      sessionDb.startTransaction();

      await users.updateOne(
        { email: receiverEmail },
        {
          $inc: { wallet: -amount },
          $set: { updatedAt: new Date() },
        },
        { session: sessionDb }
      );

      await users.updateOne(
        { email: senderEmail },
        {
          $inc: { wallet: amount },
          $set: { updatedAt: new Date() },
        },
        { session: sessionDb }
      );

      await transactions.insertOne(
        {
          type: "reversal",
          from: receiverEmail,
          to: senderEmail,
          amount: amount,
          description:
            description || `Reversão da transferência ${transactionId}`,
          status: "Concluida",
          originalTransactionId: originalTx._id,
          createdAt: new Date(),
        },
        { session: sessionDb }
      );

      await transactions.updateOne(
        { _id: originalTx._id },
        {
          $set: {
            status: "Revertida",
            updatedAt: new Date(),
          },
        },
        { session: sessionDb }
      );

      await sessionDb.commitTransaction();

      return NextResponse.json({ message: "Reversão realizada com sucesso" });
    } catch (error) {
      await sessionDb.abortTransaction();
      return NextResponse.json(
        { error: "Erro ao reverter a transação" },
        { status: 500 }
      );
    } finally {
      await sessionDb.endSession();
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
