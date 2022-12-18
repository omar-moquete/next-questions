import React from "react";
import Link from "next/link";
import classes from "./BaseButton.module.scss";

export default function BaseButton(props) {
  if (props.href)
    return (
      <Link className={classes.button} href={props.href}>
        {props.children}
      </Link>
    );
  else
    return (
      <button className={classes.button} {...props}>
        {props.children}
      </button>
    );
}
