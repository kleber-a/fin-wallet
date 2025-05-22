import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

export async function GET(request: Request) {
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

    await client.connect();
    const bankOffice = client.db("bankOffice");

    // Buscar usuários que NÃO são o usuário autenticado
    const users = await bankOffice
      .collection("users")
      .find({ email: { $ne: userEmail } }, { projection: { name: 1, email: 1 }})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
