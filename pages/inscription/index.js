import Button from "@/components/ui/Button/Button";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Error from "@/components/ui/Error/Error";
import Link from "next/link";
import { SpinnerDotted } from "spinners-react";
import { getSession } from "next-auth/client";
export default function Inscription() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmittedHandler = async (data) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);
    const response = await fetch("/api/inscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const fecthedData = await response.json();

    if (!response.ok) {
      setError(
        fecthedData.message || "Une erreur est survenu dans l'API"
      );
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>Inscription</title>
      </Head>
      <h1 style={{ textAlign: "center", marginTop: "35px" }}>
        Inscription
      </h1>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <main style={{ backgroundColor: "#f3f3f3", padding: "30px" }}>
          {error && <Error>{error}</Error>}
          {success ? (
            <p>
              Vous avez été inscrit avec succès, vous pouvez vous{" "}
              <Link href="/connexion">connectez</Link>
            </p>
          ) : (
            <form onSubmit={handleSubmit(onFormSubmittedHandler)}>
              <p>
                <label htmlFor="pseudo">Pseudo</label>
                <input
                  type="text"
                  placeholder="Pseudo"
                  className="input"
                  {...register("pseudo", { required: true })}
                />
                {errors.pseudo && (
                  <small>Veuillez renseigner ce champ.</small>
                )}
              </p>
              <p>
                <label htmlFor="email">Adresse email</label>
                <input
                  type="email"
                  placeholder="Adresse email"
                  className="input"
                  {...register("email", {
                    required: true,
                    pattern:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                />
                {errors.email && errors.email.type === "required" && (
                  <small>Veuillez renseigner ce champ.</small>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <small>
                    Votre adresse email n'est pas correct, veuillez
                    vérifier de nouveau.
                  </small>
                )}
              </p>
              <p>
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="input"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <small>Veuillez renseigner ce champ.</small>
                )}
              </p>
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Button>
                  {isLoading ? (
                    <SpinnerDotted
                      size={15}
                      thickness={100}
                      speed={100}
                      color="#ffffff"
                    />
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </div>
            </form>
          )}
        </main>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
