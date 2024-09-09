import bcrypt from 'bcrypt';
import { db } from "~/server/db";

export async function verifyPassword(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  if (!user.password) {

    return { id: user.id, email: user.email, name: user.name };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return { id: user.id, email: user.email, name: user.name };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
