// import { NextResponse } from "next/server";
// import client from '@/modules/mongodb';
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

// export async function GET(request: Request) {
//     try {
//         const authorization = request.headers.get('authorization');
//         if (!authorization) {
//             return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
//         }

//         const token = authorization.replace("Bearer ", "");
//         let decoded: any;
//         try {
//             decoded = jwt.verify(token, JWT_SECRET);
//         } catch {
//             return NextResponse.json({ error: "Token inválido" }, { status: 401 });
//         }

//         const userEmail = decoded.email;

//         await client.connect();
//         const db = client.db("bankOffice");
//         const transactions = db.collection("transactions");

//         // Buscar transações onde o usuário é remetente OU destinatário
//         const history = await transactions
//             .find({
//                 $or: [
//                     { from: userEmail },
//                     { to: userEmail }
//                 ]
//             })
//             .sort({ createdAt: -1 }) // Mais recentes primeiro
//             .toArray();

//         return NextResponse.json({ history });

//     } catch (error) {
//         console.error('Erro ao buscar histórico de transferências:', error);
//         return NextResponse.json(
//             { error: "Erro interno ao buscar histórico" },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // caminho onde configura o NextAuth

export async function GET(request: Request) {
  try {
    // Recupera a sessão do usuário (autenticado)
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = session.user.email;

    await client.connect();
    const db = client.db("bankOffice");
    const transactions = db.collection("transactions");

    // Buscar transações onde o usuário é remetente OU destinatário
    const history = await transactions
        .find({
        $or: [{ from: userEmail }, { to: userEmail }],
      })
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .limit(10)
      .toArray();

    return NextResponse.json({ history });

  } catch (error) {
    console.error('Erro ao buscar histórico de transferências:', error);
    return NextResponse.json(
      { error: "Erro interno ao buscar histórico" },
      { status: 500 }
    );
  }
}
