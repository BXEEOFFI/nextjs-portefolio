import "@/styles/default.css";
import { Provider } from "next-auth/client";
//Composant
import Layout from "@/components/ui/Layout/Layout";
export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
