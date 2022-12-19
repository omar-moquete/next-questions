import React from "react";
import Link from "next/link";
import classes from "./PrimaryButton.module.scss";

const PrimaryButton = function (props) {
  if (props.href)
    return (
      <Link
        className={`${classes.button} ${props.className || ""}`}
        href={props.href}
      >
        <div className={classes.overlay}></div>
        {props.children}
      </Link>
    );
  else
    return (
      <button className={`${classes.button} ${props.className || ""}`}>
        <div className={classes.overlay}></div>
        {props.children}
      </button>
    );
};

export default PrimaryButton;
