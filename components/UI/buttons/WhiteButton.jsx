import React from "react";
import classes from "./WhiteButton.module.scss";

export default function WhiteButton(props) {
  return (
    <button className={classes.button} {...props}>
      {props.children}
    </button>
  );
}
