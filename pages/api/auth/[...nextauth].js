import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/helpers/mongodb";
import { verifyPassword } from "@/helpers/auth";
export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials;

        const clientMongoDB = await connectToDatabase();

        const utilisateur = await clientMongoDB
          .db()
          .collection("utilisateurs")
          .findOne({ email: email });

        if (!utilisateur) {
          clientMongoDB.close();
          throw new Error("Impossible de vous authentifier.");
        }

        const isValid = verifyPassword(
          password,
          utilisateur.password
        );

        if (!isValid) {
          clientMongoDB.close();
          throw new Error("Impossible de vous authentifier.");
        }

        clientMongoDB.close();
        return {
          email: utilisateur.email,
          name: utilisateur.pseudo,
          id: utilisateur._id,
          roles: utilisateur.roles,
        };
      },
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
};
export default NextAuth(authOptions);
