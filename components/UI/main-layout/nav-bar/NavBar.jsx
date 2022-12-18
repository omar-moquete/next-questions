import React from "react";
import classes from "./NavBar.module.scss";
import PrimaryButton from "../../buttons/PrimaryButton";

export default function NavBar() {
  return (
    <header className={classes["nav-bar"]}>
      <h2>NJSQuestions</h2>
      <div>
        <nav>
          <PrimaryButton href="/login">Login</PrimaryButton>
        </nav>
      </div>
    </header>
  );
}
