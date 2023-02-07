import Link from "next/link";
import React from "react";
import PrimaryButton from "../../buttons/PrimaryButton";
import SecondaryButton from "../../buttons/SecondaryButton";
import classes from "./NavBarButtons.module.scss";

const NavBarButtons = function (props) {
  return (
    <div className={classes["login-controls"]}>
      <PrimaryButton href="/login">Login</PrimaryButton>
      <SecondaryButton className={classes.secondary} href="/sign-up">
        Sign up
      </SecondaryButton>
    </div>
  );
};

export default NavBarButtons;
