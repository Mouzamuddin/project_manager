


// import NextAuth, { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compare } from "bcryptjs";
// import { db } from "@/app/db";
// import { users } from "@/app/db/schema";
// import { eq } from "drizzle-orm";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";


// export const authOptions: AuthOptions = {  
//   adapter: DrizzleAdapter(db),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "you@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         if (!credentials) return null;

//         const user = await db
//           .select()
//           .from(users)
//           .where(eq(users.email, credentials.email))
//           .then((res) => res[0]);

//         if (!user) throw new Error("No user found with this email.");

//         const isPasswordValid = await compare(credentials.password, user.password);
//         if (!isPasswordValid) throw new Error("Incorrect password.");

//         return {
//           id: user.id.toString(),
//           name: user.name,
//           email: user.email,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.id;
//       }
//       return session;
//     },
//     async redirect({ baseUrl }) {
//       return baseUrl;
//     }
//   },
//   pages: {
//     signIn: "/auth/signin",
//     signOut: "/",
//     error: "/auth/error",
//   },
//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };