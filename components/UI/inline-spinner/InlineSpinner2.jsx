import React from "react";
import { ThreeDots } from "react-loader-spinner";

const InlineSpinner2 = function ({
  color = "#fff",
  width = null,
  height = null,
  className,
}) {
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThreeDots
        height={height}
        width={width}
        color={color}
        ariaLabel="tail-spin-loading"
        radius="1"
        visible={true}
      />
    </div>
  );
};

export default InlineSpinner2;
