import React, { useState } from "react";
import Link from "next/link";
import classes from "./NavBarUserProfile.module.scss";
import { useRouter } from "next/router";
import useAuth from "../../../../../hooks/useAuth";
import AvatarIllustration from "../../../svg/AvatarIllustration";
import { useSelector } from "react-redux";

const NavBarUserProfile = function (props) {
  const router = useRouter();
  const { logout } = useAuth();
  const logoutHandler = function () {
    logout();
    router.replace("/login");
  };

  const [isHovering, setIsHovering] = useState(false);
  const hoverEnterHandler = () => {
    setIsHovering(true);
  };
  const hoverExitHandler = () => {
    setIsHovering(false);
  };

  const username = useSelector((state) => state.auth.user.username);
  return (
    <div
      className={`${classes["user-navBar-picture"]} ${
        isHovering ? classes.grow : ""
      }`}
    >
      {props.imageUrl && <img src={props.imageUrl} alt="Profile picture" />}

      {!props.imageUrl && <AvatarIllustration className={classes.avatar} />}
      <div
        className={classes.menu}
        onMouseEnter={hoverEnterHandler}
        onMouseLeave={hoverExitHandler}
      >
        <div className={classes.controls}>
          <Link className={classes.profile} href={"/" + username}>
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
