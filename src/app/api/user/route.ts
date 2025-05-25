import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {

    const session = await getServerSession(authOptions);


    if (!session || !session.user || !session.user.email ||  session.user.wallet === undefined ||  session.user.wallet === null) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = session.user.email;


    await client.connect();
    const bankOffice = client.db("bankOffice");

    const users = await bankOffice
      .collection("users")
      .find({ email: { $ne: userEmail }, }, { projection: { name: 1, email: 1, wallet: 1 }})
      .sort({ createdAt: -1 })
      .toArray();


    const userAuthenticated = await bankOffice
    .collection("users")
    .findOne({ email: userEmail }, { projection: { name: 1, email: 1, wallet: 1 } });

    return NextResponse.json({ userAuthenticated, users });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    }

    await client.connect();
    const bankOffice = client.db("bankOffice");

    const updateResult = await bankOffice.collection("users").updateOne(
      { email: userEmail },
      { $set: { name: name.trim() } }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Nome atualizado com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar nome" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = session.user.email;

    await client.connect();
    const bankOffice = client.db("bankOffice");

    const deleteResult = await bankOffice.collection("users").deleteOne({ email: userEmail });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Conta excluída com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir conta" }, { status: 500 });
  }
}

