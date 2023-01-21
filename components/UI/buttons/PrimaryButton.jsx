import React from "react";
import Link from "next/link";
import classes from "./PrimaryButton.module.scss";

const PrimaryButton = function (props) {
  if (props.href)
    return (
      <Link className={`${classes.link} ${props.className}`} {...props}>
        {props.children}
      </Link>
    );
  else
    return (
      <button {...props} className={`${classes.button} ${props.className}`}>
        {props.children}
      </button>
    );
};

export default PrimaryButton;
