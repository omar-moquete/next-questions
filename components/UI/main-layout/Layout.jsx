import React from "react";
import NavBar from "./nav-bar/NavBar";

const Layout = function (props) {
  return (
    <>
      <NavBar />
      <div>{props.children}</div>
    </>
  );
};

export default Layout;
