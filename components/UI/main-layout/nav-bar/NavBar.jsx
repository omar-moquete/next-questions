import React from "react";
import classes from "./NavBar.module.scss";
import PrimaryLink from "../../buttons/PrimaryLink";

const NavBar = function () {
  return (
    <header className={classes["nav-bar"]}>
      <h2>NJSQuestions</h2>
      <div>
        <nav>
          <PrimaryLink href="/login">Login</PrimaryLink>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
