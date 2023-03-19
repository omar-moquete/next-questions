import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import DeleteAccountForm from "../../../components/delete-account-form/DeleteAccountForm";
import RouteGuard from "../../../components/route-guard/RouteGuard";
import PageSpinner from "../../../components/UI/page-spinner/PageSpinner";

const DeleteAccountPage = function () {
  const router = useRouter();
  const { user, authStatus, authStatusNames } = useSelector(
    (slices) => slices.auth
  );
  const visitedUser = router.asPath.split("/")[1];

  const [Component, setComponent] = useState(<PageSpinner />);

  useEffect(() => {
    // If user did not load (was not previously logged in)
    if (authStatus === authStatusNames.notLoaded) {
      router.replace("/login");
      setComponent(<PageSpinner />);
      return;
    }

    // If authStatus is loaded and this loaded user username is NOT the currently visited user.
    if (
      authStatus === authStatusNames.loaded &&
      user.username !== visitedUser
    ) {
      // Redirect to user profile
      router.replace(`/${visitedUser}`);
      setComponent(<PageSpinner />);
      return;
    }

    // If authStatus is loaded and this loaded user username IS the currently visited user.
    if (
      authStatus === authStatusNames.loaded &&
      user.username === visitedUser
    ) {
      setComponent(<DeleteAccountForm />);
      return;
    }

    if (authStatus === authStatusNames.notLoaded) router.replace("/login");
  }, [user, authStatus]);

  return Component;
};

export default DeleteAccountPage;
