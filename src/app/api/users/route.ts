import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

export async function GET(request: Request) {
  try {
    // const authorization = request.headers.get('authorization');
    // if (!authorization) {
    //   return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    // }

    // const token = authorization.replace("Bearer ", "");
    // let decoded: any;
    // try {
    //   decoded = jwt.verify(token, JWT_SECRET);
    // } catch {
    //   return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    // }

    // const userEmail = decoded.email;


    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email || !session.user.wallet) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = session.user.email;


    await client.connect();
    const bankOffice = client.db("bankOffice");

    // Buscar usuários que NÃO são o usuário autenticado
    const users = await bankOffice
      .collection("users")
      .find({ email: { $ne: userEmail }, }, { projection: { name: 1, email: 1, wallet: 1 }})
      .sort({ createdAt: -1 })
      .toArray();


    //
    const userAuthenticated = await bankOffice
    .collection("users")
    .findOne({ email: userEmail }, { projection: { name: 1, email: 1, wallet: 1 } });

    return NextResponse.json({ userAuthenticated, users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
