import Button from "@/components/ui/Button/Button";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/client";
import { useState } from "react";
import { SpinnerDotted } from "spinners-react";
import { useRouter } from "next/router";
import Error from "@/components/ui/Error/Error";
import { getSession } from "next-auth/client";
export default function Connexion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const router = useRouter();
  const onFormSubmittedHandler = async (data) => {
    setIsLoading(true);
    setError(null);
    const resultat = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (resultat.error) {
      setError(resultat.error);
    } else {
      router.replace("/");
    }
  };
  return (
    <>
      <Head>
        <title>Connexion</title>
      </Head>
      <h1 style={{ textAlign: "center", marginTop: "35px" }}>
        Connexion
      </h1>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <main style={{ backgroundColor: "#f3f3f3", padding: "30px" }}>
          {error && <Error>{error}</Error>}
          <form onSubmit={handleSubmit(onFormSubmittedHandler)}>
            <p>
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
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
                  Votre adresse email n'est pas correcte, veuillez
                  vérifier à nouveau.
                </small>
              )}
            </p>
            <p>
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
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
                  "Connexion"
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
