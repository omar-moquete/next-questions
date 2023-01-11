import React from "react";
import "../styles/globals.scss";
import Layout from "../components/UI/main-layout/Layout";
import { Provider } from "react-redux";
import store from "../redux-store/store";

const MyApp = function ({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </React.StrictMode>
  );
};
export default MyApp;
