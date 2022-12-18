import React from "react";
import classes from "./NavBar.module.scss";
import BaseButton from "../../buttons/BaseButton";

export default function NavBar() {
  return (
    <header className={classes["nav-bar"]}>
      <h2>NJSQuestions</h2>
      <div>
        <nav>
          <BaseButton href="/login">Login</BaseButton>
        </nav>
      </div>
    </header>
  );
}
