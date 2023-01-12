import React from "react";
import { useSelector } from "react-redux";
import NavBarUserProfile from "./navbar-user-profile/NavBarUserProfile";
import classes from "./ControlToRender.module.scss";
import PrimaryButton from "../../buttons/PrimaryButton";
import Link from "next/link";

const ControlToRender = function () {
  const user = useSelector((state) => state.auth.user);

  if (user) return <NavBarUserProfile imageUrl={user.imageUrl} />;
  else
    return (
      <div className={classes["login-controls"]}>
        <PrimaryButton href="/login">Login</PrimaryButton>
        <Link className={classes["sign-up"]} href="/sign-up">
          Sign up
        </Link>
      </div>
    );
};

export default ControlToRender;
