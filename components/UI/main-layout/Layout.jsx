import React, { useEffect } from "react";
import NavBar from "./nav-bar/NavBar";
import Footer from "./footer/Footer";
import useAuth from "../../../hooks/useAuth";
import FloatingActionButton from "./floating-action-button/FloatingActionButton";

const Layout = function (props) {
  useAuth();

  // [ ]TODO: Add "back to top" button (maybe an arrow up bottom-centered)
  return (
    <>
      <NavBar />
      {props.children}
      <FloatingActionButton />
      <Footer />
    </>
  );
};

export default Layout;
