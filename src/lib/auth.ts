import { AuthOptions } from "next-auth";
import client from "@/modules/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;

        await client.connect();
        const db = client.db("bankOffice");
        const user = await db.collection("users").findOne({ email });

        if (!user) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email,
          wallet: user.wallet
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.wallet = (user as any).wallet;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        wallet: token.wallet as number
      };
      return session;
    }
  }
};
