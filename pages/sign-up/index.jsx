import React from "react";
import RouteGuard from "../../components/route-guard/RouteGuard";
import SignUpForm from "../../components/sign-up-form/SignupForm";

const SignupPage = function () {
  return (
    <RouteGuard whenLoggedIn={false} redirectPath="/__USER_PROFILE__">
      <SignUpForm />
    </RouteGuard>
  );
};

export default SignupPage;
