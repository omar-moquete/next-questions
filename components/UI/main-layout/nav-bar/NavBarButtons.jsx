import Link from "next/link";
import React from "react";
import PrimaryButton from "../../buttons/PrimaryButton";
import classes from "./NavBarButtons.module.scss";

const NavBarButtons = function (props) {
  return (
    <div className={classes["login-controls"]}>
      <PrimaryButton href="/login">Login</PrimaryButton>
      <Link className={classes["sign-up"]} href="/sign-up">
        Sign up
      </Link>
    </div>
  );
};

export default NavBarButtons;
