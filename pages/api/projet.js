import { connectToDatabase } from "@/helpers/mongodb";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { titre, slug, client, annee, description, contenu } =
      req.body;

    if (
      !titre ||
      !slug ||
      !client ||
      !annee ||
      !description ||
      !contenu
    ) {
      res.status(422).json({
        message: "Champ du formulaire manquant.",
      });
      return;
    }

    const nouveauProjet = {
      titre,
      slug,
      client,
      annee,
      description,
      contenu,
      dateDePublication: new Date(),
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
    try {
      await db.collection("projets").insertOne(nouveauProjet);
    } catch (error) {
      clientMongoDB.close();
      res.status(500).json({ message: "Un problème est survenu." });
      return;
    }

    clientMongoDB.close();
    res.status(201).json({
      message: "Projet ajouté avec succès.",
      projet: nouveauProjet,
    });
    return;
  }
  res.status(405).json({
    message: "Une erreur est survenue.",
  });
}
