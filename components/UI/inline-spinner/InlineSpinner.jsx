import React from "react";
import { TailSpin } from "react-loader-spinner";

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
      wrapperClass={className || ""}
      wrapperStyle={{
        display: "inline-block",
      }}
    />
  );
}

export default InlineSpinner;
