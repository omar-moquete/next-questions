import React from "react";
import NavBar from "./nav-bar/NavBar";

const Layout = function (props) {
  return (
    <>
      <NavBar />
      {props.children}
    </>
  );
};

export default Layout;
