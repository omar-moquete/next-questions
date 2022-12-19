import React from "react";
import "../styles/globals.scss";
import Layout from "../components/UI/main-layout/Layout";

const MyApp = function ({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </React.StrictMode>
  );
};
export default MyApp;
