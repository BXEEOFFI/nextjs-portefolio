import classes from "./Header.module.css";
import Link from "next/link";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
export default function Header() {
  const router = useRouter();
  const [session] = useSession();
  const onLogoutClickedHandler = () => {
    signOut();
    router.push("/");
  };
  return (
    <header className={classes.Header}>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <h1 style={{ margin: 0 }}>Maël</h1>

        <nav>
          <ul
            style={{
              display: "flex",
              listStyleType: "none",
              margin: 0,
              padding: 0,
              gap: "15px",
            }}>
            <li>
              <Link href="/">Accueil</Link>
            </li>
            <li>
              <Link href="/projets">Projets</Link>
            </li>
            {session &&
              session.user.roles.includes("administrateur") && (
                <li>
                  <Link href="/ajouter">Ajouter</Link>
                </li>
              )}

            {!session && (
              <>
                <li>
                  <Link href="/connexion">Connexion</Link>
                </li>
                <li>
                  <Link href="/inscription">Inscription</Link>
                </li>
              </>
            )}
            {session && (
              <li>
                <a
                  onClick={onLogoutClickedHandler}
                  style={{ cursor: "pointer" }}>
                  Déconnexion
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
