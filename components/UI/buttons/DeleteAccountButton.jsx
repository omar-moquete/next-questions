import React from "react";
import classes from "./DeleteAccountButton.module.scss";
import SecondaryButton from "./SecondaryButton";

const DeleteAccountButton = function ({ className, onClick }) {
  // Allows for name to be shown when using component without typescript
  const props = { onClick };
  return (
    <SecondaryButton className={`${classes.btn} ${className}`} {...props}>
      Delete account
    </SecondaryButton>
  );
};

export default DeleteAccountButton;
