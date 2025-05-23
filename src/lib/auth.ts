import { AuthOptions } from "next-auth";
import client from "@/modules/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";


// export const authOptions: AuthOptions = {
  
//     providers: [
//         CredentialsProvider({
//             name: 'credentials',
//             credentials: {
//                 email: { label: 'email', type: 'text' },
//                 password: { label: 'password', type: 'password' },
//             },
//             async authorize(credentials, req) {

//                 // console.log('aqui')
//                 // const res = await fetch("http://localhost:3000/api/login", {
//                 //     method: 'POST',
//                 //     body: JSON.stringify(credentials),
//                 //     headers: { "Content-Type": "application/json" }
//                 // })
//                 // const user = await res.json()
//                 // console.warn('useeerrr',user)
//                 // if (res.ok && user) {
//                 //     return user
//                 // }

//                 // return null
             
//                 if (!credentials?.email || !credentials?.password) {
//                     return null;
//                 }

//                 // Agora pode acessar sem erro
//                 const { email, password } = credentials;

//                 await client.connect();
//                 const db = client.db("bankOffice");
                
//                 const user = await db.collection("users").findOne({ email: email });
//                 // console.log('user',user)
//                 if (!user) return null;


//                 const isValid = await compare(password, user.password);
//                 if (!isValid) return null;


//                 return {
//                     id: user._id.toString(),
//                     email: user.email,
//                     name: user.name || user.email,
//                 };
//             }
//         })
//     ],
//     pages: {
//         signIn: '/login'
//     },
//     callbacks: {
        
//         async session({ session, token, user }) {
//             console.log('session', session)
//             console.log('user', user)
//             session.user = { ...session.user, id: user.id } as { id: string, name: string, email: string }

//             return session;
//         }
//     }
// }

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
        console.log('userrr',user)
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
        //   console.log('session',session)
        //   console.log('token',token)
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
