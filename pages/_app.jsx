import React from "react";
import "../styles/globals.scss";
import Layout from "../components/UI/main-layout/Layout";

const MyApp = function ({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};
export default MyApp;
