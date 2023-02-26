import React, { useRef } from "react";
import PasswordResetFrom from "../../../components/password-reset-form/PasswordResetForm";
import RouteGuard from "../../../components/route-guard/RouteGuard";

const PasswordResetPage = function () {
  return (
    <RouteGuard whenLoggedIn={false} redirectPath="/change-password">
      <PasswordResetFrom />
    </RouteGuard>
  );
};

export default PasswordResetPage;
