import Link from "next/link";
import Head from "next/head";
export default function Error404() {
  return (
    <div style={{ textAlign: "center" }}>
      <Head>
        <title>Erreur 404 - Page introuvable</title>
      </Head>
      <h1
        style={{
          fontSize: "5rem",
          marginTop: "150px",
          marginBottom: "10px",
          textAlign: "center",
          color: "#ee6c4d",
        }}>
        404
      </h1>
      <p style={{ fontSize: "1.5rem" }}>Cette page n'existe pas.</p>
      <Link
        href="/"
        style={{ textDecoration: "none", color: "black" }}>
        Retourner à l'accueil
      </Link>
    </div>
  );
}
