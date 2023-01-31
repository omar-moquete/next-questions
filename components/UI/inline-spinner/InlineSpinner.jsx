import React from "react";
import { TailSpin } from "react-loader-spinner";

function InlineSpinner({ color = "#fff", className }) {
  return (
    <TailSpin
      height="48px"
      width="48px"
      color={color}
      ariaLabel="tail-spin-loading"
      radius="1"
      visible={true}
      wrapperClass={className}
    />
  );
}

export default InlineSpinner;
