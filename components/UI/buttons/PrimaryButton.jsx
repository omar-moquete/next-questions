import React from "react";
import Link from "next/link";
import classes from "./PrimaryButton.module.scss";

const PrimaryButton = function (props) {
  if (props.href)
    return (
      <Link className={classes.link} {...props}>
        {console.log(props.href)}

        {props.children}
      </Link>
    );
  else return <button className={classes.button}>{props.children}</button>;
};

export default PrimaryButton;
