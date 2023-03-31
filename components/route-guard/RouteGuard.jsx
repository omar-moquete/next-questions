import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageSpinner from "../UI/page-spinner/PageSpinner";

// RouteGuard renders given components or redirects. Renders a spinner while user is being logged in.

// whenLoggedIn: Render RouteGuard children components if user is logged in, or not. This prop is used to guard routes from authenticated or unauthenticated users.
// redirect path is the path to redirect to.

const RouteGuard = function ({ whenLoggedIn = true, redirectPath, children }) {
  const user = useSelector((slices) => slices.auth.user);
  const authStatus = useSelector((slices) => slices.auth.authStatus);
  const authStatusNames = useSelector((slices) => slices.auth.authStatusNames);

  const router = useRouter();

  const [CurrentComponent, setCurrentComponent] = useState(<PageSpinner />);

  useEffect(() => {
    if (whenLoggedIn === true) {
      // if whenLoggedIn === true -> render children if user, redirect if no user.
      if (authStatus === authStatusNames.loaded)
        setCurrentComponent(<>{children}</>);

      if (authStatus === authStatusNames.notLoaded) {
        // Allows for easily navigating to user profile page without having to pass the username through props.
        const redirectTo =
          redirectPath === "/__USER_PROFILE__"
            ? `/${user.username}`
            : redirectPath;
        router.replace(redirectTo);
        setCurrentComponent(null);
      }
    }

    if (whenLoggedIn === false) {
      // if whenLoggedIn === false -> render children if no user, redirect if user.
      if (authStatus === authStatusNames.loaded) {
        // Allows for easily navigating to user profile page without having to pass the username through props.
        const redirectTo =
          redirectPath === "/__USER_PROFILE__"
            ? `/${user.username}`
            : redirectPath;
        router.replace(redirectTo);
        setCurrentComponent(null);
      }
      if (authStatus === authStatusNames.notLoaded)
        setCurrentComponent(<>{children}</>);
    }
  }, [authStatus]);

  return CurrentComponent;
};

export default RouteGuard;
