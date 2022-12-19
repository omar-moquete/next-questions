import React from "react";
import classes from "./SecondaryButton.module.scss";

const SecondaryButton = function (props) {
  return (
    <button className={classes.button} {...props}>
      {props.children}
    </button>
  );
};

export default SecondaryButton;
