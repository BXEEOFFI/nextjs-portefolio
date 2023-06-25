import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "@/helpers/mongodb";
export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res
        .status(401)
        .json({ message: "Impossible de vous authentifiez." });
      return;
    }

    let clientMongoDB;
    try {
      clientMongoDB = await connectToDatabase();
    } catch (e) {
      res.status(500).json({ message: "Impossible de se connecter" });
      return;
    }

    const db = clientMongoDB.db();

    try {
      await db
        .collection("utilisateurs")
        .deleteOne({ email: session.user.email });
    } catch (error) {
      clientMongoDB.close();
      res
        .status(500)
        .json({ message: "Impossible de supprimer l'utilisateur" });
      return;
    }

    res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès !" });
    return;
  } else {
    res.status(403).json({ message: "Votre requête est invalide." });
    return;
  }
}
