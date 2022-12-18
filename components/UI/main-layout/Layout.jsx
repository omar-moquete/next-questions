import React from "react";
import classes from "./Layout.module.scss";
import NavBar from "./nav-bar/NavBar";

export default function Layout(props) {
  return (
    <>
      <NavBar />
      <div className={classes.content}>{props.children}</div>
    </>
  );
}
