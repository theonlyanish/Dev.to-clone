import { NextResponse } from 'next/server';
import { createUser } from '~/server/auth';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const user = await createUser(email, password, name);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
