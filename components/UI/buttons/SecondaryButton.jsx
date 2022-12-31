import React from "react";
import classes from "./SecondaryButton.module.scss";

const SecondaryButton = function (props) {
  if (props.href)
    return (
      <a {...props} className={`${classes.link} ${props.className}`}>
        {props.children}
      </a>
    );
  else
    return (
      <button {...props} className={`${classes.button} ${props.className}`}>
        {props.children}
      </button>
    );
};

export default SecondaryButton;
