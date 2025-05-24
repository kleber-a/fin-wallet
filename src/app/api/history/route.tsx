import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // caminho onde configura o NextAuth

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      console.warn("aqui")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log('email',userEmail)

    await client.connect();
    const db = client.db("bankOffice");
    const transactions = db.collection("transactions");

    const history = await transactions
        .find({
        $or: [{ from: userEmail }, { to: userEmail }],
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

      console.warn('history', history)

    return NextResponse.json({ history });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao buscar histórico" },
      { status: 500 }
    );
  }
}
