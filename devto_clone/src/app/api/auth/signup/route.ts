import { NextResponse } from 'next/server';
import { db } from "~/server/db";
import { hashPassword } from "~/server/auth-utils";
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&identifier=${email}`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p>`,
  });
}

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

    const token = randomBytes(32).toString('hex');
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}