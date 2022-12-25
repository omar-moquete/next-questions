import React from "react";
import NavBar from "./nav-bar/NavBar";
import Footer from "./footer/Footer";

const Layout = function (props) {
  return (
    <>
      <NavBar />
      {props.children}
      <Footer />
    </>
  );
};

export default Layout;
