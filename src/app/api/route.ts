import { NextResponse } from "next/server";
import client from '@/modules/mongodb';

export async function GET() {
  try {
    await client.connect();
    const bankOffice = client.db("bankOffice");

    const users = await bankOffice
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}