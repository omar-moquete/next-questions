import React from "react";
import classes from "./SecondaryButton.module.scss";

const SecondaryButton = function (props) {
  return (
    <button {...props} className={`${classes.button} ${props.className}`}>
      {props.children}
    </button>
  );
};

export default SecondaryButton;
