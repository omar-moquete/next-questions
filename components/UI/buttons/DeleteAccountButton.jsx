import React from "react";
import InlineSpinner2 from "../inline-spinner/InlineSpinner2";
import classes from "./DeleteAccountButton.module.scss";
import SecondaryButton from "./SecondaryButton";

const DeleteAccountButton = function ({ className, onClick, isLoading }) {
  // Allows for name to be shown when using component without typescript
  const props = { onClick };
  return (
    <SecondaryButton className={`${classes.btn} ${className}`} {...props}>
      {isLoading ? <InlineSpinner2 width="24px" /> : "Delete account"}
    </SecondaryButton>
  );
};

export default DeleteAccountButton;
