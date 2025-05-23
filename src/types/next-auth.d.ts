import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // Adiciona a propriedade 'id' ao tipo 'user' da sessão
      name?: string | null;
      email?: string | null;
      image?: string | null;
      wallet: number;
    };
  }

  /**
   * The shape of the user object returned by the providers.
   * You can add additional properties to the User interface here.
   */
  interface User {
    id: string; // Adiciona a propriedade 'id' ao tipo 'User'
    name?: string | null;
    email?: string | null;
    image?: string | null;
    wallet: number;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    id: string; // Adiciona a propriedade 'id' ao tipo 'JWT'
  }
}