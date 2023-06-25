import { useRouter } from "next/router";
import Link from "next/link";
import { connectToDatabase } from "@/helpers/mongodb";
import Head from "next/head";
export default function Projet(props) {
  // Variables
  const { titre, description, client, annee, slug } = props.projet;
  let clientAAfficher = client;
  if (client == "Projet Personnel") {
    clientAAfficher = "perso";
  }
  return (
    <>
      <Head>
        <title>{titre}</title>
      </Head>
      <h1 style={{ marginBottom: ".5rem" }}>{titre}</h1>
      <small style={{ display: "flex", gap: "15px" }}>
        <Link
          href={`/${clientAAfficher}`}
          style={{ color: "#ee6c4d", textDecoration: "none" }}>
          {client}
        </Link>
        <div>Projet réalisé en {annee}.</div>
      </small>

      <p>{description}</p>
    </>
  );
}

export async function getServerSideProps(context) {
  let projet;
  const { params } = context;
  let slugParam = params.slug;

  try {
    const client = await connectToDatabase();
    const db = client.db();
    projet = await db
      .collection("projets")
      .find({ slug: slugParam })
      .toArray();
    projet = JSON.parse(JSON.stringify(projet));
  } catch (error) {
    projet = [];
  }

  if (!projet[0]) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      projet: projet[0],
    },
  };
}

// export async function getStaticPaths() {
//   let projets;
//   try {
//     const client = await connectToDatabase();
//     const db = client.db();
//     projets = await db.collection("projets").find().toArray();
//   } catch (e) {
//     projets = [];
//   }

//   const dynamicPaths = projets.map((projet) => ({
//     params: {
//       slug: projet.slug,
//     },
//   }));

//   return {
//     paths: dynamicPaths,
//     fallback: "blocking",
//   };
// }

// export async function getStaticProps(context) {
// let projet;
// const { params } = context;
// let slugParam = params.slug;

// try {
//   const client = await connectToDatabase();
//   const db = client.db();
//   projet = await db
//     .collection("projets")
//     .find({ slug: slugParam })
//     .toArray();
//   projet = JSON.parse(JSON.stringify(projet));
// } catch (error) {
//   projet = [];
// }

// if (!projet[0]) {
//   return {
//     notFound: true,
//   };
// }
// return {
//   props: {
//     projet: projet[0],
//   },
//   revalidate: 3600,
// };
// }
