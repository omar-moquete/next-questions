import React, { useEffect, useState } from "react";
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

  const [isFixed, setIsFixed] = useState(true);

  // NOTE: if path changes to "/feed" make navBar positioning relative, which brings it back to default DOM flow.
  useEffect(() => {
    if (router.asPath === "/feed") setIsFixed(false);
    else setIsFixed(true);
  }, [router.asPath]);

  const { user, authStatus, authStatusNames } = useSelector(
    (state) => state.auth
  );

  return (
    <header
      className={`${classes["nav-bar"]} ${
        isFixed ? classes.fixed : classes["not-fixed"]
      }`}
    >
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
