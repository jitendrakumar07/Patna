import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Mock user data
        const users = [
          {
            id: "1",
            name: "Admin User",
            username: "admin",
            password: "admin123",
            role: "admin",
          },
          {
            id: "2",
            name: "Normal User",
            username: "user",
            password: "user123",
            role: "user",
          },
        ];

        const user = users.find(
          (u) =>
            u.username === credentials?.username &&
            u.password === credentials?.password
        );

        if (user) {
          return { id: user.id, name: user.name, role: user.role };
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/signin", // ✅ Always use custom sign-in page
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
