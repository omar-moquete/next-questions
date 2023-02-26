import React from "react";
import LoginForm from "../../components/login-form/LoginForm";
import RouteGuard from "../../components/route-guard/RouteGuard";

const LoginPage = function () {
  return (
    <RouteGuard whenLoggedIn={false} redirectPath="/__USER_PROFILE__">
      <LoginForm />
    </RouteGuard>
  );
};

export default LoginPage;
