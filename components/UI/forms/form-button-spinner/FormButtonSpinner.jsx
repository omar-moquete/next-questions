import React from "react";
import { TailSpin } from "react-loader-spinner";
import classes from "./FormButtonSpinner.module.scss";

function FormButtonSpinner() {
  return (
    <TailSpin
      height="2.41rem"
      width="2.41rem"
      color="#fff"
      ariaLabel="tail-spin-loading"
      radius="1"
      visible={true}
      wrapperClass={classes.wrapper}
    />
  );
}

export default FormButtonSpinner;
