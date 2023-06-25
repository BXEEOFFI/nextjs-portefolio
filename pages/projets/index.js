import CarteDeProjet from "@/components/ui/CarteDeProjet/CarteDeProjet";
import { connectToDatabase } from "@/helpers/mongodb";
import Head from "next/head";
export default function Projets(props) {
  return (
    <>
      <Head>
        <title>Mes projets</title>
      </Head>
      <h1>Mes projets</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}>
        {props.projets.map((projet) => (
          <CarteDeProjet projet={projet} key={projet._id} />
        ))}
      </div>
    </>
  );
}

export async function getStaticProps() {
  let projets;
  try {
    const client = await connectToDatabase();
    const db = client.db();
    projets = await db
      .collection("projets")
      .find()
      .sort({ annee: "desc" })
      .toArray();
  } catch (error) {
    projets = [];
  }

  return {
    props: {
      projets: JSON.parse(JSON.stringify(projets)),
    },
  };
}
