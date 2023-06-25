import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { connectToDatabase } from "@/helpers/mongodb";
import { verifyPassword } from "@/helpers/auth";
export default NextAuth({
  providers: [
    Providers.Credentials({
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
  callbacks: {
    jwt: async (token, user) => {
      user && (token.user = user);
      return token;
    },
    session: async (session, user) => {
      session.user = user.user;
      return session;
    },
  },
});
