import Head from "next/head";
import { set, useForm } from "react-hook-form";
import { SpinnerDotted } from "spinners-react";
import { useEffect, useState } from "react";
import Error from "@/components/ui/Error/Error";
import { useRouter } from "next/router";
import Button from "@/components/ui/Button/Button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
export default function Ajouter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const onSubmittedHandler = async (data) => {
    if (!isLoading) {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/projet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const fetchedData = await response.json();

      if (!response.ok) {
        setError(
          fetchedData.message || "Une erreur est survenu dans l'API"
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
        router.replace(`/projets/${data.slug}`);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Ajouter un projet</title>
      </Head>
      <h1 style={{ textAlign: "center", marginTop: "35px" }}>
        Ajouter un projet
      </h1>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <main style={{ backgroundColor: "#f3f3f3", padding: "30px" }}>
          {(errors.titre ||
            errors.slug ||
            errors.client ||
            errors.annee ||
            errors.description ||
            errors.contenu) && (
            <Error>
              Veuillez remplir tous les champs du formulaire
            </Error>
          )}
          {error && <Error>{error}</Error>}
          <form onSubmit={handleSubmit(onSubmittedHandler)}>
            <p>
              <label htmlFor="titre">Titre</label>
              <input
                id="titre"
                placeholder="Titre du projet"
                className="input"
                {...register("titre", {
                  required: true,
                })}
              />
            </p>
            <p>
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                placeholder="Slug du projet"
                className="input"
                {...register("slug", {
                  required: true,
                })}
              />
            </p>
            <p>
              <label htmlFor="client">Client</label>
              <input
                id="client"
                placeholder="Client associé projet"
                className="input"
                {...register("client", {
                  required: true,
                })}
              />
            </p>
            <p>
              <label htmlFor="annee">Année</label>
              <input
                id="annee"
                placeholder="Année du projet"
                className="input"
                {...register("annee", {
                  required: true,
                })}
              />
            </p>
            <p>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Description du projet"
                rows={5}
                className="input"
                style={{
                  fontFamily: "arial",
                }}
                {...register("description", {
                  required: true,
                })}></textarea>
            </p>
            <p>
              <label htmlFor="contenu">Contenu</label>
              <textarea
                id="contenu"
                placeholder="Contenu du projet"
                rows={5}
                className="input"
                style={{
                  fontFamily: "arial",
                }}
                {...register("contenu", {
                  required: true,
                })}></textarea>
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
                  "Ajouter"
                )}
              </Button>
            </div>
          </form>
        </main>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/connexion",
        permanent: false,
      },
    };
  }

  if (session && !session.user.roles.includes("administrateur")) {
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
