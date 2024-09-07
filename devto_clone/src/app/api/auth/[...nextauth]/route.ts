import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

// Initialize NextAuth handler
const handler = NextAuth(authOptions);

// Export GET and POST explicitly for Next.js route compatibility
export { handler as GET, handler as POST };
    