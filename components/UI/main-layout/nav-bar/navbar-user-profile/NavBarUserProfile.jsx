import React from "react";
import Link from "next/link";
import classes from "./NavBarUserProfile.module.scss";
import { useRouter } from "next/router";
import useAuth from "../../../../../hooks/useAuth";

const NavBarUserProfile = function (props) {
  const router = useRouter();
  const { logout } = useAuth();
  const logoutHandler = function () {
    // Change login state
    logout();
    router.replace("/");
  };
  return (
    <div className={classes["user-navBar-picture"]}>
      <img
        className={classes.picture}
        // temporary:
        src={props.picture || undefined}
        alt="Profile picture"
      />
      <div className={classes.menu}>
        <div className={classes.controls}>
          <Link className={classes.profile} href="/profile">
            <p>My profile</p>
          </Link>
          <button className={classes.logout} onClick={logoutHandler}>
            <p>Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBarUserProfile;
