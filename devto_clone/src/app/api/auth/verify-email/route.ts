import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const identifier = searchParams.get('identifier');

  if (!token || !identifier) {
    return NextResponse.json({ error: 'Invalid verification link' }, { status: 400 });
  }

  const verificationToken = await db.verificationToken.findUnique({
    where: { identifier_token: { identifier, token } },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return NextResponse.json({ error: 'Verification link expired or invalid' }, { status: 400 });
  }

  await db.user.update({
    where: { email: identifier },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({
    where: { identifier_token: { identifier, token } },
  });

  return NextResponse.redirect('/login');
}
