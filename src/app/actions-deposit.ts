"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ajuste para onde está seu authOptions
import client from "@/modules/mongodb";


const depositSchema = z.object({
  amount: z
    .number({ invalid_type_error: "O valor deve ser um número válido." })
    .min(0.01, "O valor do depósito deve ser maior que zero.")
    .max(1000000, "O valor máximo de depósito é R$ 1.000.000,00."),
  description: z.string().max(200).optional(),
});

export async function teste(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return { error: { auth: "Não autorizado" } };
  }

  const data = {
    amount: Number(formData.get("amount")),
    description: formData.get("description") as string | undefined,
  };

  const parsed = depositSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { amount, description } = parsed.data;
  const userEmail = session.user.email;

  try {
    await client.connect();
    const db = client.db("bankOffice");
    const users = db.collection("users");
    const transactions = db.collection("transactions");

    const user = await users.findOne({ email: userEmail });
    if (!user) {
      return { error: { user: "Usuário não encontrado" } };
    }

    const sessionDb = client.startSession();

    try {
      sessionDb.startTransaction();

      await users.updateOne(
        { email: userEmail },
        {
          $inc: { wallet: amount },
          $set: { updatedAt: new Date() },
        },
        { session: sessionDb }
      );

      await transactions.insertOne(
        {
          type: "deposit",
          from: null,
          to: userEmail,
          amount: amount,
          description:
            description || `Depósito de R$${amount.toFixed(2)}`,
          status: "concluída",
          createdAt: new Date(),
        },
        { session: sessionDb }
      );

      await sessionDb.commitTransaction();

      return {
        success: true,
        message: "Depósito efetuado com sucesso!",
      };
    } catch (error) {
      await sessionDb.abortTransaction();

      await transactions.insertOne(
        {
          type: "deposit",
          from: null,
          to: userEmail,
          amount: amount,
          description:
            description || `Depósito de R$${amount.toFixed(2)}`,
          status: "falhou",
          createdAt: new Date(),
        },
        { session: sessionDb }
      );

      return {
        error: { transaction: "Erro no processamento do depósito." },
      };
    } finally {
      await sessionDb.endSession();
    }
  } catch (error) {
    return { error: { server: "Erro interno no servidor." } };
  }
}
