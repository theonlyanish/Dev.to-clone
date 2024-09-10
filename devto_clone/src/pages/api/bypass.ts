import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/server/db';
import { hash } from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mockEmail = 'mockuser@example.com';
  const mockPassword = 'mockpassword';
  const mockName = 'Mock User';

  // Check if the mock user already exists
  let user = await db.user.findUnique({ where: { email: mockEmail } });

  if (!user) {
    // Hash the password
    const hashedPassword = await hash(mockPassword, 12);

    // Create the mock user
    user = await db.user.create({
      data: {
        email: mockEmail,
        password: hashedPassword,
        name: mockName,
        emailVerified: new Date(),
      },
    });
  }

  res.status(200).json({ email: mockEmail, password: mockPassword });
}