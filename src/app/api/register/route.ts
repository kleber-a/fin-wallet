import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import bcrypt from 'bcrypt';
import { Long } from "mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("bankOffice");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
