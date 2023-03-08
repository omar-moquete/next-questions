import React from "react";
import InlineSpinner from "../inline-spinner/InlineSpinner";
import classes from "./PageSpinner.module.scss";

const PageSpinner = function () {
  return (
    <div className={classes.spinner}>
      <InlineSpinner color="#005c97" width={64} />
    </div>
  );
};

export default PageSpinner;
