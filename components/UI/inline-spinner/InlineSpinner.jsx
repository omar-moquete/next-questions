import React from "react";
import { TailSpin } from "react-loader-spinner";
import classes from "./InlineSpinner.module.scss";

function InlineSpinner({
  color = "#fff",
  width = "48px",
  height = "48px",
  className,
}) {
  return (
    <TailSpin
      height={height}
      width={width}
      color={color}
      ariaLabel="tail-spin-loading"
      radius="1"
      visible={true}
      wrapperClass={`${classes.spinner} ${className}`}
    />
  );
}

export default InlineSpinner;
