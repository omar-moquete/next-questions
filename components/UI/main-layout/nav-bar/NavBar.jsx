import React, { useState } from "react";
import classes from "./NavBar.module.scss";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import NavBarButtons from "./NavBarButtons";
import NavBarUserProfile from "./navbar-user-profile/NavBarUserProfile";

const NavBar = function () {
  const router = useRouter();
  const redirectHandler = function () {
    router.push("/");
  };

  const { user, authStatus, authStatusNames } = useSelector(
    (state) => state.auth
  );

  // try assigning controltorender to a var
  return (
    <header className={classes["nav-bar"]}>
      <h2 onClick={redirectHandler}>NJSQuestions</h2>
      <div>
        <nav>
          {/* If loading user show spinner */}

          {authStatus === authStatusNames.loading && (
            <TailSpin
              height="50"
              width="50"
              color="#005c97"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          )}

          {/* If user show profile button  */}

          {user && <NavBarUserProfile imageUrl={user.imageUrl} />}

          {/* If no user after loaded show buttons */}
          {user === null && authStatus !== authStatusNames.loading && (
            <NavBarButtons />
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
