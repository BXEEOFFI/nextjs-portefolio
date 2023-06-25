import { connectToDatabase } from "@/helpers/mongodb";
import { hashPassword } from "@/helpers/auth";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const { pseudo, email } = req.body;
    let { password } = req.body;
    if (!pseudo || !email || !password) {
      res.status(422).json({
        message: "Champ du formulaire manquant.",
      });
      return;
    }

    password = await hashPassword(password);

    const nouveauUtilisateur = {
      pseudo,
      email,
      password,
      roles: ["utilisateur"],
    };
    let clientMongoDB;
    try {
      clientMongoDB = await connectToDatabase();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Impossible d'effectuer la requête." });
      return;
    }

    const db = clientMongoDB.db();
    let utilisateur = await db
      .collection("utilisateurs")
      .findOne({ email: email });

    if (utilisateur) {
      res.status(403).json({
        message: "Email déjà utilisé",
      });
      return;
    }

    try {
      await db
        .collection("utilisateurs")
        .insertOne(nouveauUtilisateur);
    } catch (error) {
      clientMongoDB.close();
      res.status(500).json({ message: "Un problème est survenu." });
    }

    clientMongoDB.close();
    res.status(201).json({
      message: "Utilisateur inscrit avec succès!",
    });
  }
}
