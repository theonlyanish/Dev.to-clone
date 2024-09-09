import { NextResponse } from 'next/server';
import { db } from "~/server/db";
import { hashPassword } from "~/server/auth-utils";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    console.log("Received signup data:", { email, password, name });
    
    const existingUser = await db.user.findUnique({ where: { email } });
    console.log("Existing user:", existingUser);
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    console.log("Hashed password:", hashedPassword);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    console.log("Created user:", user);

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}