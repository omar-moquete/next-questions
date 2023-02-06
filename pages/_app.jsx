import React from "react";
import "../styles/globals.scss";
import Layout from "../components/UI/main-layout/Layout";
import { Provider } from "react-redux";
import store from "../redux-store/store";
import { useRouter } from "next/router";
import Loading from "../components/loading/Loading";
import { useState } from "react";
import { useEffect } from "react";

const MyApp = function ({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleStart = () => setLoading(true);
  const handleFinish = () => setLoading(false);

  useEffect(() => {
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleFinish);
    router.events.on("routeChangeError", handleFinish);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleFinish);
      router.events.off("routeChangeError", handleFinish);
    };
  });

  return (
    <React.StrictMode>
      <Provider store={store}>
        <div id="portal"></div>
        <Layout>
          {loading && <Loading />}
          {!loading && <Component {...pageProps} />}
        </Layout>
      </Provider>
    </React.StrictMode>
  );
};
export default MyApp;
