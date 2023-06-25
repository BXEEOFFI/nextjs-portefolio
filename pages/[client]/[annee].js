import { useRouter } from "next/router";
import CarteDeProjet from "@/components/ui/CarteDeProjet/CarteDeProjet";
import FiltresDeClient from "@/components/ui/FiltresDeClient/FiltresDeClient";
import { connectToDatabase } from "@/helpers/mongodb";
import Head from "next/head";
export default function ProjetDuClientFiltre(props) {
  const router = useRouter();
  let nomDuClient = router.query.client;
  if (nomDuClient == "perso") {
    nomDuClient = `Projet Personnels (${router.query.annee})`;
  } else {
    nomDuClient = `Projet de ${nomDuClient} (${router.query.annee})`;
  }
  return (
    <>
      <Head>
        <title>{nomDuClient}</title>
      </Head>
      <h1>{nomDuClient}</h1>
      <FiltresDeClient
        client={router.query.client}
        annees={props.annees}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginTop: "15px",
        }}>
        {props.projets.map((projet) => (
          <CarteDeProjet projet={projet} key={projet._id} />
        ))}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const client = await connectToDatabase();
  const db = client.db();
  const projets = await db.collection("projets").find().toArray();
  let arrayPaths = projets.map((projet) => {
    if (projet.client == "Projet Personnel") {
      return ["perso", projet.annee.toString()];
    } else {
      return [projet.client, projet.annee.toString()];
    }
  });
  arrayPaths = [...new Set(arrayPaths)];
  const dynamicPaths = arrayPaths.map((path) => ({
    params: {
      client: path[0],
      annee: path[1],
    },
  }));
  return {
    paths: dynamicPaths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  let projets;
  let annees;
  const { params } = context;
  let clientParam = params.client;
  let anneeParam = +params.annee;

  try {
    const client = await connectToDatabase();
    const db = client.db();
    if (clientParam == "perso") {
      projets = await db
        .collection("projets")
        .find({ client: "Projet Personnel" })
        .sort({ dateDePublication: "asc" })
        .toArray();
    } else {
      projets = await db
        .collection("projets")
        .find({ client: clientParam })
        .sort({ dateDePublication: "asc" })
        .toArray();
    }
    projets = JSON.parse(JSON.stringify(projets));

    annees = projets.map((projet) => projet.annee);
    annees = [...new Set(annees)];
    projets = projets.filter((projet) => projet.annee == anneeParam);
  } catch (error) {
    projets = [];
  }

  if (projets.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      projets: projets,
      annees: annees,
    },
    revalidate: 3600,
  };
}
