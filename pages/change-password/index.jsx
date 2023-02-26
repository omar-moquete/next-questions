import React from "react";
import PasswordChangeForm from "../../components/password-change-form/PasswordChangeForm";
import RouteGuard from "../../components/route-guard/RouteGuard";

const changePasswordPage = function () {
  return (
    <RouteGuard redirectPath="/login">
      <PasswordChangeForm />
    </RouteGuard>
  );
};

export default changePasswordPage;
