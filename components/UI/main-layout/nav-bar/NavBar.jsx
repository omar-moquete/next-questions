import React from "react";
import classes from "./NavBar.module.scss";
import PrimaryButton from "../../buttons/PrimaryButton";
import { useRouter } from "next/router";

const NavBar = function () {
  const router = useRouter();
  const redirectHandler = function () {
    router.push("/");
  };
  return (
    <header className={classes["nav-bar"]}>
      <h2 onClick={redirectHandler}>NJSQuestions</h2>
      <div>
        <nav>
          <PrimaryButton href="/login">Login</PrimaryButton>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
