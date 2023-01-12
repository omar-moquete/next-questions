import React, { useState } from "react";
import classes from "./NavBar.module.scss";
import PrimaryButton from "../../buttons/PrimaryButton";
import { useRouter } from "next/router";
import Link from "next/link";
import NavBarUserProfile from "./navbar-user-profile/NavBarUserProfile";
import { useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import ControlToRender from "./ControlToRender";

const NavBar = function () {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const redirectHandler = function () {
    router.push("/");
  };

  // User profile picture url (state)
  let userPictureState =
    "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
  return (
    <header className={classes["nav-bar"]}>
      <h2 onClick={redirectHandler}>NJSQuestions</h2>
      <div>
        <nav>
          <ControlToRender />
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
