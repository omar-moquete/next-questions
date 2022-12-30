import React from "react";
import classes from "./PrimaryForm.module.scss";

const PrimaryForm = function (props) {
  return (
    <div className={`${classes["form-container"]} ${props.className}`}>
      <form
        className={`${classes.form} ${props.className}`}
        onSubmit={props.onSubmit}
      >
        {props.children}
      </form>
    </div>
  );
};

export default PrimaryForm;
