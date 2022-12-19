import React from "react";
import Link from "next/link";
import classes from "./PrimaryLink.module.scss";

const PrimaryLink = function (props) {
  return (
    <Link className={classes.link} href={props.href}>
      <div className={classes.overlay}></div>
      <p>{props.children}</p>
    </Link>
  );
};

export default PrimaryLink;
