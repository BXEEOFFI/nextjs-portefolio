import "@/styles/default.css";
import { SessionProvider } from "next-auth/react";
//Composant
import Layout from "@/components/ui/Layout/Layout";
export default function App({ Component, pageProps }) {
  return (
    <SessionProvider
      session={pageProps.session}
      refetchInterval={5 * 60}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
