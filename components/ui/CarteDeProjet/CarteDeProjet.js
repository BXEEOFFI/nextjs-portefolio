import classes from "./CarteDeProjet.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
export default function CarteDeProjet(props) {
  const router = useRouter();
  const { id, titre, description, annee, slug, client } =
    props.projet;
  return (
    <div key={id}>
      <Link
        href={`/projets/${slug}`}
        style={{ textDecoration: "none" }}>
        <div className={classes.CarteDeProjet}>
          <h3>{titre}</h3>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}
