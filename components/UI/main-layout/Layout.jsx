import React, { useEffect } from "react";
import NavBar from "./nav-bar/NavBar";
import Footer from "./footer/Footer";
import useAuth from "../../../hooks/useAuth";

const Layout = function (props) {
  useAuth();

  return (
    <>
      <NavBar />
      {props.children}
      <Footer />
    </>
  );
};

export default Layout;
