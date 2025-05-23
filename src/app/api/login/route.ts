import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    await client.connect();
    const db = client.db("bankOffice");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Compara a senha em texto com o hash armazenado
    const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }

    // Para teste simples (não use senha em texto claro na produção!)
    // if (user.password !== password) {
    //   return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    // }

    // Gera token JWT com payload contendo id e email
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // return NextResponse.json({ token });
    return NextResponse.json({ 
      id: user._id.toString(),
      email: user.email,
      name: user.name || user.email,
      token
     });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
