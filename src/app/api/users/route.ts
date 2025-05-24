import { NextResponse } from "next/server";
import client from '@/modules/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email || !session.user.wallet) {
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


    //
    const userAuthenticated = await bankOffice
    .collection("users")
    .findOne({ email: userEmail }, { projection: { name: 1, email: 1, wallet: 1 } });

    return NextResponse.json({ userAuthenticated, users });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
