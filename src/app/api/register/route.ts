import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import bcrypt from 'bcrypt';
import { Decimal128, Long } from "mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("bankOffice");
    const usersCollection = db.collection("users");

    // Verifica se o email já existe
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    // Faz o hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Cria o usuário com wallet inicial 0.00 (Decimal128)
    const newUser = {
      name,
      email,
      password: hashedPassword,
      wallet: Long.fromNumber(3000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json({ message: "Usuário criado com sucesso", userId: result.insertedId });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
